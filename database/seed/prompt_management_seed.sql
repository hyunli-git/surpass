-- Seed data for Prompt Management System
-- This file contains initial data to populate the prompt management tables

-- Insert Exam Types
INSERT INTO exam_types (exam_name, display_name, description, is_active) VALUES
('IELTS', 'IELTS Academic & General', 'International English Language Testing System', true),
('TOEFL_iBT', 'TOEFL Internet-Based Test', 'Test of English as a Foreign Language', true),
('TOEIC', 'TOEIC Speaking & Writing', 'Test of English for International Communication', true),
('PTE', 'PTE Academic', 'Pearson Test of English Academic', true),
('DUOLINGO', 'Duolingo English Test', 'Duolingo English Proficiency Test', true);

-- Insert Skill Types
INSERT INTO skill_types (skill_name, display_name) VALUES
('speaking', 'Speaking'),
('writing', 'Writing'),
('reading', 'Reading'),
('listening', 'Listening');

-- Insert Test Parts for IELTS
INSERT INTO test_parts (exam_type_id, skill_type_id, part_name, display_name, description, max_score, duration_minutes, word_count_min, word_count_max) VALUES
-- IELTS Writing
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'), (SELECT id FROM skill_types WHERE skill_name = 'writing'), 'task1', 'Writing Task 1', 'Academic: Describe visual data; General: Letter writing', 9.0, 20, 150, null),
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'), (SELECT id FROM skill_types WHERE skill_name = 'writing'), 'task2', 'Writing Task 2', 'Essay writing on given topic', 9.0, 40, 250, null),
-- IELTS Speaking
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'), (SELECT id FROM skill_types WHERE skill_name = 'speaking'), 'part1', 'Speaking Part 1', 'Introduction and familiar topics', 9.0, 5, null, null),
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'), (SELECT id FROM skill_types WHERE skill_name = 'speaking'), 'part2', 'Speaking Part 2', 'Individual long turn (cue card)', 9.0, 4, null, null),
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'), (SELECT id FROM skill_types WHERE skill_name = 'speaking'), 'part3', 'Speaking Part 3', 'Two-way discussion', 9.0, 5, null, null);

-- Insert Test Parts for TOEFL iBT
INSERT INTO test_parts (exam_type_id, skill_type_id, part_name, display_name, description, max_score, duration_minutes, word_count_min, word_count_max) VALUES
-- TOEFL Writing
((SELECT id FROM exam_types WHERE exam_name = 'TOEFL_iBT'), (SELECT id FROM skill_types WHERE skill_name = 'writing'), 'integrated', 'Integrated Writing', 'Read, listen, then write response', 30.0, 20, 150, 225),
((SELECT id FROM exam_types WHERE exam_name = 'TOEFL_iBT'), (SELECT id FROM skill_types WHERE skill_name = 'writing'), 'independent', 'Independent Writing', 'Essay based on personal experience/opinion', 30.0, 30, 300, null),
-- TOEFL Speaking
((SELECT id FROM exam_types WHERE exam_name = 'TOEFL_iBT'), (SELECT id FROM skill_types WHERE skill_name = 'speaking'), 'independent', 'Independent Speaking', 'Speak about familiar topics', 30.0, 1, null, null),
((SELECT id FROM exam_types WHERE exam_name = 'TOEFL_iBT'), (SELECT id FROM skill_types WHERE skill_name = 'speaking'), 'integrated', 'Integrated Speaking', 'Integrate information from multiple sources', 30.0, 1, null, null);

-- Insert Prompt Sections (reusable components)
INSERT INTO prompt_sections (section_name, description, is_modular) VALUES
('system_role', 'Defines the AI role as an expert examiner', true),
('scoring_criteria', 'Detailed scoring criteria for the specific exam', true),
('output_format', 'JSON structure for consistent response format', true),
('analysis_instructions', 'Specific instructions for analysis approach', true),
('score_examples', 'Reference to scoring examples for calibration', true),
('improvement_guidance', 'Guidelines for providing constructive feedback', true);

-- Insert Prompt Section Content for IELTS Writing Task 1
INSERT INTO prompt_section_content (prompt_section_id, exam_type_id, skill_type_id, test_part_id, content, content_type, order_index) VALUES
-- System Role for IELTS Writing Task 1
((SELECT id FROM prompt_sections WHERE section_name = 'system_role'),
 (SELECT id FROM exam_types WHERE exam_name = 'IELTS'),
 (SELECT id FROM skill_types WHERE skill_name = 'writing'),
 (SELECT id FROM test_parts WHERE part_name = 'task1' AND exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS')),
 'You are an expert IELTS Writing examiner with over 10 years of experience. You have extensive knowledge of IELTS band descriptors and can accurately assess writing samples according to official IELTS criteria. You provide detailed, constructive feedback that helps students improve their writing skills.',
 'system', 1),

-- Scoring Criteria for IELTS Writing Task 1
((SELECT id FROM prompt_sections WHERE section_name = 'scoring_criteria'),
 (SELECT id FROM exam_types WHERE exam_name = 'IELTS'),
 (SELECT id FROM skill_types WHERE skill_name = 'writing'),
 (SELECT id FROM test_parts WHERE part_name = 'task1' AND exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS')),
 'IELTS Writing Task 1 Assessment Criteria:

1. Task Achievement (25% weight):
   - Band 9: Fully satisfies requirements, presents clear overview with accurate data
   - Band 7: Covers requirements, presents clear overview, highlights key features
   - Band 5: Generally addresses requirements, presents overview with some inaccuracy
   - Minimum 150 words required

2. Coherence and Cohesion (25% weight):
   - Logical organization and clear progression
   - Effective paragraphing and linking devices
   - Appropriate referencing and substitution

3. Lexical Resource (25% weight):
   - Range and accuracy of vocabulary
   - Appropriate word choice and collocation
   - Spelling accuracy

4. Grammatical Range and Accuracy (25% weight):
   - Variety of sentence structures
   - Grammatical accuracy
   - Punctuation accuracy',
 'instruction', 2),

-- Output Format for IELTS Writing Task 1
((SELECT id FROM prompt_sections WHERE section_name = 'output_format'),
 (SELECT id FROM exam_types WHERE exam_name = 'IELTS'),
 (SELECT id FROM skill_types WHERE skill_name = 'writing'),
 (SELECT id FROM test_parts WHERE part_name = 'task1' AND exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS')),
 '{
  "overallScore": (number 4.0-9.0),
  "targetScore": (next achievable band score),
  "scores": {
    "taskAchievement": (number 4.0-9.0),
    "coherenceCohesion": (number 4.0-9.0),
    "lexicalResource": (number 4.0-9.0),
    "grammaticalRange": (number 4.0-9.0)
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "nextLevelGuide": {
    "currentLevel": "Band X.X description",
    "targetLevel": "Band X.X description",
    "keyFocus": ["focus area 1", "focus area 2"],
    "specificActions": ["action 1", "action 2"],
    "practiceActivities": ["activity 1", "activity 2"],
    "timeline": "realistic timeframe"
  },
  "detailedAnalysis": {
    "taskResponse": "analysis of task requirements",
    "organization": "analysis of structure",
    "vocabulary": "analysis of lexical resource",
    "grammar": "analysis of grammar"
  },
  "wordCount": number,
  "suggestedRevisions": ["revision 1", "revision 2"]
}',
 'instruction', 3);

-- Insert Sample Scoring Examples for IELTS Writing Task 1
INSERT INTO scoring_examples (exam_type_id, skill_type_id, test_part_id, score_level, example_response, example_question, score_justification, criteria_breakdown, strengths, weaknesses, is_verified, source) VALUES
-- Band 6.0 Example
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'),
 (SELECT id FROM skill_types WHERE skill_name = 'writing'),
 (SELECT id FROM test_parts WHERE part_name = 'task1' AND exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS')),
 6.0,
 'The graph shows the number of tourists who visited a Caribbean island from 2010 to 2017. Overall, there was an increasing trend in the number of visitors over the period.

In 2010, approximately 1 million tourists visited the island. The number remained stable until 2011, then started to increase gradually. By 2015, the figure had risen to about 1.5 million visitors.

The most significant growth occurred between 2016 and 2017, when tourist numbers jumped from 1.5 million to 2.5 million. This represents the steepest increase in the entire period.

The graph indicates that the Caribbean island became increasingly popular as a tourist destination over the seven-year period, with particularly strong growth in the final two years.',
 'The graph below shows the number of tourists visiting a particular Caribbean island between 2010 and 2017.',
 'This response demonstrates Band 6.0 performance with adequate task fulfillment, clear overall structure, appropriate vocabulary for data description, and generally accurate grammar with some minor errors.',
 '{"taskAchievement": 6.0, "coherenceCohesion": 6.0, "lexicalResource": 6.0, "grammaticalRange": 6.0}',
 ARRAY['Clear overview statement', 'Logical organization with time-based structure', 'Appropriate data description vocabulary', 'Accurate identification of main trends'],
 ARRAY['Limited range of linking devices', 'Some repetitive vocabulary', 'Could include more specific data points', 'Minor grammatical inconsistencies'],
 true,
 'Official IELTS Practice Materials'),

-- Band 8.0 Example
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'),
 (SELECT id FROM skill_types WHERE skill_name = 'writing'),
 (SELECT id FROM test_parts WHERE part_name = 'task1' AND exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS')),
 8.0,
 'The line graph illustrates the fluctuation in tourist arrivals to a specific Caribbean island over an eight-year period from 2010 to 2017.

Overall, there was a consistent upward trajectory in visitor numbers throughout the period, with the most dramatic surge occurring in the final year. The total number of tourists more than doubled from the initial figure to the peak.

Examining the data in detail, tourist arrivals commenced at approximately 1 million in 2010 and remained relatively stable at this level through 2011. Subsequently, there was a steady, gradual increase from 2012 to 2015, with numbers climbing to roughly 1.5 million visitors annually.

The pattern shifted considerably in 2016-2017, when the island experienced unprecedented growth in tourism. Following a moderate increase to 1.5 million in 2016, arrivals surged dramatically to reach 2.5 million in 2017, representing a substantial 67% increase in just one year.

This data suggests that the Caribbean destination successfully enhanced its appeal to international tourists, particularly achieving remarkable success in its marketing and development efforts during the latter part of the period.',
 'The graph below shows the number of tourists visiting a particular Caribbean island between 2010 and 2017.',
 'This response demonstrates Band 8.0 performance with comprehensive task fulfillment, sophisticated vocabulary, complex sentence structures, and excellent coherence. Shows clear understanding of data trends with precise analysis.',
 '{"taskAchievement": 8.0, "coherenceCohesion": 8.0, "lexicalResource": 8.0, "grammaticalRange": 8.0}',
 ARRAY['Comprehensive overview with precise trend analysis', 'Sophisticated vocabulary and collocations', 'Complex sentence structures with variety', 'Excellent data interpretation and comparison', 'Seamless paragraph transitions'],
 ARRAY['Could include slightly more specific numerical data', 'Minor opportunity for even more varied sentence openings'],
 true,
 'Official IELTS Practice Materials');

-- Insert Score Benchmarks for IELTS Writing Task 1
INSERT INTO score_benchmarks (exam_type_id, skill_type_id, test_part_id, criterion_name, score_level, description, key_features, typical_errors, improvement_tips) VALUES
-- Task Achievement benchmarks
((SELECT id FROM exam_types WHERE exam_name = 'IELTS'),
 (SELECT id FROM skill_types WHERE skill_name = 'writing'),
 (SELECT id FROM test_parts WHERE part_name = 'task1' AND exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS')),
 'task_achievement', 6.0,
 'Addresses the requirements of the task with some clarity. Presents an overview with information appropriately selected.',
 ARRAY['Generally addresses the task', 'Presents an overview', 'Key features are highlighted but could be more fully extended', 'Details may be irrelevant, inappropriate or inaccurate'],
 ARRAY['Insufficient or inaccurate data', 'Missing overview', 'Irrelevant details included', 'Under 150 words'],
 ARRAY['Always include a clear overview', 'Focus on main trends and significant data', 'Ensure minimum word count is met', 'Double-check data accuracy']),

((SELECT id FROM exam_types WHERE exam_name = 'IELTS'),
 (SELECT id FROM skill_types WHERE skill_name = 'writing'),
 (SELECT id FROM test_parts WHERE part_name = 'task1' AND exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS')),
 'task_achievement', 8.0,
 'Covers the requirements of the task sufficiently. Clearly presents an overview with information appropriately selected and well-organized.',
 ARRAY['Covers all requirements of the task sufficiently', 'Clearly presents and highlights key features', 'Details are relevant, appropriate and accurate', 'Strong overview provided'],
 ARRAY['Occasional minor inaccuracy in data', 'Could be more selective with details'],
 ARRAY['Practice identifying the most significant trends', 'Focus on precision in data reporting', 'Develop stronger comparative language']);

-- Create Prompt Template for IELTS Writing Task 1
INSERT INTO prompt_templates (template_name, exam_type_id, skill_type_id, test_part_id, version, description, is_active, created_by) VALUES
('IELTS_Writing_Task1_Analysis_v1.0',
 (SELECT id FROM exam_types WHERE exam_name = 'IELTS'),
 (SELECT id FROM skill_types WHERE skill_name = 'writing'),
 (SELECT id FROM test_parts WHERE part_name = 'task1' AND exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS')),
 '1.0',
 'Comprehensive IELTS Writing Task 1 analysis prompt with scoring examples and detailed feedback',
 true,
 'System Administrator');

-- Link the prompt template to its sections
INSERT INTO prompt_template_sections (prompt_template_id, prompt_section_content_id, order_index) VALUES
((SELECT id FROM prompt_templates WHERE template_name = 'IELTS_Writing_Task1_Analysis_v1.0'),
 (SELECT psc.id FROM prompt_section_content psc 
  JOIN prompt_sections ps ON psc.prompt_section_id = ps.id 
  WHERE ps.section_name = 'system_role' 
  AND psc.exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS')
  AND psc.test_part_id = (SELECT id FROM test_parts WHERE part_name = 'task1' AND exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS'))),
 1),
((SELECT id FROM prompt_templates WHERE template_name = 'IELTS_Writing_Task1_Analysis_v1.0'),
 (SELECT psc.id FROM prompt_section_content psc 
  JOIN prompt_sections ps ON psc.prompt_section_id = ps.id 
  WHERE ps.section_name = 'scoring_criteria' 
  AND psc.exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS')
  AND psc.test_part_id = (SELECT id FROM test_parts WHERE part_name = 'task1' AND exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS'))),
 2),
((SELECT id FROM prompt_templates WHERE template_name = 'IELTS_Writing_Task1_Analysis_v1.0'),
 (SELECT psc.id FROM prompt_section_content psc 
  JOIN prompt_sections ps ON psc.prompt_section_id = ps.id 
  WHERE ps.section_name = 'output_format' 
  AND psc.exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS')
  AND psc.test_part_id = (SELECT id FROM test_parts WHERE part_name = 'task1' AND exam_type_id = (SELECT id FROM exam_types WHERE exam_name = 'IELTS'))),
 3);