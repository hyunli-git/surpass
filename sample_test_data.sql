-- Sample test data for Supabase
-- Execute this after running database_schema.sql

-- Insert sample mock tests for each test type
INSERT INTO mock_tests (test_id, title, difficulty_level, is_active) 
SELECT 
  t.id,
  t.name || ' Practice Test 1',
  'intermediate',
  true
FROM tests t;

-- Insert sample sections for IELTS
INSERT INTO test_sections (mock_test_id, section_type, section_title, duration, total_questions, section_order, instructions)
SELECT 
  mt.id,
  'listening',
  'Listening',
  30,
  40,
  1,
  'Listen to recordings and answer questions. You will hear each recording only once.'
FROM mock_tests mt
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'IELTS';

INSERT INTO test_sections (mock_test_id, section_type, section_title, duration, total_questions, section_order, instructions)
SELECT 
  mt.id,
  'reading',
  'Academic Reading',
  60,
  40,
  2,
  'Read passages and answer questions. You have 60 minutes to complete all three sections.'
FROM mock_tests mt
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'IELTS';

INSERT INTO test_sections (mock_test_id, section_type, section_title, duration, total_questions, section_order, instructions)
SELECT 
  mt.id,
  'writing',
  'Academic Writing',
  60,
  2,
  3,
  'Complete two writing tasks. Task 1: 150 words in 20 minutes. Task 2: 250 words in 40 minutes.'
FROM mock_tests mt
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'IELTS';

INSERT INTO test_sections (mock_test_id, section_type, section_title, duration, total_questions, section_order, instructions)
SELECT 
  mt.id,
  'speaking',
  'Speaking',
  15,
  3,
  4,
  'Speak with the examiner. Three parts: introduction, individual talk, and discussion.'
FROM mock_tests mt
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'IELTS';

-- Insert sample sections for TOEIC
INSERT INTO test_sections (mock_test_id, section_type, section_title, duration, total_questions, section_order, instructions)
SELECT 
  mt.id,
  'listening',
  'Listening Comprehension',
  45,
  100,
  1,
  'Listen to conversations, talks, and short exchanges. Answer multiple choice questions.'
FROM mock_tests mt
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'TOEIC';

INSERT INTO test_sections (mock_test_id, section_type, section_title, duration, total_questions, section_order, instructions)
SELECT 
  mt.id,
  'reading',
  'Reading Comprehension',
  75,
  100,
  2,
  'Read passages and answer questions about grammar, vocabulary, and comprehension.'
FROM mock_tests mt
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'TOEIC';

-- Insert sample questions for IELTS Listening
INSERT INTO questions (section_id, question_number, question_type, question_text, options, correct_answer, points)
SELECT 
  ts.id,
  1,
  'multiple_choice',
  'What is the main purpose of the conversation?',
  '{"A": "To book a hotel room", "B": "To complain about service", "C": "To ask for directions", "D": "To make a reservation"}',
  'A',
  1
FROM test_sections ts
JOIN mock_tests mt ON ts.mock_test_id = mt.id
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'IELTS' AND ts.section_type = 'listening';

INSERT INTO questions (section_id, question_number, question_type, question_text, options, correct_answer, points)
SELECT 
  ts.id,
  2,
  'fill_blank',
  'The guest wants to stay for _______ nights.',
  NULL,
  'two',
  1
FROM test_sections ts
JOIN mock_tests mt ON ts.mock_test_id = mt.id
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'IELTS' AND ts.section_type = 'listening';

-- Insert sample questions for IELTS Reading
INSERT INTO questions (section_id, question_number, question_type, question_text, passage_text, options, correct_answer, points)
SELECT 
  ts.id,
  1,
  'multiple_choice',
  'According to the passage, urban planning primarily focuses on:',
  '<h3>The Evolution of Urban Planning</h3><p>Urban planning is a complex process that involves the design and organization of urban space to create sustainable, functional, and aesthetically pleasing cities. The practice has evolved significantly over the centuries, from ancient civilizations to modern metropolises.</p><p>In ancient times, cities were often planned around religious or administrative centers. The Greeks and Romans developed sophisticated urban planning techniques, including grid systems and public spaces that influenced city design for centuries.</p>',
  '{"A": "Creating sustainable cities", "B": "Building religious centers", "C": "Preserving ancient architecture", "D": "Developing transportation systems"}',
  'A',
  1
FROM test_sections ts
JOIN mock_tests mt ON ts.mock_test_id = mt.id
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'IELTS' AND ts.section_type = 'reading';

-- Insert sample questions for IELTS Writing
INSERT INTO questions (section_id, question_number, question_type, question_text, correct_answer, points)
SELECT 
  ts.id,
  1,
  'essay',
  'You recently bought a piece of equipment for your kitchen but it did not work. You phoned the shop but no action was taken. Write a letter to the shop manager. In your letter: • describe the problem with the equipment • explain what happened when you phoned the shop • say what you would like the manager to do',
  'Sample response addressing all points with appropriate tone and structure.',
  25
FROM test_sections ts
JOIN mock_tests mt ON ts.mock_test_id = mt.id
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'IELTS' AND ts.section_type = 'writing';

INSERT INTO questions (section_id, question_number, question_type, question_text, correct_answer, points)
SELECT 
  ts.id,
  2,
  'essay',
  'Some people think that all teenagers should be required to do unpaid work in their free time to help the local community. To what extent do you agree or disagree with this statement? Give reasons for your answer and include any relevant examples from your own knowledge or experience.',
  'Sample essay with clear position, supporting arguments, and examples.',
  25
FROM test_sections ts
JOIN mock_tests mt ON ts.mock_test_id = mt.id
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'IELTS' AND ts.section_type = 'writing';

-- Insert sample questions for TOEIC
INSERT INTO questions (section_id, question_number, question_type, question_text, options, correct_answer, points)
SELECT 
  ts.id,
  1,
  'multiple_choice',
  'Where does this conversation most likely take place?',
  '{"A": "At a restaurant", "B": "In an office", "C": "At a bank", "D": "In a store"}',
  'B',
  1
FROM test_sections ts
JOIN mock_tests mt ON ts.mock_test_id = mt.id
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'TOEIC' AND ts.section_type = 'listening';

-- Insert more questions for other tests (TEF, TOEFL, HSK, JLPT)
-- TEF Listening
INSERT INTO questions (section_id, question_number, question_type, question_text, options, correct_answer, points)
SELECT 
  ts.id,
  1,
  'multiple_choice',
  'Quel est le sujet principal de la conversation?',
  '{"A": "Réserver une chambre", "B": "Commander un repas", "C": "Demander des directions", "D": "Annuler un rendez-vous"}',
  'A',
  1
FROM test_sections ts
JOIN mock_tests mt ON ts.mock_test_id = mt.id
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'TEF' AND ts.section_type = 'listening';

-- HSK Reading
INSERT INTO questions (section_id, question_number, question_type, question_text, passage_text, options, correct_answer, points)
SELECT 
  ts.id,
  1,
  'multiple_choice',
  '根据短文，作者的主要观点是什么？',
  '<p>现代科技的发展给我们的生活带来了很大的变化。智能手机、电脑和互联网已经成为我们日常生活的重要组成部分。</p>',
  '{"A": "科技发展很快", "B": "科技改变生活", "C": "手机很重要", "D": "互联网有用"}',
  'B',
  1
FROM test_sections ts
JOIN mock_tests mt ON ts.mock_test_id = mt.id
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'HSK' AND ts.section_type = 'reading';

-- JLPT Reading
INSERT INTO questions (section_id, question_number, question_type, question_text, passage_text, options, correct_answer, points)
SELECT 
  ts.id,
  1,
  'multiple_choice',
  'この文章の主な内容は何ですか。',
  '<p>日本の四季はとても美しいです。春には桜が咲き、夏には緑が豊かで、秋には紅葉が楽しめ、冬には雪景色が見られます。</p>',
  '{"A": "日本の食べ物", "B": "日本の四季", "C": "日本の歴史", "D": "日本の文化"}',
  'B',
  1
FROM test_sections ts
JOIN mock_tests mt ON ts.mock_test_id = mt.id
JOIN tests t ON mt.test_id = t.id
WHERE t.code = 'JLPT' AND ts.section_type = 'reading';