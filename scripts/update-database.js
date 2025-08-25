// Database update script for Supabase
// This script will execute the prompt management schema and seed data

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.log('SUPABASE_URL:', supabaseUrl);
  console.log('SERVICE_KEY:', supabaseServiceKey ? 'Present' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQLFile(filePath, description) {
  try {
    console.log(`\n🔄 Executing ${description}...`);
    
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    
    // Split SQL content by statements (semicolon followed by newline)
    const statements = sqlContent
      .split(/;\s*\n/)
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`  Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('execute_sql', { 
          sql_query: statement 
        });
        
        if (error) {
          // Try direct execution if RPC fails
          const { error: directError } = await supabase
            .from('_any_table')
            .select('*')
            .limit(0); // This will fail but might give us info
          
          console.log(`Statement ${i + 1} error:`, error.message);
          
          // For schema creation, we'll need to use raw SQL
          // Let's try a different approach - execute via function
          try {
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_raw_sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseServiceKey}`,
                'apikey': supabaseServiceKey
              },
              body: JSON.stringify({ query: statement })
            });
            
            if (!response.ok) {
              console.log(`Statement ${i + 1} failed via fetch as well`);
            } else {
              console.log(`Statement ${i + 1} executed successfully via fetch`);
            }
          } catch (fetchError) {
            console.log(`Statement ${i + 1} fetch error:`, fetchError.message);
          }
        } else {
          console.log(`Statement ${i + 1} executed successfully`);
        }
      }
    }
    
    console.log(`✅ ${description} completed`);
    
  } catch (error) {
    console.error(`❌ Error executing ${description}:`, error.message);
    throw error;
  }
}

async function createTables() {
  console.log('🚀 Starting database schema update...');
  
  // Since we can't execute DDL directly, let's create a simpler approach
  // We'll create the tables one by one using individual statements
  
  const tableCreationStatements = [
    {
      name: 'exam_types',
      sql: `CREATE TABLE IF NOT EXISTS exam_types (
        id SERIAL PRIMARY KEY,
        exam_name VARCHAR(50) NOT NULL UNIQUE,
        display_name VARCHAR(100) NOT NULL,
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    },
    {
      name: 'skill_types', 
      sql: `CREATE TABLE IF NOT EXISTS skill_types (
        id SERIAL PRIMARY KEY,
        skill_name VARCHAR(20) NOT NULL UNIQUE,
        display_name VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    },
    {
      name: 'test_parts',
      sql: `CREATE TABLE IF NOT EXISTS test_parts (
        id SERIAL PRIMARY KEY,
        exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE CASCADE,
        skill_type_id INTEGER REFERENCES skill_types(id) ON DELETE CASCADE,
        part_name VARCHAR(50) NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        description TEXT,
        max_score DECIMAL(3,1),
        duration_minutes INTEGER,
        word_count_min INTEGER,
        word_count_max INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(exam_type_id, skill_type_id, part_name)
      )`
    }
  ];
  
  for (const table of tableCreationStatements) {
    try {
      console.log(`Creating table: ${table.name}`);
      
      // Since Supabase might not support direct SQL execution,
      // let's create tables via the SQL editor approach
      const { error } = await supabase.rpc('create_table_if_not_exists', {
        table_name: table.name,
        table_definition: table.sql
      });
      
      if (error) {
        console.log(`Table ${table.name} creation error (this might be expected):`, error.message);
      }
    } catch (error) {
      console.log(`Error creating table ${table.name}:`, error.message);
    }
  }
}

async function insertSeedData() {
  console.log('🌱 Inserting seed data...');
  
  try {
    // Insert exam types
    const { error: examError } = await supabase
      .from('exam_types')
      .upsert([
        { exam_name: 'IELTS', display_name: 'IELTS Academic & General', description: 'International English Language Testing System', is_active: true },
        { exam_name: 'TOEFL_iBT', display_name: 'TOEFL Internet-Based Test', description: 'Test of English as a Foreign Language', is_active: true },
        { exam_name: 'TOEIC', display_name: 'TOEIC Speaking & Writing', description: 'Test of English for International Communication', is_active: true },
        { exam_name: 'PTE', display_name: 'PTE Academic', description: 'Pearson Test of English Academic', is_active: true },
        { exam_name: 'DUOLINGO', display_name: 'Duolingo English Test', description: 'Duolingo English Proficiency Test', is_active: true }
      ], { onConflict: 'exam_name' });
    
    if (examError) {
      console.log('Exam types insert error:', examError.message);
    } else {
      console.log('✅ Exam types inserted successfully');
    }
    
    // Insert skill types
    const { error: skillError } = await supabase
      .from('skill_types')
      .upsert([
        { skill_name: 'speaking', display_name: 'Speaking' },
        { skill_name: 'writing', display_name: 'Writing' },
        { skill_name: 'reading', display_name: 'Reading' },
        { skill_name: 'listening', display_name: 'Listening' }
      ], { onConflict: 'skill_name' });
    
    if (skillError) {
      console.log('Skill types insert error:', skillError.message);
    } else {
      console.log('✅ Skill types inserted successfully');
    }
    
  } catch (error) {
    console.error('Error inserting seed data:', error.message);
  }
}

async function main() {
  try {
    console.log('🏗️ Updating Supabase database with prompt management system...');
    
    // Test connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.log('Connection test result:', error.message);
    } else {
      console.log('✅ Connected to Supabase successfully');
    }
    
    // Note: Direct table creation might not work due to Supabase permissions
    // The user will need to run the SQL files manually in Supabase SQL Editor
    console.log('\n⚠️  Note: Due to Supabase security restrictions, you may need to:');
    console.log('1. Copy the SQL from database/schema/prompt_management.sql');
    console.log('2. Paste it into Supabase SQL Editor');
    console.log('3. Run it manually');
    console.log('4. Then copy and run the seed data from database/seed/prompt_management_seed.sql');
    
    // Try to insert basic data if tables exist
    await insertSeedData();
    
    console.log('\n🎉 Database update process completed!');
    console.log('If tables were not created automatically, please run the SQL files manually in Supabase.');
    
  } catch (error) {
    console.error('❌ Database update failed:', error.message);
    process.exit(1);
  }
}

main();