# 🗄️ Supabase Database Setup for Prompt Management System

Since Supabase requires manual SQL execution for schema changes, follow these steps to set up the prompt management system:

## 📋 Setup Instructions

### Step 1: Open Supabase SQL Editor
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor**
4. Create a new query

### Step 2: Execute Schema SQL
Copy and paste the entire content from `database/schema/prompt_management.sql` into the SQL editor and run it.

**Key Tables Created:**
- `exam_types` - IELTS, TOEFL, TOEIC, etc.
- `skill_types` - Speaking, Writing, Reading, Listening  
- `test_parts` - Task1, Task2, Part1, Part2, etc.
- `prompt_sections` - Reusable prompt components
- `prompt_templates` - Complete prompt configurations
- `prompt_section_content` - Actual prompt text content
- `scoring_examples` - Sample responses with scores
- `score_benchmarks` - Detailed scoring criteria

### Step 3: Insert Seed Data
Copy and paste the entire content from `database/seed/prompt_management_seed.sql` into a new query and run it.

**Sample Data Includes:**
- ✅ IELTS, TOEFL, TOEIC, PTE, Duolingo exam types
- ✅ Speaking, Writing, Reading, Listening skills
- ✅ IELTS Writing Task 1 complete prompt template
- ✅ Band 6.0 and 8.0 scoring examples
- ✅ Score benchmarks with improvement tips

### Step 4: Verify Setup
Run this query to verify everything was created correctly:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%prompt%' OR table_name IN ('exam_types', 'skill_types', 'test_parts', 'scoring_examples', 'score_benchmarks');

-- Check sample data
SELECT 
  et.display_name as exam,
  st.display_name as skill, 
  tp.display_name as part,
  pt.template_name,
  pt.version
FROM prompt_templates pt
JOIN exam_types et ON pt.exam_type_id = et.id
JOIN skill_types st ON pt.skill_type_id = st.id
LEFT JOIN test_parts tp ON pt.test_part_id = tp.id;
```

## 🔧 Usage After Setup

### Access Admin Interface
Visit `/admin/prompts` to manage prompt templates:
- View existing templates
- Preview prompt content
- Test prompt generation
- Filter by exam/skill/part

### Use in API Routes
```typescript
import { promptManager } from '@/utils/promptManager';

// Get complete prompt for IELTS Writing Task 1
const promptData = await promptManager.getCompleteAnalysisPrompt(
  'IELTS',
  'writing', 
  'task1',
  studentResponse,
  question
);

// Use the generated prompts
const completion = await openai.chat.completions.create({
  model: 'gpt-4',
  messages: [
    { role: 'system', content: promptData.systemPrompt },
    { role: 'user', content: promptData.userPrompt }
  ]
});
```

## 🎯 Skill-Specific Customization

Each IELTS skill can have completely different prompts:

### 🗣️ Speaking (Part 1, 2, 3)
- Fluency & Coherence focus
- Pronunciation assessment
- Natural conversation flow

### ✍️ Writing (Task 1, Task 2) 
- Task Achievement criteria
- Data accuracy for Task 1
- Argument development for Task 2

### 📖 Reading
- Comprehension strategies
- Question type analysis
- Time management

### 🎧 Listening
- Accent recognition
- Note-taking skills
- Context understanding

## 🚀 Next Steps

1. **Execute the SQL files** in Supabase SQL Editor
2. **Test the admin interface** at `/admin/prompts`
3. **Create custom prompts** for different exam sections
4. **Add more scoring examples** for better AI calibration
5. **Update existing API routes** to use the new system

The system is now ready to support **exam-specific optimization** with unlimited customization potential!