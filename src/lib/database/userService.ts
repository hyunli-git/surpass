import { supabase } from '@/utils/supabaseClient';
import type { 
  UserSkillSession,
  UserMockTestSession,
  UserAnswer
} from './types';

export class UserService {
  // Create a new skill practice session
  static async createSkillSession(
    userId: string,
    practiceSetId: number
  ): Promise<UserSkillSession | null> {
    const { data, error } = await supabase
      .from('user_skill_sessions')
      .insert({
        user_id: userId,
        practice_set_id: practiceSetId,
        is_completed: false
      } as never)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Update skill session
  static async updateSkillSession(
    sessionId: number,
    updates: Partial<UserSkillSession>
  ): Promise<UserSkillSession | null> {
    const { data, error } = await supabase
      .from('user_skill_sessions')
      .update(updates as never)
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Complete skill session
  static async completeSkillSession(
    sessionId: number,
    totalQuestions: number,
    correctAnswers: number,
    score: number,
    timeSpent: number
  ): Promise<UserSkillSession | null> {
    const { data, error } = await supabase
      .from('user_skill_sessions')
      .update({
        completed_at: new Date().toISOString(),
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        score: score,
        time_spent: timeSpent,
        is_completed: true
      } as never)
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get user's skill sessions
  static async getUserSkillSessions(
    userId: string,
    practiceSetId?: number
  ): Promise<UserSkillSession[]> {
    let query = supabase
      .from('user_skill_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false });
    
    if (practiceSetId) {
      query = query.eq('practice_set_id', practiceSetId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  }

  // Create mock test session
  static async createMockTestSession(
    userId: string,
    mockTestId: number
  ): Promise<UserMockTestSession | null> {
    const { data, error } = await supabase
      .from('user_mock_test_sessions')
      .insert({
        user_id: userId,
        mock_test_id: mockTestId,
        is_completed: false
      } as never)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Complete mock test session
  static async completeMockTestSession(
    sessionId: number,
    totalScore: number,
    totalTime: number,
    sectionScores: Record<string, number>,
    feedback?: string
  ): Promise<UserMockTestSession | null> {
    const { data, error } = await supabase
      .from('user_mock_test_sessions')
      .update({
        completed_at: new Date().toISOString(),
        total_score: totalScore,
        total_time: totalTime,
        section_scores: sectionScores,
        feedback: feedback,
        is_completed: true
      } as never)
      .eq('id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Save user answer
  static async saveUserAnswer(
    userId: string,
    questionId: number,
    questionType: 'skill_practice' | 'mock_test',
    sessionId: number,
    sessionType: 'skill_practice' | 'mock_test',
    userAnswer: string,
    isCorrect: boolean,
    pointsEarned: number,
    timeTaken: number
  ): Promise<UserAnswer | null> {
    const { data, error } = await supabase
      .from('user_answers')
      .insert({
        user_id: userId,
        question_id: questionId,
        question_type: questionType,
        session_id: sessionId,
        session_type: sessionType,
        user_answer: userAnswer,
        is_correct: isCorrect,
        points_earned: pointsEarned,
        time_taken: timeTaken
      } as never)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Get user answers for a session
  static async getUserAnswers(
    userId: string,
    sessionId: number,
    sessionType: 'skill_practice' | 'mock_test'
  ): Promise<UserAnswer[]> {
    const { data, error } = await supabase
      .from('user_answers')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .eq('session_type', sessionType)
      .order('created_at');
    
    if (error) throw error;
    return data || [];
  }

  // Get user's progress statistics
  static async getUserStats(userId: string): Promise<{
    totalSessions: number;
    completedSessions: number;
    averageScore: number;
    totalTimeSpent: number;
    skillBreakdown: Record<string, { sessions: number; averageScore: number; }>;
  }> {
    // Get skill sessions
    const { data: skillSessions, error: skillError } = await supabase
      .from('user_skill_sessions')
      .select(`
        *,
        practice_set:skill_practice_sets(
          skill:skills(name, code)
        )
      `)
      .eq('user_id', userId)
      .eq('is_completed', true);

    if (skillError) throw skillError;

    // Get mock test sessions
    const { data: mockSessions, error: mockError } = await supabase
      .from('user_mock_test_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_completed', true);

    if (mockError) throw mockError;

    const totalSessions = (skillSessions?.length || 0) + (mockSessions?.length || 0);
    const completedSessions = totalSessions;
    
    const skillScores = (skillSessions || []).map((s: UserSkillSession) => s.score || 0);
    const mockScores = (mockSessions || []).map((s: UserMockTestSession) => s.total_score || 0);
    const allScores = [...skillScores, ...mockScores];
    
    const averageScore = allScores.length > 0 
      ? allScores.reduce((sum, score) => sum + score, 0) / allScores.length 
      : 0;

    const totalTimeSpent = ( (skillSessions || []).reduce(
                              (sum: number, s: UserSkillSession) => sum + (s.time_spent || 0),
                              0
                            ) ) +
                          ( (mockSessions || []).reduce(
                              (sum: number, s: UserMockTestSession) => sum + (s.total_time || 0),
                              0
                            ) );

    // Calculate skill breakdown
    type ExtendedUserSkillSession = UserSkillSession & {
      practice_set?: { skill?: { name?: string } };
    };
    const skillBreakdown: Record<string, { sessions: number; averageScore: number; }> = {};
    
    (skillSessions || []).forEach((session: ExtendedUserSkillSession) => {
      const skillName = session.practice_set?.skill?.name ?? 'Unknown';
      if (!skillBreakdown[skillName]) {
        skillBreakdown[skillName] = { sessions: 0, averageScore: 0 };
      }
      skillBreakdown[skillName].sessions++;
      skillBreakdown[skillName].averageScore += session.score || 0;
    });

    // Calculate averages
    Object.keys(skillBreakdown).forEach(skill => {
      skillBreakdown[skill].averageScore /= skillBreakdown[skill].sessions;
    });

    return {
      totalSessions,
      completedSessions,
      averageScore,
      totalTimeSpent,
      skillBreakdown
    };
  }
}
