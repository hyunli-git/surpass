-- Supabase Schema for Dynamic Mock Tests
-- Execute these SQL commands in your Supabase SQL Editor

-- 1. Tests table - stores basic test information
CREATE TABLE tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL, -- e.g., 'IELTS', 'TOEIC', 'TEF'
  name VARCHAR(100) NOT NULL, -- e.g., 'IELTS Academic'
  description TEXT,
  total_duration INTEGER, -- total minutes for the test
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Mock tests table - stores specific mock test versions
CREATE TABLE mock_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL, -- e.g., 'IELTS Academic Mock Test 1'
  difficulty_level VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Test sections table - stores section information (listening, reading, etc.)
CREATE TABLE test_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mock_test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE,
  section_type VARCHAR(20) NOT NULL, -- 'listening', 'reading', 'writing', 'speaking'
  section_title VARCHAR(100) NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  total_questions INTEGER NOT NULL,
  section_order INTEGER NOT NULL, -- 1, 2, 3, 4
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Questions table - stores individual questions
CREATE TABLE questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID REFERENCES test_sections(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_type VARCHAR(30) NOT NULL, -- 'multiple_choice', 'fill_blank', 'essay', 'audio_response'
  question_text TEXT NOT NULL,
  audio_url TEXT, -- for listening questions
  passage_text TEXT, -- for reading questions
  options JSONB, -- for multiple choice: {"A": "option1", "B": "option2", "C": "option3"}
  correct_answer TEXT, -- correct answer key
  points INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. User responses table - stores user answers
CREATE TABLE user_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- references auth.users
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  mock_test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE,
  user_answer TEXT,
  is_correct BOOLEAN,
  time_spent INTEGER, -- seconds spent on this question
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Test results table - stores overall test results
CREATE TABLE test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- references auth.users
  mock_test_id UUID REFERENCES mock_tests(id) ON DELETE CASCADE,
  total_score DECIMAL(5,2),
  max_score DECIMAL(5,2),
  percentage DECIMAL(5,2),
  time_taken INTEGER, -- total seconds
  section_scores JSONB, -- {"listening": 7.5, "reading": 8.0, "writing": 7.0, "speaking": 7.5}
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_mock_tests_test_id ON mock_tests(test_id);
CREATE INDEX idx_test_sections_mock_test_id ON test_sections(mock_test_id);
CREATE INDEX idx_questions_section_id ON questions(section_id);
CREATE INDEX idx_user_responses_user_id ON user_responses(user_id);
CREATE INDEX idx_user_responses_mock_test_id ON user_responses(mock_test_id);
CREATE INDEX idx_test_results_user_id ON test_results(user_id);

-- Sample data insertion
INSERT INTO tests (code, name, description, total_duration) VALUES
  ('IELTS', 'IELTS Academic', 'International English Language Testing System - Academic', 165),
  ('TOEIC', 'TOEIC Listening & Reading', 'Test of English for International Communication', 120),
  ('TEF', 'TEF Canada', 'Test d''évaluation de français pour le Canada', 210),
  ('TOEFL', 'TOEFL iBT', 'Test of English as a Foreign Language', 180),
  ('HSK', 'HSK Level 4', 'Hanyu Shuiping Kaoshi - Chinese Proficiency Test', 105),
  ('JLPT', 'JLPT N2', 'Japanese Language Proficiency Test', 155);

-- Row Level Security (RLS) policies
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- Allow read access to test data for all authenticated users
CREATE POLICY "Allow read access to tests" ON tests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to mock_tests" ON mock_tests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to test_sections" ON test_sections FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow read access to questions" ON questions FOR SELECT TO authenticated USING (true);

-- Allow users to insert/update/delete their own responses and results
CREATE POLICY "Users can manage own responses" ON user_responses FOR ALL TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own results" ON test_results FOR ALL TO authenticated USING (auth.uid() = user_id);