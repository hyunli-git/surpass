# Database Setup Guide

This guide explains how to set up the Surpass test system database with Supabase.

## Overview

The database has been restructured to separate **skill practice** from **mock tests**:
- **Skill Practice**: Individual skill training (reading, writing, listening, speaking)
- **Mock Tests**: Complete test simulations with all skills combined

## Setup Steps

### 1. Execute the Schema

The database schema is ready in `database/schema/test_system.sql`. To apply it:

1. Go to your Supabase SQL Editor: https://supabase.com/dashboard/project/zszhcmcskltkzfapwsek/sql
2. Copy the contents of `database/schema/test_system.sql`
3. Paste and execute the SQL to create all tables, indexes, and RLS policies

### 2. Insert Initial Data

After the schema is created, insert the sample test data:

1. In the same SQL Editor, copy the contents of `database/seeds/initial_test_data.sql`
2. Paste and execute to populate with sample TEF and IELTS content

## Database Structure

### Core Tables

- `test_types`: IELTS, TEF, TOEFL, etc.
- `skills`: Reading, Writing, Listening, Speaking

### Skill Practice System

- `skill_practice_sets`: Collections of exercises for one skill
- `skill_practice_content`: Passages, audio, prompts
- `skill_practice_questions`: Individual questions

### Mock Test System

- `mock_tests`: Complete test versions
- `mock_test_sections`: Sections within tests (by skill)
- `mock_test_content`: Content within sections
- `mock_test_questions`: Questions within content

### User Progress

- `user_skill_sessions`: Skill practice sessions
- `user_mock_test_sessions`: Mock test sessions
- `user_answers`: All user responses

## Code Integration

The following services are available for database integration:

- `@/lib/database/testService`: Query test content
- `@/lib/database/userService`: Track user progress
- `@/lib/database/types`: TypeScript interfaces

### Example Usage

```typescript
import { TestService } from '@/lib/database/testService';

// Get writing practice sets for TEF
const sets = await TestService.getSkillPracticeSets('TEF', 'writing');

// Get specific practice set with content
const practiceSet = await TestService.getSkillPracticeSetWithContent(1);
```

## Current Status

✅ **Completed:**
- Database schema designed and ready
- Service utilities created for data access
- Writing practice page updated to use database
- Fallback to hardcoded data if database is empty

🟡 **Next Steps:**
1. Execute the SQL schema in Supabase dashboard
2. Run the initial data seeds
3. Update remaining skill practice pages (reading, listening, speaking)
4. Create admin interface for content management

## Benefits

- **Scalable**: Easy to add new tests and content
- **Flexible**: Supports multiple test types and formats  
- **Secure**: Row Level Security protects user data
- **Performance**: Optimized indexes for fast queries
- **Maintainable**: Structured data instead of hardcoded content