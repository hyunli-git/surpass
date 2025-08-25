// src/data/languageTests.ts

export interface LanguageTest {
  id: string;
  name: string;
  language: string;
  flag: string;
  testTakers: string;
  testTakersNumber: number;
  description: string;
  rank: number;
  category: 'TOP_10' | 'TOP_11_20' | 'TOP_21_30';
  features: string[];
  level?: string;
  format?: 'Online' | 'Paper' | 'Computer' | 'Hybrid';
  targetAudience?: string;
}

export const LANGUAGES = [
  { code: 'all', name: 'All Languages', flag: '🌍' },
  { code: 'english', name: 'English', flag: '🇬🇧' },
  { code: 'chinese', name: 'Chinese', flag: '🇨🇳' },
  { code: 'japanese', name: 'Japanese', flag: '🇯🇵' },
  { code: 'french', name: 'French', flag: '🇫🇷' },
  { code: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { code: 'german', name: 'German', flag: '🇩🇪' },
  { code: 'korean', name: 'Korean', flag: '🇰🇷' },
  { code: 'portuguese', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'italian', name: 'Italian', flag: '🇮🇹' },
  { code: 'russian', name: 'Russian', flag: '🇷🇺' },
  { code: 'other', name: 'Other', flag: '🌐' }
];

export const LANGUAGE_TESTS: LanguageTest[] = [
  // TOP 1-10
  {
    id: 'toeic',
    name: 'TOEIC',
    language: 'english',
    flag: '🇬🇧',
    testTakers: '7M+',
    testTakersNumber: 7000000,
    description: 'Business English proficiency test, essential for Asian job markets',
    rank: 1,
    category: 'TOP_10',
    features: ['Business English', 'Listening & Reading', 'Speaking & Writing'],
    format: 'Paper',
    targetAudience: 'Working professionals, job seekers'
  },
  {
    id: 'cambridge',
    name: 'Cambridge English',
    language: 'english',
    flag: '🇬🇧',
    testTakers: '5.5M+',
    testTakersNumber: 5500000,
    description: 'Comprehensive English certification system (FCE, CAE, CPE)',
    rank: 2,
    category: 'TOP_10',
    features: ['Multiple levels', '4 skills assessment', 'Lifetime validity'],
    format: 'Computer',
    targetAudience: 'Students, professionals, academics'
  },
  {
    id: 'duolingo',
    name: 'Duolingo English Test',
    language: 'english',
    flag: '🇬🇧',
    testTakers: '5M+',
    testTakersNumber: 5000000,
    description: 'Online English proficiency test with rapid growth',
    rank: 3,
    category: 'TOP_10',
    features: ['Online delivery', 'AI-powered', 'Quick results', 'Affordable'],
    format: 'Online',
    targetAudience: 'University applicants, remote workers'
  },
  {
    id: 'ielts',
    name: 'IELTS',
    language: 'english',
    flag: '🇬🇧',
    testTakers: '4M+',
    testTakersNumber: 4000000,
    description: 'International English Language Testing System for UK/Australia',
    rank: 4,
    category: 'TOP_10',
    features: ['Academic & General', '4 skills', 'Immigration accepted'],
    format: 'Paper',
    targetAudience: 'University students, immigrants'
  },
  {
    id: 'toefl-ibt',
    name: 'TOEFL iBT',
    language: 'english',
    flag: '🇬🇧',
    testTakers: '2M+',
    testTakersNumber: 2000000,
    description: 'Internet-based English test for US university admissions',
    rank: 5,
    category: 'TOP_10',
    features: ['Academic focus', 'Internet-based', 'US preferred'],
    format: 'Computer',
    targetAudience: 'US university applicants'
  },
  {
    id: 'jlpt',
    name: 'JLPT',
    language: 'japanese',
    flag: '🇯🇵',
    testTakers: '1M+',
    testTakersNumber: 1000000,
    description: 'Japanese Language Proficiency Test',
    rank: 6,
    category: 'TOP_10',
    features: ['5 levels (N5-N1)', 'Reading & Listening', 'Twice yearly'],
    format: 'Paper',
    targetAudience: 'Japanese learners, job seekers in Japan'
  },
  {
    id: 'hsk',
    name: 'HSK',
    language: 'chinese',
    flag: '🇨🇳',
    testTakers: '1M+',
    testTakersNumber: 1000000,
    description: 'Chinese Proficiency Test (Hanyu Shuiping Kaoshi)',
    rank: 7,
    category: 'TOP_10',
    features: ['9 levels', 'Government official', 'University admission'],
    format: 'Computer',
    targetAudience: 'Chinese learners, China students/workers'
  },
  {
    id: 'pte',
    name: 'PTE Academic',
    language: 'english',
    flag: '🇬🇧',
    testTakers: '1M+',
    testTakersNumber: 1000000,
    description: 'AI-scored English test with fast results',
    rank: 8,
    category: 'TOP_10',
    features: ['AI scoring', 'Fast results', '4 skills', 'Computer-based'],
    format: 'Computer',
    targetAudience: 'University applicants, visa applicants'
  },
  {
    id: 'delf-dalf',
    name: 'DELF/DALF',
    language: 'french',
    flag: '🇫🇷',
    testTakers: '500K+',
    testTakersNumber: 500000,
    description: 'Official French proficiency certification',
    rank: 9,
    category: 'TOP_10',
    features: ['Government official', '6 levels', 'Lifetime validity'],
    format: 'Paper',
    targetAudience: 'French learners, France immigrants'
  },
  {
    id: 'toefl-junior',
    name: 'TOEFL Junior',
    language: 'english',
    flag: '🇬🇧',
    testTakers: '500K+',
    testTakersNumber: 500000,
    description: 'English assessment for middle and high school students',
    rank: 10,
    category: 'TOP_10',
    features: ['Age-appropriate', 'Academic focus', 'School programs'],
    format: 'Paper',
    targetAudience: 'Middle & high school students'
  },

  // TOP 11-20
  {
    id: 'topik',
    name: 'TOPIK',
    language: 'korean',
    flag: '🇰🇷',
    testTakers: '400K+',
    testTakersNumber: 400000,
    description: 'Test of Proficiency in Korean',
    rank: 11,
    category: 'TOP_11_20',
    features: ['6 levels', 'University admission', 'Visa requirement'],
    format: 'Paper',
    targetAudience: 'Korean learners, Korea students/workers'
  },
  {
    id: 'goethe',
    name: 'Goethe-Zertifikat',
    language: 'german',
    flag: '🇩🇪',
    testTakers: '300K+',
    testTakersNumber: 300000,
    description: 'Official German language certification',
    rank: 12,
    category: 'TOP_11_20',
    features: ['6 levels (A1-C2)', 'Worldwide recognition', 'Cultural focus'],
    format: 'Paper',
    targetAudience: 'German learners, Germany immigrants'
  },
  {
    id: 'celpe-bras',
    name: 'CELPE-Bras',
    language: 'portuguese',
    flag: '🇧🇷',
    testTakers: '250K+',
    testTakersNumber: 250000,
    description: 'Certificate of Proficiency in Portuguese for Foreigners',
    rank: 13,
    category: 'TOP_11_20',
    features: ['Brazilian Portuguese', 'University admission', '4 skills'],
    format: 'Paper',
    targetAudience: 'Portuguese learners, Brazil students'
  },
  {
    id: 'tcf',
    name: 'TCF',
    language: 'french',
    flag: '🇫🇷',
    testTakers: '200K+',
    testTakersNumber: 200000,
    description: 'Test de connaissance du français',
    rank: 14,
    category: 'TOP_11_20',
    features: ['Immigration focus', 'Canada accepted', 'Multiple versions'],
    format: 'Computer',
    targetAudience: 'Canada immigrants, French learners'
  },
  {
    id: 'dele',
    name: 'DELE',
    language: 'spanish',
    flag: '🇪🇸',
    testTakers: '150K+',
    testTakersNumber: 150000,
    description: 'Diplomas de Español como Lengua Extranjera',
    rank: 15,
    category: 'TOP_11_20',
    features: ['6 levels', 'Lifetime validity', 'Spain official'],
    format: 'Paper',
    targetAudience: 'Spanish learners, Spain students/workers'
  },
  {
    id: 'toefl-itp',
    name: 'TOEFL ITP',
    language: 'english',
    flag: '🇬🇧',
    testTakers: '150K+',
    testTakersNumber: 150000,
    description: 'Institutional Testing Program for organizations',
    rank: 16,
    category: 'TOP_11_20',
    features: ['Institution-based', 'Paper format', 'Cost-effective'],
    format: 'Paper',
    targetAudience: 'Institution students, placement testing'
  },
  {
    id: 'tef',
    name: 'TEF/TEF Canada',
    language: 'french',
    flag: '🇫🇷',
    testTakers: '100K+',
    testTakersNumber: 100000,
    description: 'Test d\'évaluation de français for Canada immigration',
    rank: 17,
    category: 'TOP_11_20',
    features: ['Canada immigration', 'Computer-based', '4 skills'],
    format: 'Computer',
    targetAudience: 'Canada immigrants'
  },
  {
    id: 'yct',
    name: 'YCT',
    language: 'chinese',
    flag: '🇨🇳',
    testTakers: '100K+',
    testTakersNumber: 100000,
    description: 'Youth Chinese Test for young learners',
    rank: 18,
    category: 'TOP_11_20',
    features: ['Age 3-15', '4 levels', 'Game-like format'],
    format: 'Paper',
    targetAudience: 'Young Chinese learners'
  },
  {
    id: 'opic',
    name: 'OPIC',
    language: 'english',
    flag: '🇬🇧',
    testTakers: '100K+',
    testTakersNumber: 100000,
    description: 'Oral Proficiency Interview by Computer (Korea focus)',
    rank: 19,
    category: 'TOP_11_20',
    features: ['Speaking only', 'Computer-based', 'Korea popular'],
    format: 'Computer',
    targetAudience: 'Korean job seekers, professionals'
  },
  {
    id: 'tocfl',
    name: 'TOCFL',
    language: 'chinese',
    flag: '🇹🇼',
    testTakers: '80K+',
    testTakersNumber: 80000,
    description: 'Test of Chinese as a Foreign Language (Taiwan)',
    rank: 20,
    category: 'TOP_11_20',
    features: ['Traditional Chinese', 'Taiwan focus', '5 levels'],
    format: 'Computer',
    targetAudience: 'Taiwan students, Traditional Chinese learners'
  },

  // TOP 21-30
  {
    id: 'j-test',
    name: 'J-TEST',
    language: 'japanese',
    flag: '🇯🇵',
    testTakers: '70K+',
    testTakersNumber: 70000,
    description: 'Practical Japanese proficiency test',
    rank: 21,
    category: 'TOP_21_30',
    features: ['Practical focus', 'Monthly tests', 'Business Japanese'],
    format: 'Paper',
    targetAudience: 'Japanese workers, practical users'
  },
  {
    id: 'siele',
    name: 'SIELE',
    language: 'spanish',
    flag: '🇪🇸',
    testTakers: '50K+',
    testTakersNumber: 50000,
    description: 'Online Spanish proficiency certification service',
    rank: 22,
    category: 'TOP_21_30',
    features: ['Online format', 'Flexible modules', 'Pan-Hispanic'],
    format: 'Online',
    targetAudience: 'Global Spanish learners'
  },
  {
    id: 'testdaf',
    name: 'TestDaF',
    language: 'german',
    flag: '🇩🇪',
    testTakers: '50K+',
    testTakersNumber: 50000,
    description: 'German test for university admission',
    rank: 23,
    category: 'TOP_21_30',
    features: ['University focus', '4 skills', 'Academic German'],
    format: 'Computer',
    targetAudience: 'Germany university applicants'
  },
  {
    id: 'oet',
    name: 'OET',
    language: 'english',
    flag: '🇬🇧',
    testTakers: '50K+',
    testTakersNumber: 50000,
    description: 'Occupational English Test for healthcare professionals',
    rank: 24,
    category: 'TOP_21_30',
    features: ['Healthcare focus', '12 professions', '4 skills'],
    format: 'Computer',
    targetAudience: 'Healthcare professionals'
  },
  {
    id: 'telc',
    name: 'TELC',
    language: 'other',
    flag: '🇪🇺',
    testTakers: '50K+',
    testTakersNumber: 50000,
    description: 'The European Language Certificates',
    rank: 25,
    category: 'TOP_21_30',
    features: ['Multiple languages', 'European standard', '10 languages'],
    format: 'Paper',
    targetAudience: 'European language learners'
  },
  {
    id: 'torfl',
    name: 'TORFL',
    language: 'russian',
    flag: '🇷🇺',
    testTakers: '40K+',
    testTakersNumber: 40000,
    description: 'Test of Russian as a Foreign Language',
    rank: 26,
    category: 'TOP_21_30',
    features: ['6 levels', 'University admission', 'Citizenship requirement'],
    format: 'Paper',
    targetAudience: 'Russian learners, Russia students/immigrants'
  },
  {
    id: 'osd',
    name: 'ÖSD',
    language: 'german',
    flag: '🇦🇹',
    testTakers: '40K+',
    testTakersNumber: 40000,
    description: 'Austrian German language certification',
    rank: 27,
    category: 'TOP_21_30',
    features: ['Austrian German', '6 levels', 'Immigration accepted'],
    format: 'Paper',
    targetAudience: 'Austria/Germany immigrants, learners'
  },
  {
    id: 'cils',
    name: 'CILS',
    language: 'italian',
    flag: '🇮🇹',
    testTakers: '30K+',
    testTakersNumber: 30000,
    description: 'Certificazione di Italiano come Lingua Straniera',
    rank: 28,
    category: 'TOP_21_30',
    features: ['6 levels', 'University of Siena', 'Immigration accepted'],
    format: 'Paper',
    targetAudience: 'Italian learners, Italy students/immigrants'
  },
  {
    id: 'plida',
    name: 'PLIDA',
    language: 'italian',
    flag: '🇮🇹',
    testTakers: '30K+',
    testTakersNumber: 30000,
    description: 'Italian language certification by Dante Alighieri Society',
    rank: 29,
    category: 'TOP_21_30',
    features: ['6 levels', 'Dante Society', 'Cultural focus'],
    format: 'Paper',
    targetAudience: 'Italian culture enthusiasts, learners'
  },
  {
    id: 'caple',
    name: 'CAPLE',
    language: 'portuguese',
    flag: '🇵🇹',
    testTakers: '20K+',
    testTakersNumber: 20000,
    description: 'Centro de Avaliação de Português Língua Estrangeira',
    rank: 30,
    category: 'TOP_21_30',
    features: ['European Portuguese', '5 levels', 'University of Lisbon'],
    format: 'Paper',
    targetAudience: 'European Portuguese learners, Portugal students'
  }
];

// Helper functions
export const getTestsByLanguage = (language: string): LanguageTest[] => {
  if (language === 'all') return LANGUAGE_TESTS;
  return LANGUAGE_TESTS.filter(test => test.language === language);
};

export const getTestsByCategory = (category: string): LanguageTest[] => {
  return LANGUAGE_TESTS.filter(test => test.category === category);
};

export const getTestById = (id: string): LanguageTest | undefined => {
  return LANGUAGE_TESTS.find(test => test.id === id);
};