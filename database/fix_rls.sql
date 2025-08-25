-- Disable RLS for prompt management tables to allow public access

-- Disable RLS on all prompt management tables
ALTER TABLE exam_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE skill_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE test_parts DISABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_section_content DISABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_template_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_examples DISABLE ROW LEVEL SECURITY;
ALTER TABLE score_benchmarks DISABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_usage_analytics DISABLE ROW LEVEL SECURITY;

-- Grant public access to read these tables
GRANT SELECT ON exam_types TO anon;
GRANT SELECT ON skill_types TO anon;
GRANT SELECT ON test_parts TO anon;
GRANT SELECT ON prompt_sections TO anon;
GRANT SELECT ON prompt_templates TO anon;
GRANT SELECT ON prompt_section_content TO anon;
GRANT SELECT ON prompt_template_sections TO anon;
GRANT SELECT ON scoring_examples TO anon;
GRANT SELECT ON score_benchmarks TO anon;
GRANT SELECT ON prompt_usage_analytics TO anon;

-- Grant authenticated users full access
GRANT ALL ON exam_types TO authenticated;
GRANT ALL ON skill_types TO authenticated;
GRANT ALL ON test_parts TO authenticated;
GRANT ALL ON prompt_sections TO authenticated;
GRANT ALL ON prompt_templates TO authenticated;
GRANT ALL ON prompt_section_content TO authenticated;
GRANT ALL ON prompt_template_sections TO authenticated;
GRANT ALL ON scoring_examples TO authenticated;
GRANT ALL ON score_benchmarks TO authenticated;
GRANT ALL ON prompt_usage_analytics TO authenticated;