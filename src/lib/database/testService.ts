import { supabase } from '@/utils/supabaseClient';
import type { 
  TestType, 
  Skill, 
  SkillPracticeSet, 
  SkillPracticeContent,
  SkillPracticeQuestion,
  MockTest
} from './types';

export class TestService {
  // Get all test types
  static async getTestTypes(): Promise<TestType[]> {
    const { data, error } = await supabase
      .from('test_types')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data || [];
  }

  // Get test type by code
  static async getTestTypeByCode(code: string): Promise<TestType | null> {
    const { data, error } = await supabase
      .from('test_types')
      .select('*')
      .eq('code', code.toUpperCase())
      .single();
    
    if (error) return null;
    return data;
  }

  // Get all skills
  static async getSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data || [];
  }

  // Get skill by code
  static async getSkillByCode(code: string): Promise<Skill | null> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('code', code.toLowerCase())
      .single();
    
    if (error) return null;
    return data;
  }

  // Get skill practice sets for a test type and skill
  static async getSkillPracticeSets(
    testTypeCode: string, 
    skillCode: string
  ): Promise<SkillPracticeSet[]> {
    const { data, error } = await supabase
      .from('skill_practice_sets')
      .select(`
        *,
        test_type:test_types(*),
        skill:skills(*)
      `)
      .eq('test_types.code', testTypeCode.toUpperCase())
      .eq('skills.code', skillCode.toLowerCase())
      .eq('is_active', true)
      .order('id');
    
    if (error) throw error;
    return data || [];
  }

  // Get skill practice set with content and questions
  static async getSkillPracticeSetWithContent(
    setId: number
  ): Promise<SkillPracticeSet | null> {
    const { data, error } = await supabase
      .from('skill_practice_sets')
      .select(`
        *,
        test_type:test_types(*),
        skill:skills(*),
        content:skill_practice_content(
          *,
          questions:skill_practice_questions(*)
        )
      `)
      .eq('id', setId)
      .eq('is_active', true)
      .single();
    
    if (error) return null;
    return data;
  }

  // Get skill practice content by ID
  static async getSkillPracticeContent(
    contentId: number
  ): Promise<SkillPracticeContent | null> {
    const { data, error } = await supabase
      .from('skill_practice_content')
      .select(`
        *,
        questions:skill_practice_questions(*)
      `)
      .eq('id', contentId)
      .single();
    
    if (error) return null;
    return data;
  }

  // Get skill practice questions for content
  static async getSkillPracticeQuestions(
    contentId: number
  ): Promise<SkillPracticeQuestion[]> {
    const { data, error } = await supabase
      .from('skill_practice_questions')
      .select('*')
      .eq('content_id', contentId)
      .order('question_number');
    
    if (error) throw error;
    return data || [];
  }

  // Get mock tests for a test type
  static async getMockTests(testTypeCode: string): Promise<MockTest[]> {
    const { data, error } = await supabase
      .from('mock_tests')
      .select(`
        *,
        test_type:test_types(*)
      `)
      .eq('test_types.code', testTypeCode.toUpperCase())
      .eq('is_active', true)
      .order('id');
    
    if (error) throw error;
    return data || [];
  }

  // Get mock test with sections
  static async getMockTestWithSections(
    testId: number
  ): Promise<MockTest | null> {
    const { data, error } = await supabase
      .from('mock_tests')
      .select(`
        *,
        test_type:test_types(*),
        sections:mock_test_sections(
          *,
          skill:skills(*),
          content:mock_test_content(
            *,
            questions:mock_test_questions(*)
          )
        )
      `)
      .eq('id', testId)
      .eq('is_active', true)
      .single();
    
    if (error) return null;
    return data;
  }

  // Search skill practice sets by topic
  static async searchSkillPracticeSets(
    testTypeCode: string,
    skillCode: string,
    topics: string[]
  ): Promise<SkillPracticeSet[]> {
    const { data, error } = await supabase
      .from('skill_practice_sets')
      .select(`
        *,
        test_type:test_types(*),
        skill:skills(*)
      `)
      .eq('test_types.code', testTypeCode.toUpperCase())
      .eq('skills.code', skillCode.toLowerCase())
      .contains('topics', topics)
      .eq('is_active', true)
      .order('id');
    
    if (error) throw error;
    return data || [];
  }

  // Get practice sets by difficulty
  static async getSkillPracticeSetsByDifficulty(
    testTypeCode: string,
    skillCode: string,
    difficulty: string
  ): Promise<SkillPracticeSet[]> {
    const { data, error } = await supabase
      .from('skill_practice_sets')
      .select(`
        *,
        test_type:test_types(*),
        skill:skills(*)
      `)
      .eq('test_types.code', testTypeCode.toUpperCase())
      .eq('skills.code', skillCode.toLowerCase())
      .eq('difficulty', difficulty)
      .eq('is_active', true)
      .order('id');
    
    if (error) throw error;
    return data || [];
  }
}