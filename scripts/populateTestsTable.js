// scripts/populateTestsTable.js
// Run this script to populate the Supabase tests table with Top 30 language tests
// Usage: node scripts/populateTestsTable.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  const envVars = envFile.split('\n');
  envVars.forEach(line => {
    if (line && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        // Remove quotes if present
        const cleanValue = value.trim().replace(/^["'](.*)["']$/, '$1');
        process.env[key.trim()] = cleanValue;
      }
    }
  });
}

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env.local file');
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const languageTestsData = [
  // TOP 10
  { name: 'TOEIC', language_group: 'english', badge_type: 'gold', badge_text: '#1 Global', subtitle: 'Business English proficiency test, essential for Asian job markets', features: ['Business English', 'Listening & Reading', 'Speaking & Writing'] },
  { name: 'Cambridge English', language_group: 'english', badge_type: 'gold', badge_text: '#2 Global', subtitle: 'Comprehensive English certification system (FCE, CAE, CPE)', features: ['Multiple levels', '4 skills assessment', 'Lifetime validity'] },
  { name: 'Duolingo English Test', language_group: 'english', badge_type: 'gold', badge_text: '#3 Global', subtitle: 'Online English proficiency test with rapid growth', features: ['Online delivery', 'AI-powered', 'Quick results', 'Affordable'] },
  { name: 'IELTS', language_group: 'english', badge_type: 'gold', badge_text: '#4 Global', subtitle: 'International English Language Testing System for UK/Australia', features: ['Academic & General', '4 skills', 'Immigration accepted'] },
  { name: 'TOEFL iBT', language_group: 'english', badge_type: 'gold', badge_text: '#5 Global', subtitle: 'Internet-based English test for US university admissions', features: ['Academic focus', 'Internet-based', 'US preferred'] },
  { name: 'JLPT', language_group: 'japanese', badge_type: 'gold', badge_text: '#6 Global', subtitle: 'Japanese Language Proficiency Test', features: ['5 levels (N5-N1)', 'Reading & Listening', 'Twice yearly'] },
  { name: 'HSK', language_group: 'chinese', badge_type: 'gold', badge_text: '#7 Global', subtitle: 'Chinese Proficiency Test (Hanyu Shuiping Kaoshi)', features: ['9 levels', 'Government official', 'University admission'] },
  { name: 'PTE Academic', language_group: 'english', badge_type: 'gold', badge_text: '#8 Global', subtitle: 'AI-scored English test with fast results', features: ['AI scoring', 'Fast results', '4 skills', 'Computer-based'] },
  { name: 'DELF/DALF', language_group: 'french', badge_type: 'gold', badge_text: '#9 Global', subtitle: 'Official French proficiency certification', features: ['Government official', '6 levels', 'Lifetime validity'] },
  { name: 'TOEFL Junior', language_group: 'english', badge_type: 'gold', badge_text: '#10 Global', subtitle: 'English assessment for middle and high school students', features: ['Age-appropriate', 'Academic focus', 'School programs'] },

  // TOP 11-20
  { name: 'TOPIK', language_group: 'korean', badge_type: 'silver', badge_text: '#11 Global', subtitle: 'Test of Proficiency in Korean', features: ['6 levels', 'University admission', 'Visa requirement'] },
  { name: 'Goethe-Zertifikat', language_group: 'german', badge_type: 'silver', badge_text: '#12 Global', subtitle: 'Official German language certification', features: ['6 levels (A1-C2)', 'Worldwide recognition', 'Cultural focus'] },
  { name: 'CELPE-Bras', language_group: 'portuguese', badge_type: 'silver', badge_text: '#13 Global', subtitle: 'Certificate of Proficiency in Portuguese for Foreigners', features: ['Brazilian Portuguese', 'University admission', '4 skills'] },
  { name: 'TCF', language_group: 'french', badge_type: 'silver', badge_text: '#14 Global', subtitle: 'Test de connaissance du français', features: ['Immigration focus', 'Canada accepted', 'Multiple versions'] },
  { name: 'DELE', language_group: 'spanish', badge_type: 'silver', badge_text: '#15 Global', subtitle: 'Diplomas de Español como Lengua Extranjera', features: ['6 levels', 'Lifetime validity', 'Spain official'] },
  { name: 'TOEFL ITP', language_group: 'english', badge_type: 'silver', badge_text: '#16 Global', subtitle: 'Institutional Testing Program for organizations', features: ['Institution-based', 'Paper format', 'Cost-effective'] },
  { name: 'TEF/TEF Canada', language_group: 'french', badge_type: 'silver', badge_text: '#17 Global', subtitle: 'Test d\'évaluation de français for Canada immigration', features: ['Canada immigration', 'Computer-based', '4 skills'] },
  { name: 'YCT', language_group: 'chinese', badge_type: 'silver', badge_text: '#18 Global', subtitle: 'Youth Chinese Test for young learners', features: ['Age 3-15', '4 levels', 'Game-like format'] },
  { name: 'OPIC', language_group: 'english', badge_type: 'silver', badge_text: '#19 Global', subtitle: 'Oral Proficiency Interview by Computer (Korea focus)', features: ['Speaking only', 'Computer-based', 'Korea popular'] },
  { name: 'TOCFL', language_group: 'chinese', badge_type: 'silver', badge_text: '#20 Global', subtitle: 'Test of Chinese as a Foreign Language (Taiwan)', features: ['Traditional Chinese', 'Taiwan focus', '5 levels'] },

  // TOP 21-30
  { name: 'J-TEST', language_group: 'japanese', badge_type: 'bronze', badge_text: '#21 Global', subtitle: 'Practical Japanese proficiency test', features: ['Practical focus', 'Monthly tests', 'Business Japanese'] },
  { name: 'SIELE', language_group: 'spanish', badge_type: 'bronze', badge_text: '#22 Global', subtitle: 'Online Spanish proficiency certification service', features: ['Online format', 'Flexible modules', 'Pan-Hispanic'] },
  { name: 'TestDaF', language_group: 'german', badge_type: 'bronze', badge_text: '#23 Global', subtitle: 'German test for university admission', features: ['University focus', '4 skills', 'Academic German'] },
  { name: 'OET', language_group: 'english', badge_type: 'bronze', badge_text: '#24 Global', subtitle: 'Occupational English Test for healthcare professionals', features: ['Healthcare focus', '12 professions', '4 skills'] },
  { name: 'TELC', language_group: 'european', badge_type: 'bronze', badge_text: '#25 Global', subtitle: 'The European Language Certificates', features: ['Multiple languages', 'European standard', '10 languages'] },
  { name: 'TORFL', language_group: 'russian', badge_type: 'bronze', badge_text: '#26 Global', subtitle: 'Test of Russian as a Foreign Language', features: ['6 levels', 'University admission', 'Citizenship requirement'] },
  { name: 'ÖSD', language_group: 'german', badge_type: 'bronze', badge_text: '#27 Global', subtitle: 'Austrian German language certification', features: ['Austrian German', '6 levels', 'Immigration accepted'] },
  { name: 'CILS', language_group: 'italian', badge_type: 'bronze', badge_text: '#28 Global', subtitle: 'Certificazione di Italiano come Lingua Straniera', features: ['6 levels', 'University of Siena', 'Immigration accepted'] },
  { name: 'PLIDA', language_group: 'italian', badge_type: 'bronze', badge_text: '#29 Global', subtitle: 'Italian language certification by Dante Alighieri Society', features: ['6 levels', 'Dante Society', 'Cultural focus'] },
  { name: 'CAPLE', language_group: 'portuguese', badge_type: 'bronze', badge_text: '#30 Global', subtitle: 'Centro de Avaliação de Português Língua Estrangeira', features: ['European Portuguese', '5 levels', 'University of Lisbon'] }
];

async function populateTestsTable() {
  console.log('🚀 Starting to populate tests table with Top 30 language tests...');
  console.log(`📊 Total tests to insert: ${languageTestsData.length}`);

  try {
    // First, check existing data
    console.log('🔍 Checking existing data...');
    const { data: existingData, error: fetchError } = await supabase
      .from('tests')
      .select('*');
    
    if (fetchError) {
      console.error('❌ Error fetching existing data:', fetchError);
      return;
    }
    
    console.log(`📊 Found ${existingData?.length || 0} existing records`);
    
    // Delete existing data if any
    if (existingData && existingData.length > 0) {
      console.log('🗑️  Clearing existing data...');
      const { error: deleteError } = await supabase
        .from('tests')
        .delete()
        .in('id', existingData.map(item => item.id));

      if (deleteError) {
        console.error('❌ Error clearing table:', deleteError);
        return;
      }
      console.log('✅ Existing data cleared');
    } else {
      console.log('✅ No existing data to clear');
    }

    // Insert new data in batches to avoid hitting limits
    console.log('📝 Inserting new data...');
    const { data, error } = await supabase
      .from('tests')
      .insert(languageTestsData);

    if (error) {
      console.error('❌ Error inserting data:', error);
      return;
    }

    console.log('✅ Successfully populated tests table with Top 30 language tests!');
    console.log(`📊 Inserted ${languageTestsData.length} tests`);

    // Show summary
    const languageGroups = [...new Set(languageTestsData.map(test => test.language_group))];
    console.log('🌍 Languages included:');
    languageGroups.forEach(lang => {
      const count = languageTestsData.filter(test => test.language_group === lang).length;
      console.log(`   • ${lang}: ${count} tests`);
    });

    console.log('\n🎉 Database population complete!');
    console.log('You can now view the updated tests at your /tests page');

  } catch (err) {
    console.error('💥 Unexpected error:', err);
  }
}

// Run the script
populateTestsTable();