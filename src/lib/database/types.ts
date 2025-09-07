// Database types for Supabase schema

export interface TestType {
  id: number;
  code: string;
  name: string;
  language: string;
  description?: string;
  official_url?: string;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: number;
  name: string;
  code: string;
  icon?: string;
  created_at: string;
}

export interface SkillPracticeSet {
  id: number;
  test_type_id: number;
  skill_id: number;
  title: string;
  description?: string;
  difficulty?: string;
  estimated_duration?: number;
  topics?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  test_type?: TestType;
  skill?: Skill;
  content?: SkillPracticeContent[];
}

export interface SkillPracticeContent {
  id: number;
  practice_set_id: number;
  section_number: number;
  title?: string;
  content_type: 'text' | 'audio' | 'video' | 'prompt';
  content_text?: string;
  instructions?: string;
  audio_url?: string;
  audio_duration?: number;
  word_count?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  // Relations
  questions?: SkillPracticeQuestion[];
}

export interface SkillPracticeQuestion {
  id: number;
  content_id: number;
  question_number: number;
  question_type: string;
  question_text: string;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
  points: number;
  time_limit?: number;
  audio_start_time?: number;
  audio_end_time?: number;
  created_at: string;
}

export interface MockTest {
  id: number;
  test_type_id: number;
  version: string;
  title: string;
  description?: string;
  total_duration?: number;
  total_questions?: number;
  difficulty?: string;
  is_official: boolean;
  release_date?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  test_type?: TestType;
  sections?: MockTestSection[];
}

export interface MockTestSection {
  id: number;
  mock_test_id: number;
  skill_id: number;
  section_number: number;
  title?: string;
  instructions?: string;
  duration?: number;
  total_questions?: number;
  created_at: string;
  // Relations
  skill?: Skill;
  content?: MockTestContent[];
}

export interface MockTestContent {
  id: number;
  section_id: number;
  content_number: number;
  title?: string;
  content_type: string;
  content_text?: string;
  instructions?: string;
  audio_url?: string;
  audio_duration?: number;
  word_count?: number;
  metadata?: Record<string, unknown>;
  created_at: string;
  // Relations
  questions?: MockTestQuestion[];
}

export interface MockTestQuestion {
  id: number;
  content_id: number;
  question_number: number;
  section_question_number: number;
  question_type: string;
  question_text: string;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
  points: number;
  difficulty?: string;
  audio_start_time?: number;
  audio_end_time?: number;
  created_at: string;
}

export interface UserSkillSession {
  id: number;
  user_id: string;
  practice_set_id: number;
  started_at: string;
  completed_at?: string;
  total_questions?: number;
  correct_answers?: number;
  score?: number;
  time_spent?: number;
  is_completed: boolean;
}

export interface UserMockTestSession {
  id: number;
  user_id: string;
  mock_test_id: number;
  started_at: string;
  completed_at?: string;
  total_score?: number;
  total_time?: number;
  section_scores?: Record<string, number>;
  is_completed: boolean;
  feedback?: string;
}

export interface UserAnswer {
  id: number;
  user_id: string;
  question_id: number;
  question_type: 'skill_practice' | 'mock_test';
  session_id: number;
  session_type: 'skill_practice' | 'mock_test';
  user_answer?: string;
  is_correct?: boolean;
  points_earned?: number;
  time_taken?: number;
  created_at: string;
}