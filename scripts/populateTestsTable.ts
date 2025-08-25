// scripts/populateTestsTable.ts
// Run this script to populate the Supabase tests table with Top 30 language tests

import { createClient } from '@supabase/supabase-js';

// You'll need to add your Supabase credentials here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface SupabaseTestData {
  id: string;
  name: string;
  language_group: string;
  badge_type: string;
  badge_text: string;
  subtitle: string;
  features: string[];
  rank?: number;
  test_takers?: string;
  description?: string;
  format?: string;
  target_audience?: string;
}

const languageTestsData: SupabaseTestData[] = [
  // TOP 10
  {
    id: 'toeic',
    name: 'TOEIC',
    language_group: 'english',
    badge_type: 'gold',
    badge_text: '#1 Global',
    subtitle: 'Business English proficiency test, essential for Asian job markets',
    features: ['Business English', 'Listening & Reading', 'Speaking & Writing'],
    rank: 1,
    test_takers: '7M+',
    description: 'Business English proficiency test, essential for Asian job markets',
    format: 'Paper',
    target_audience: 'Working professionals, job seekers'
  },
  {
    id: 'cambridge',
    name: 'Cambridge English',
    language_group: 'english',
    badge_type: 'gold',
    badge_text: '#2 Global',
    subtitle: 'Comprehensive English certification system (FCE, CAE, CPE)',
    features: ['Multiple levels', '4 skills assessment', 'Lifetime validity'],
    rank: 2,
    test_takers: '5.5M+',
    description: 'Comprehensive English certification system (FCE, CAE, CPE)',
    format: 'Computer',
    target_audience: 'Students, professionals, academics'
  },
  {
    id: 'duolingo',
    name: 'Duolingo English Test',
    language_group: 'english',
    badge_type: 'gold',
    badge_text: '#3 Global',
    subtitle: 'Online English proficiency test with rapid growth',
    features: ['Online delivery', 'AI-powered', 'Quick results', 'Affordable'],
    rank: 3,
    test_takers: '5M+',
    description: 'Online English proficiency test with rapid growth',
    format: 'Online',
    target_audience: 'University applicants, remote workers'
  },
  {
    id: 'ielts',
    name: 'IELTS',
    language_group: 'english',
    badge_type: 'gold',
    badge_text: '#4 Global',
    subtitle: 'International English Language Testing System for UK/Australia',
    features: ['Academic & General', '4 skills', 'Immigration accepted'],
    rank: 4,
    test_takers: '4M+',
    description: 'International English Language Testing System for UK/Australia',
    format: 'Paper',
    target_audience: 'University students, immigrants'
  },
  {
    id: 'toefl-ibt',
    name: 'TOEFL iBT',
    language_group: 'english',
    badge_type: 'gold',
    badge_text: '#5 Global',
    subtitle: 'Internet-based English test for US university admissions',
    features: ['Academic focus', 'Internet-based', 'US preferred'],
    rank: 5,
    test_takers: '2M+',
    description: 'Internet-based English test for US university admissions',
    format: 'Computer',
    target_audience: 'US university applicants'
  },
  {
    id: 'jlpt',
    name: 'JLPT',
    language_group: 'japanese',
    badge_type: 'gold',
    badge_text: '#6 Global',
    subtitle: 'Japanese Language Proficiency Test',
    features: ['5 levels (N5-N1)', 'Reading & Listening', 'Twice yearly'],
    rank: 6,
    test_takers: '1M+',
    description: 'Japanese Language Proficiency Test',
    format: 'Paper',
    target_audience: 'Japanese learners, job seekers in Japan'
  },
  {
    id: 'hsk',
    name: 'HSK',
    language_group: 'chinese',
    badge_type: 'gold',
    badge_text: '#7 Global',
    subtitle: 'Chinese Proficiency Test (Hanyu Shuiping Kaoshi)',
    features: ['9 levels', 'Government official', 'University admission'],
    rank: 7,
    test_takers: '1M+',
    description: 'Chinese Proficiency Test (Hanyu Shuiping Kaoshi)',
    format: 'Computer',
    target_audience: 'Chinese learners, China students/workers'
  },
  {
    id: 'pte',
    name: 'PTE Academic',
    language_group: 'english',
    badge_type: 'gold',
    badge_text: '#8 Global',
    subtitle: 'AI-scored English test with fast results',
    features: ['AI scoring', 'Fast results', '4 skills', 'Computer-based'],
    rank: 8,
    test_takers: '1M+',
    description: 'AI-scored English test with fast results',
    format: 'Computer',
    target_audience: 'University applicants, visa applicants'
  },
  {
    id: 'delf-dalf',
    name: 'DELF/DALF',
    language_group: 'french',
    badge_type: 'gold',
    badge_text: '#9 Global',
    subtitle: 'Official French proficiency certification',
    features: ['Government official', '6 levels', 'Lifetime validity'],
    rank: 9,
    test_takers: '500K+',
    description: 'Official French proficiency certification',
    format: 'Paper',
    target_audience: 'French learners, France immigrants'
  },
  {
    id: 'toefl-junior',
    name: 'TOEFL Junior',
    language_group: 'english',
    badge_type: 'gold',
    badge_text: '#10 Global',
    subtitle: 'English assessment for middle and high school students',
    features: ['Age-appropriate', 'Academic focus', 'School programs'],
    rank: 10,
    test_takers: '500K+',
    description: 'English assessment for middle and high school students',
    format: 'Paper',
    target_audience: 'Middle & high school students'
  },

  // TOP 11-20
  {
    id: 'topik',
    name: 'TOPIK',
    language_group: 'korean',
    badge_type: 'silver',
    badge_text: '#11 Global',
    subtitle: 'Test of Proficiency in Korean',
    features: ['6 levels', 'University admission', 'Visa requirement'],
    rank: 11,
    test_takers: '400K+',
    description: 'Test of Proficiency in Korean',
    format: 'Paper',
    target_audience: 'Korean learners, Korea students/workers'
  },
  {
    id: 'goethe',
    name: 'Goethe-Zertifikat',
    language_group: 'german',
    badge_type: 'silver',
    badge_text: '#12 Global',
    subtitle: 'Official German language certification',
    features: ['6 levels (A1-C2)', 'Worldwide recognition', 'Cultural focus'],
    rank: 12,
    test_takers: '300K+',
    description: 'Official German language certification',
    format: 'Paper',
    target_audience: 'German learners, Germany immigrants'
  },
  {
    id: 'celpe-bras',
    name: 'CELPE-Bras',
    language_group: 'portuguese',
    badge_type: 'silver',
    badge_text: '#13 Global',
    subtitle: 'Certificate of Proficiency in Portuguese for Foreigners',
    features: ['Brazilian Portuguese', 'University admission', '4 skills'],
    rank: 13,
    test_takers: '250K+',
    description: 'Certificate of Proficiency in Portuguese for Foreigners',
    format: 'Paper',
    target_audience: 'Portuguese learners, Brazil students'
  },
  {
    id: 'tcf',
    name: 'TCF',
    language_group: 'french',
    badge_type: 'silver',
    badge_text: '#14 Global',
    subtitle: 'Test de connaissance du français',
    features: ['Immigration focus', 'Canada accepted', 'Multiple versions'],
    rank: 14,
    test_takers: '200K+',
    description: 'Test de connaissance du français',
    format: 'Computer',
    target_audience: 'Canada immigrants, French learners'
  },
  {
    id: 'dele',
    name: 'DELE',
    language_group: 'spanish',
    badge_type: 'silver',
    badge_text: '#15 Global',
    subtitle: 'Diplomas de Español como Lengua Extranjera',
    features: ['6 levels', 'Lifetime validity', 'Spain official'],
    rank: 15,
    test_takers: '150K+',
    description: 'Diplomas de Español como Lengua Extranjera',
    format: 'Paper',
    target_audience: 'Spanish learners, Spain students/workers'
  },
  {
    id: 'toefl-itp',
    name: 'TOEFL ITP',
    language_group: 'english',
    badge_type: 'silver',
    badge_text: '#16 Global',
    subtitle: 'Institutional Testing Program for organizations',
    features: ['Institution-based', 'Paper format', 'Cost-effective'],
    rank: 16,
    test_takers: '150K+',
    description: 'Institutional Testing Program for organizations',
    format: 'Paper',
    target_audience: 'Institution students, placement testing'
  },
  {
    id: 'tef',
    name: 'TEF/TEF Canada',
    language_group: 'french',
    badge_type: 'silver',
    badge_text: '#17 Global',
    subtitle: 'Test d\'évaluation de français for Canada immigration',
    features: ['Canada immigration', 'Computer-based', '4 skills'],
    rank: 17,
    test_takers: '100K+',
    description: 'Test d\'évaluation de français for Canada immigration',
    format: 'Computer',
    target_audience: 'Canada immigrants'
  },
  {
    id: 'yct',
    name: 'YCT',
    language_group: 'chinese',
    badge_type: 'silver',
    badge_text: '#18 Global',
    subtitle: 'Youth Chinese Test for young learners',
    features: ['Age 3-15', '4 levels', 'Game-like format'],
    rank: 18,
    test_takers: '100K+',
    description: 'Youth Chinese Test for young learners',
    format: 'Paper',
    target_audience: 'Young Chinese learners'
  },
  {
    id: 'opic',
    name: 'OPIC',
    language_group: 'english',
    badge_type: 'silver',
    badge_text: '#19 Global',
    subtitle: 'Oral Proficiency Interview by Computer (Korea focus)',
    features: ['Speaking only', 'Computer-based', 'Korea popular'],
    rank: 19,
    test_takers: '100K+',
    description: 'Oral Proficiency Interview by Computer (Korea focus)',
    format: 'Computer',
    target_audience: 'Korean job seekers, professionals'
  },
  {
    id: 'tocfl',
    name: 'TOCFL',
    language_group: 'chinese',
    badge_type: 'silver',
    badge_text: '#20 Global',
    subtitle: 'Test of Chinese as a Foreign Language (Taiwan)',
    features: ['Traditional Chinese', 'Taiwan focus', '5 levels'],
    rank: 20,
    test_takers: '80K+',
    description: 'Test of Chinese as a Foreign Language (Taiwan)',
    format: 'Computer',
    target_audience: 'Taiwan students, Traditional Chinese learners'
  },

  // TOP 21-30
  {
    id: 'j-test',
    name: 'J-TEST',
    language_group: 'japanese',
    badge_type: 'bronze',
    badge_text: '#21 Global',
    subtitle: 'Practical Japanese proficiency test',
    features: ['Practical focus', 'Monthly tests', 'Business Japanese'],
    rank: 21,
    test_takers: '70K+',
    description: 'Practical Japanese proficiency test',
    format: 'Paper',
    target_audience: 'Japanese workers, practical users'
  },
  {
    id: 'siele',
    name: 'SIELE',
    language_group: 'spanish',
    badge_type: 'bronze',
    badge_text: '#22 Global',
    subtitle: 'Online Spanish proficiency certification service',
    features: ['Online format', 'Flexible modules', 'Pan-Hispanic'],
    rank: 22,
    test_takers: '50K+',
    description: 'Online Spanish proficiency certification service',
    format: 'Online',
    target_audience: 'Global Spanish learners'
  },
  {
    id: 'testdaf',
    name: 'TestDaF',
    language_group: 'german',
    badge_type: 'bronze',
    badge_text: '#23 Global',
    subtitle: 'German test for university admission',
    features: ['University focus', '4 skills', 'Academic German'],
    rank: 23,
    test_takers: '50K+',
    description: 'German test for university admission',
    format: 'Computer',
    target_audience: 'Germany university applicants'
  },
  {
    id: 'oet',
    name: 'OET',
    language_group: 'english',
    badge_type: 'bronze',
    badge_text: '#24 Global',
    subtitle: 'Occupational English Test for healthcare professionals',
    features: ['Healthcare focus', '12 professions', '4 skills'],
    rank: 24,
    test_takers: '50K+',
    description: 'Occupational English Test for healthcare professionals',
    format: 'Computer',
    target_audience: 'Healthcare professionals'
  },
  {
    id: 'telc',
    name: 'TELC',
    language_group: 'european',
    badge_type: 'bronze',
    badge_text: '#25 Global',
    subtitle: 'The European Language Certificates',
    features: ['Multiple languages', 'European standard', '10 languages'],
    rank: 25,
    test_takers: '50K+',
    description: 'The European Language Certificates',
    format: 'Paper',
    target_audience: 'European language learners'
  },
  {
    id: 'torfl',
    name: 'TORFL',
    language_group: 'russian',
    badge_type: 'bronze',
    badge_text: '#26 Global',
    subtitle: 'Test of Russian as a Foreign Language',
    features: ['6 levels', 'University admission', 'Citizenship requirement'],
    rank: 26,
    test_takers: '40K+',
    description: 'Test of Russian as a Foreign Language',
    format: 'Paper',
    target_audience: 'Russian learners, Russia students/immigrants'
  },
  {
    id: 'osd',
    name: 'ÖSD',
    language_group: 'german',
    badge_type: 'bronze',
    badge_text: '#27 Global',
    subtitle: 'Austrian German language certification',
    features: ['Austrian German', '6 levels', 'Immigration accepted'],
    rank: 27,
    test_takers: '40K+',
    description: 'Austrian German language certification',
    format: 'Paper',
    target_audience: 'Austria/Germany immigrants, learners'
  },
  {
    id: 'cils',
    name: 'CILS',
    language_group: 'italian',
    badge_type: 'bronze',
    badge_text: '#28 Global',
    subtitle: 'Certificazione di Italiano come Lingua Straniera',
    features: ['6 levels', 'University of Siena', 'Immigration accepted'],
    rank: 28,
    test_takers: '30K+',
    description: 'Certificazione di Italiano come Lingua Straniera',
    format: 'Paper',
    target_audience: 'Italian learners, Italy students/immigrants'
  },
  {
    id: 'plida',
    name: 'PLIDA',
    language_group: 'italian',
    badge_type: 'bronze',
    badge_text: '#29 Global',
    subtitle: 'Italian language certification by Dante Alighieri Society',
    features: ['6 levels', 'Dante Society', 'Cultural focus'],
    rank: 29,
    test_takers: '30K+',
    description: 'Italian language certification by Dante Alighieri Society',
    format: 'Paper',
    target_audience: 'Italian culture enthusiasts, learners'
  },
  {
    id: 'caple',
    name: 'CAPLE',
    language_group: 'portuguese',
    badge_type: 'bronze',
    badge_text: '#30 Global',
    subtitle: 'Centro de Avaliação de Português Língua Estrangeira',
    features: ['European Portuguese', '5 levels', 'University of Lisbon'],
    rank: 30,
    test_takers: '20K+',
    description: 'Centro de Avaliação de Português Língua Estrangeira',
    format: 'Paper',
    target_audience: 'European Portuguese learners, Portugal students'
  }
];

async function populateTestsTable() {
  console.log('🚀 Starting to populate tests table...');

  // First, clear existing data
  console.log('🗑️  Clearing existing data...');
  const { error: deleteError } = await supabase
    .from('tests')
    .delete()
    .neq('id', ''); // Delete all rows

  if (deleteError) {
    console.error('❌ Error clearing table:', deleteError);
    return;
  }

  // Insert new data
  console.log('📝 Inserting Top 30 language tests...');
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
  console.log('🌍 Languages included:', languageGroups.join(', '));
}

// Run the script
populateTestsTable();