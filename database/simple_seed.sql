-- Simple seed data for testing dropdowns

-- Clear existing data first (in proper order due to foreign keys)
DELETE FROM prompt_template_sections;
DELETE FROM prompt_section_content;  
DELETE FROM prompt_templates;
DELETE FROM scoring_examples;
DELETE FROM score_benchmarks;
DELETE FROM test_parts;
DELETE FROM prompt_sections;
DELETE FROM skill_types;
DELETE FROM exam_types;

-- Insert basic exam types
INSERT INTO exam_types (exam_name, display_name, description, is_active) VALUES
('IELTS', 'IELTS Academic & General', 'International English Language Testing System', true),
('TOEFL_iBT', 'TOEFL Internet-Based Test', 'Test of English as a Foreign Language', true),
('TOEIC', 'TOEIC Speaking & Writing', 'Test of English for International Communication', true),
('PTE', 'PTE Academic', 'Pearson Test of English Academic', true);

-- Insert basic skill types  
INSERT INTO skill_types (skill_name, display_name) VALUES
('speaking', 'Speaking'),
('writing', 'Writing'),
('reading', 'Reading'),
('listening', 'Listening');

-- Insert test parts for IELTS (using subqueries to get proper IDs)
INSERT INTO test_parts (exam_type_id, skill_type_id, part_name, display_name, description, max_score, duration_minutes, word_count_min, word_count_max) VALUES
-- IELTS Writing
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'), (SELECT id FROM skill_types WHERE skill_name = 'writing'), 'task1', 'Writing Task 1', 'Academic: Describe visual data; General: Letter writing', 9.0, 20, 150, null),
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'), (SELECT id FROM skill_types WHERE skill_name = 'writing'), 'task2', 'Writing Task 2', 'Essay writing on given topic', 9.0, 40, 250, null),
-- IELTS Speaking  
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'), (SELECT id FROM skill_types WHERE skill_name = 'speaking'), 'part1', 'Speaking Part 1', 'Introduction and familiar topics', 9.0, 5, null, null),
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'), (SELECT id FROM skill_types WHERE skill_name = 'speaking'), 'part2', 'Speaking Part 2', 'Individual long turn (cue card)', 9.0, 4, null, null),
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'), (SELECT id FROM skill_types WHERE skill_name = 'speaking'), 'part3', 'Speaking Part 3', 'Two-way discussion', 9.0, 5, null, null);

-- Verify data
SELECT 'exam_types' as table_name, COUNT(*) as count FROM exam_types
UNION ALL
SELECT 'skill_types', COUNT(*) FROM skill_types  
UNION ALL
SELECT 'test_parts', COUNT(*) FROM test_parts;

-- Show the actual data
SELECT 'EXAM TYPES:' as info;
SELECT id, exam_name, display_name FROM exam_types;

SELECT 'SKILL TYPES:' as info;  
SELECT id, skill_name, display_name FROM skill_types;

SELECT 'TEST PARTS:' as info;
SELECT tp.id, et.exam_name, st.skill_name, tp.part_name, tp.display_name 
FROM test_parts tp
JOIN exam_types et ON tp.exam_type_id = et.id
JOIN skill_types st ON tp.skill_type_id = st.id;