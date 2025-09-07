-- ============================================
-- SURPASS TEST SYSTEM DATABASE SCHEMA
-- Separates Skill Practice from Mock Tests
-- ============================================

-- Test Types (IELTS, TEF, TOEFL, etc.)
CREATE TABLE test_types (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL, -- 'IELTS', 'TEF', 'TOEFL'
  name VARCHAR(100) NOT NULL,
  language VARCHAR(10) NOT NULL, -- 'en', 'fr', 'es'
  description TEXT,
  official_url VARCHAR(255),
  duration_minutes INTEGER, -- Total test duration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills (Reading, Writing, Listening, Speaking)
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL, -- 'Reading', 'Writing', 'Listening', 'Speaking'
  code VARCHAR(20) UNIQUE NOT NULL, -- 'reading', 'writing', 'listening', 'speaking'
  icon VARCHAR(10), -- '📖', '✍️', '🎧', '🗣️'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SKILL PRACTICE SYSTEM
-- Individual skill training (not full tests)
-- ============================================

-- Skill Practice Sets (Collections of exercises for one skill)
CREATE TABLE skill_practice_sets (
  id SERIAL PRIMARY KEY,
  test_type_id INTEGER REFERENCES test_types(id),
  skill_id INTEGER REFERENCES skills(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(20), -- 'beginner', 'intermediate', 'advanced'
  estimated_duration INTEGER, -- minutes
  topics TEXT[], -- ['Environment', 'Technology', 'Society']
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Practice Content (Passages, Audio, Prompts)
CREATE TABLE skill_practice_content (
  id SERIAL PRIMARY KEY,
  practice_set_id INTEGER REFERENCES skill_practice_sets(id),
  section_number INTEGER DEFAULT 1,
  title VARCHAR(255),
  content_type VARCHAR(20), -- 'text', 'audio', 'video', 'prompt'
  content_text TEXT, -- Reading passage, writing prompt, speaking topic
  instructions TEXT,
  audio_url VARCHAR(255),
  audio_duration INTEGER, -- seconds
  word_count INTEGER,
  metadata JSONB, -- Additional data like image URLs, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skill Practice Questions
CREATE TABLE skill_practice_questions (
  id SERIAL PRIMARY KEY,
  content_id INTEGER REFERENCES skill_practice_content(id),
  question_number INTEGER,
  question_type VARCHAR(50), -- 'multiple-choice', 'true-false', 'fill-blank', 'essay', 'speaking'
  question_text TEXT NOT NULL,
  options JSONB, -- For multiple choice: ["Option A", "Option B", "Option C"]
  correct_answer TEXT,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  time_limit INTEGER, -- seconds for this question
  audio_start_time INTEGER, -- For listening questions
  audio_end_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MOCK TEST SYSTEM  
-- Full test simulations (all skills combined)
-- ============================================

-- Mock Test Versions (Complete test versions)
CREATE TABLE mock_tests (
  id SERIAL PRIMARY KEY,
  test_type_id INTEGER REFERENCES test_types(id),
  version VARCHAR(50) NOT NULL, -- 'Version 1', 'Practice Test A'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  total_duration INTEGER, -- Total test time in minutes
  total_questions INTEGER,
  difficulty VARCHAR(20),
  is_official BOOLEAN DEFAULT false, -- Official past papers vs practice tests
  release_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mock Test Sections (Reading Section, Writing Section, etc.)
CREATE TABLE mock_test_sections (
  id SERIAL PRIMARY KEY,
  mock_test_id INTEGER REFERENCES mock_tests(id),
  skill_id INTEGER REFERENCES skills(id),
  section_number INTEGER, -- Order in the test (1, 2, 3, 4)
  title VARCHAR(255), -- 'Reading Section', 'Part 1: Listening'
  instructions TEXT,
  duration INTEGER, -- minutes for this section
  total_questions INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mock Test Content (Passages, Audio within sections)
CREATE TABLE mock_test_content (
  id SERIAL PRIMARY KEY,
  section_id INTEGER REFERENCES mock_test_sections(id),
  content_number INTEGER, -- Order within section
  title VARCHAR(255),
  content_type VARCHAR(20), -- 'text', 'audio', 'video'
  content_text TEXT,
  instructions TEXT,
  audio_url VARCHAR(255),
  audio_duration INTEGER,
  word_count INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mock Test Questions
CREATE TABLE mock_test_questions (
  id SERIAL PRIMARY KEY,
  content_id INTEGER REFERENCES mock_test_content(id),
  question_number INTEGER, -- Global question number in the test
  section_question_number INTEGER, -- Question number within the section
  question_type VARCHAR(50),
  question_text TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  points INTEGER DEFAULT 1,
  difficulty VARCHAR(20),
  audio_start_time INTEGER,
  audio_end_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER PROGRESS & RESULTS
-- ============================================

-- User Skill Practice Sessions
CREATE TABLE user_skill_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID, -- References auth.users
  practice_set_id INTEGER REFERENCES skill_practice_sets(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_questions INTEGER,
  correct_answers INTEGER,
  score DECIMAL(5,2),
  time_spent INTEGER, -- seconds
  is_completed BOOLEAN DEFAULT false
);

-- User Mock Test Sessions
CREATE TABLE user_mock_test_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID, -- References auth.users
  mock_test_id INTEGER REFERENCES mock_tests(id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  total_score DECIMAL(5,2),
  total_time INTEGER, -- seconds
  section_scores JSONB, -- {"reading": 8.5, "writing": 7.0, "listening": 8.0, "speaking": 7.5}
  is_completed BOOLEAN DEFAULT false,
  feedback TEXT
);

-- User Answers (for both skill practice and mock tests)
CREATE TABLE user_answers (
  id SERIAL PRIMARY KEY,
  user_id UUID,
  question_id INTEGER, -- Can reference either skill_practice_questions or mock_test_questions
  question_type VARCHAR(20), -- 'skill_practice' or 'mock_test'
  session_id INTEGER, -- References either user_skill_sessions or user_mock_test_sessions
  session_type VARCHAR(20), -- 'skill_practice' or 'mock_test'
  user_answer TEXT,
  is_correct BOOLEAN,
  points_earned INTEGER,
  time_taken INTEGER, -- seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Test Types
CREATE INDEX idx_test_types_code ON test_types(code);
CREATE INDEX idx_test_types_language ON test_types(language);

-- Skills
CREATE INDEX idx_skills_code ON skills(code);

-- Skill Practice
CREATE INDEX idx_skill_practice_sets_test_skill ON skill_practice_sets(test_type_id, skill_id);
CREATE INDEX idx_skill_practice_content_set ON skill_practice_content(practice_set_id);
CREATE INDEX idx_skill_practice_questions_content ON skill_practice_questions(content_id);

-- Mock Tests
CREATE INDEX idx_mock_tests_test_type ON mock_tests(test_type_id);
CREATE INDEX idx_mock_test_sections_test ON mock_test_sections(mock_test_id);
CREATE INDEX idx_mock_test_content_section ON mock_test_content(section_id);
CREATE INDEX idx_mock_test_questions_content ON mock_test_questions(content_id);

-- User Progress
CREATE INDEX idx_user_skill_sessions_user ON user_skill_sessions(user_id);
CREATE INDEX idx_user_mock_test_sessions_user ON user_mock_test_sessions(user_id);
CREATE INDEX idx_user_answers_user ON user_answers(user_id);
CREATE INDEX idx_user_answers_session ON user_answers(session_id, session_type);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE skill_practice_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_practice_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_practice_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skill_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_mock_test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;

-- Public read access for test content
CREATE POLICY "Public can read skill practice sets" ON skill_practice_sets FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read skill practice content" ON skill_practice_content FOR SELECT USING (true);
CREATE POLICY "Public can read skill practice questions" ON skill_practice_questions FOR SELECT USING (true);
CREATE POLICY "Public can read mock tests" ON mock_tests FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read mock test sections" ON mock_test_sections FOR SELECT USING (true);
CREATE POLICY "Public can read mock test content" ON mock_test_content FOR SELECT USING (true);
CREATE POLICY "Public can read mock test questions" ON mock_test_questions FOR SELECT USING (true);

-- User can only access their own progress
CREATE POLICY "Users can access own skill sessions" ON user_skill_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own mock test sessions" ON user_mock_test_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can access own answers" ON user_answers FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert basic test types
INSERT INTO test_types (code, name, language, description, duration_minutes) VALUES
('IELTS', 'International English Language Testing System', 'en', 'Academic and General English proficiency test', 165),
('TEF', 'Test d''évaluation de français', 'fr', 'French proficiency test for academic and professional purposes', 150),
('TEF_CANADA', 'TEF Canada', 'fr', 'French proficiency test for Canadian immigration', 150),
('TOEFL', 'Test of English as a Foreign Language', 'en', 'Academic English proficiency test', 180),
('TOEIC', 'Test of English for International Communication', 'en', 'Business English proficiency test', 120),
('OPIC', 'Oral Proficiency Interview - computer', 'en', 'Computer-based oral proficiency assessment', 40);

-- Insert skills
INSERT INTO skills (name, code, icon) VALUES
('Reading', 'reading', '📖'),
('Writing', 'writing', '✍️'),
('Listening', 'listening', '🎧'),
('Speaking', 'speaking', '🗣️');