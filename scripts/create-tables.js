const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTables() {
  console.log('Creating database tables...');

  try {
    // Check if we can access the database
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1);

    if (error) {
      console.error('Cannot connect to database:', error.message);
      
      console.log('\n=== MANUAL SETUP REQUIRED ===');
      console.log('Please run the following SQL in your Supabase SQL Editor:');
      console.log('1. Go to https://supabase.com/dashboard/project/zszhcmcskltkzfapwsek/sql');
      console.log('2. Copy and paste the contents of database/schema/test_system.sql');
      console.log('3. Click "Run" to execute the schema');
      console.log('===============================\n');
      
      return;
    }

    console.log('Successfully connected to Supabase database');
    console.log('\nTo complete the setup:');
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/zszhcmcskltkzfapwsek/sql');
    console.log('2. Copy the contents of database/schema/test_system.sql');
    console.log('3. Paste and execute the SQL to create all tables');

  } catch (err) {
    console.error('Setup error:', err.message);
  }
}

createTables();