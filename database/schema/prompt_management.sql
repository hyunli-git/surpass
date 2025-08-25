-- Comprehensive Prompt Management System for AI Assessment
-- This schema supports modular, reusable prompt components for different exams

-- 1. Exam Types table
CREATE TABLE exam_types (
  id SERIAL PRIMARY KEY,
  exam_name VARCHAR(50) NOT NULL UNIQUE, -- 'IELTS', 'TOEFL_iBT', 'TOEIC', 'PTE', etc.
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Skill Types table
CREATE TABLE skill_types (
  id SERIAL PRIMARY KEY,
  skill_name VARCHAR(20) NOT NULL UNIQUE, -- 'speaking', 'writing', 'reading', 'listening'
  display_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Test Parts table (for different sections within skills)
CREATE TABLE test_parts (
  id SERIAL PRIMARY KEY,
  exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE CASCADE,
  skill_type_id INTEGER REFERENCES skill_types(id) ON DELETE CASCADE,
  part_name VARCHAR(50) NOT NULL, -- 'task1', 'task2', 'part1', 'part2', 'part3'
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  max_score DECIMAL(3,1), -- For IELTS: 9.0, TOEFL: varies
  duration_minutes INTEGER,
  word_count_min INTEGER,
  word_count_max INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(exam_type_id, skill_type_id, part_name)
);

-- 4. Prompt Sections table (reusable components)
CREATE TABLE prompt_sections (
  id SERIAL PRIMARY KEY,
  section_name VARCHAR(100) NOT NULL UNIQUE, -- 'system_role', 'scoring_criteria', 'output_format', 'instructions'
  description TEXT,
  is_modular BOOLEAN DEFAULT true, -- Can be reused across different prompts
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Prompt Templates table (main prompt configurations)
CREATE TABLE prompt_templates (
  id SERIAL PRIMARY KEY,
  template_name VARCHAR(100) NOT NULL,
  exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE CASCADE,
  skill_type_id INTEGER REFERENCES skill_types(id) ON DELETE CASCADE,
  test_part_id INTEGER REFERENCES test_parts(id) ON DELETE CASCADE,
  version VARCHAR(20) DEFAULT '1.0',
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(exam_type_id, skill_type_id, test_part_id, version)
);

-- 6. Prompt Section Content (the actual text content for each section)
CREATE TABLE prompt_section_content (
  id SERIAL PRIMARY KEY,
  prompt_section_id INTEGER REFERENCES prompt_sections(id) ON DELETE CASCADE,
  exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE CASCADE,
  skill_type_id INTEGER REFERENCES skill_types(id),
  test_part_id INTEGER REFERENCES test_parts(id),
  content TEXT NOT NULL,
  content_type VARCHAR(20) DEFAULT 'system', -- 'system', 'user', 'instruction'
  order_index INTEGER DEFAULT 0,
  variables JSONB, -- Store template variables like {exam_name}, {skill_name}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Prompt Template Links (connects templates to their sections)
CREATE TABLE prompt_template_sections (
  id SERIAL PRIMARY KEY,
  prompt_template_id INTEGER REFERENCES prompt_templates(id) ON DELETE CASCADE,
  prompt_section_content_id INTEGER REFERENCES prompt_section_content(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL, -- Order of sections in final prompt
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(prompt_template_id, prompt_section_content_id)
);

-- 8. Scoring Examples table (crucial for accurate AI assessment)
CREATE TABLE scoring_examples (
  id SERIAL PRIMARY KEY,
  exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE CASCADE,
  skill_type_id INTEGER REFERENCES skill_types(id) ON DELETE CASCADE,
  test_part_id INTEGER REFERENCES test_parts(id) ON DELETE CASCADE,
  score_level DECIMAL(3,1) NOT NULL, -- 4.0, 4.5, 5.0, etc.
  example_response TEXT NOT NULL,
  example_question TEXT,
  score_justification TEXT NOT NULL, -- Why this response got this score
  criteria_breakdown JSONB, -- {"taskAchievement": 4.0, "coherence": 4.5, etc.}
  strengths TEXT[], -- Array of strength points
  weaknesses TEXT[], -- Array of weakness points
  examiner_notes TEXT,
  is_verified BOOLEAN DEFAULT false, -- Verified by expert examiners
  source VARCHAR(100), -- Official samples, practice tests, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Score Benchmarks table (detailed criteria for each score level)
CREATE TABLE score_benchmarks (
  id SERIAL PRIMARY KEY,
  exam_type_id INTEGER REFERENCES exam_types(id) ON DELETE CASCADE,
  skill_type_id INTEGER REFERENCES skill_types(id) ON DELETE CASCADE,
  test_part_id INTEGER REFERENCES test_parts(id),
  criterion_name VARCHAR(100) NOT NULL, -- 'task_achievement', 'fluency_coherence', etc.
  score_level DECIMAL(3,1) NOT NULL,
  description TEXT NOT NULL,
  key_features TEXT[], -- Array of key features for this score level
  typical_errors TEXT[], -- Common errors at this level
  improvement_tips TEXT[], -- How to reach the next level
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(exam_type_id, skill_type_id, test_part_id, criterion_name, score_level)
);

-- 10. Prompt Usage Analytics table (track prompt performance)
CREATE TABLE prompt_usage_analytics (
  id SERIAL PRIMARY KEY,
  prompt_template_id INTEGER REFERENCES prompt_templates(id) ON DELETE CASCADE,
  usage_count INTEGER DEFAULT 0,
  avg_processing_time DECIMAL(8,2), -- in seconds
  success_rate DECIMAL(5,2), -- percentage of successful analyses
  last_used_at TIMESTAMP,
  performance_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_prompt_templates_active ON prompt_templates(is_active);
CREATE INDEX idx_prompt_templates_exam_skill ON prompt_templates(exam_type_id, skill_type_id);
CREATE INDEX idx_scoring_examples_exam_skill_score ON scoring_examples(exam_type_id, skill_type_id, score_level);
CREATE INDEX idx_prompt_section_content_exam_type ON prompt_section_content(exam_type_id, skill_type_id);
CREATE INDEX idx_score_benchmarks_lookup ON score_benchmarks(exam_type_id, skill_type_id, criterion_name, score_level);

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_exam_types_updated_at BEFORE UPDATE ON exam_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prompt_templates_updated_at BEFORE UPDATE ON prompt_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prompt_section_content_updated_at BEFORE UPDATE ON prompt_section_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scoring_examples_updated_at BEFORE UPDATE ON scoring_examples FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prompt_usage_analytics_updated_at BEFORE UPDATE ON prompt_usage_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();