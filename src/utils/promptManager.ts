// Prompt Management System Utilities
// This module provides functions to retrieve and build prompts dynamically from the database

import { supabase } from './supabaseClient';

export interface PromptTemplate {
  id: number;
  template_name: string;
  exam_type: {
    exam_name: string;
    display_name: string;
  };
  skill_type: {
    skill_name: string;
    display_name: string;
  };
  test_part: {
    part_name: string;
    display_name: string;
  };
  version: string;
  description: string;
}

export interface PromptSectionContent {
  id: number;
  content: string;
  content_type: string;
  order_index: number;
  variables: Record<string, unknown>;
  section_name: string;
}

export interface ScoringExample {
  score_level: number;
  example_response: string;
  example_question: string;
  score_justification: string;
  criteria_breakdown: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
}

export interface ScoreBenchmark {
  criterion_name: string;
  score_level: number;
  description: string;
  key_features: string[];
  typical_errors: string[];
  improvement_tips: string[];
}

class PromptManager {
  
  /**
   * Get a complete prompt template by exam, skill, and part
   */
  async getPromptTemplate(
    examName: string, 
    skillName: string, 
    partName?: string,
    version: string = 'latest'
  ): Promise<PromptTemplate | null> {
    try {
      let query = supabase
        .from('prompt_templates')
        .select(`
          id,
          template_name,
          version,
          description,
          exam_types!inner (
            exam_name,
            display_name
          ),
          skill_types!inner (
            skill_name,
            display_name
          ),
          test_parts (
            part_name,
            display_name
          )
        `)
        .eq('exam_types.exam_name', examName)
        .eq('skill_types.skill_name', skillName)
        .eq('is_active', true);

      if (partName) {
        query = query.eq('test_parts.part_name', partName);
      }

      if (version !== 'latest') {
        query = query.eq('version', version);
      } else {
        query = query.order('version', { ascending: false }).limit(1);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error('Error fetching prompt template:', error);
        return null;
      }

      return data as unknown as PromptTemplate;
    } catch (error) {
      console.error('Error in getPromptTemplate:', error);
      return null;
    }
  }

  /**
   * Build the complete prompt text from template sections
   */
  async buildPrompt(
    templateId: number, 
    variables: Record<string, unknown> = {}
  ): Promise<{ systemPrompt: string; userPrompt: string; instructions: string } | null> {
    try {
      const { data, error } = await supabase
        .from('prompt_template_sections')
        .select(`
          order_index,
          prompt_section_content (
            content,
            content_type,
            variables,
            prompt_sections (
              section_name
            )
          )
        `)
        .eq('prompt_template_id', templateId)
        .order('order_index');

      if (error) {
        console.error('Error fetching prompt sections:', error);
        return null;
      }

      let systemPrompt = '';
      let userPrompt = '';
      let instructions = '';

      for (const section of data) {
        const content = Array.isArray(section.prompt_section_content) ? section.prompt_section_content[0] : section.prompt_section_content;
        const processedContent = this.processVariables(content?.content || '', {
          ...(content?.variables || {}),
          ...variables
        });

        switch (content?.content_type) {
          case 'system':
            systemPrompt += processedContent + '\n\n';
            break;
          case 'user':
            userPrompt += processedContent + '\n\n';
            break;
          case 'instruction':
            instructions += processedContent + '\n\n';
            break;
          default:
            instructions += processedContent + '\n\n';
        }
      }

      return {
        systemPrompt: systemPrompt.trim(),
        userPrompt: userPrompt.trim(),
        instructions: instructions.trim()
      };
    } catch (error) {
      console.error('Error in buildPrompt:', error);
      return null;
    }
  }

  /**
   * Get scoring examples for calibration
   */
  async getScoringExamples(
    examName: string,
    skillName: string,
    partName?: string,
    scoreLevels?: number[]
  ): Promise<ScoringExample[]> {
    try {
      const baseSelect = `
        score_level,
        example_response,
        example_question,
        score_justification,
        criteria_breakdown,
        strengths,
        weaknesses,
        exam_types!inner (exam_name),
        skill_types!inner (skill_name)
      `;

      const selectWithPart = `
        score_level,
        example_response,
        example_question,
        score_justification,
        criteria_breakdown,
        strengths,
        weaknesses,
        exam_types!inner (exam_name),
        skill_types!inner (skill_name),
        test_parts!inner (part_name)
      `;

      let query = supabase
        .from('scoring_examples')
        .select(partName ? selectWithPart : baseSelect)
        .eq('exam_types.exam_name', examName)
        .eq('skill_types.skill_name', skillName)
        .eq('is_verified', true);

      if (partName) {
        query = query.eq('test_parts.part_name', partName);
      }

      if (scoreLevels && scoreLevels.length > 0) {
        query = query.in('score_level', scoreLevels);
      }

      const { data, error } = await query.order('score_level');

      if (error) {
        console.error('Error fetching scoring examples:', error);
        return [];
      }

      return (data || []) as unknown as ScoringExample[];
    } catch (error) {
      console.error('Error in getScoringExamples:', error);
      return [];
    }
  }

  /**
   * Get score benchmarks for detailed criteria
   */
  async getScoreBenchmarks(
    examName: string,
    skillName: string,
    partName?: string
  ): Promise<ScoreBenchmark[]> {
    try {
      const baseSelect = `
        criterion_name,
        score_level,
        description,
        key_features,
        typical_errors,
        improvement_tips,
        exam_types!inner (exam_name),
        skill_types!inner (skill_name)
      `;

      const selectWithPart = `
        criterion_name,
        score_level,
        description,
        key_features,
        typical_errors,
        improvement_tips,
        exam_types!inner (exam_name),
        skill_types!inner (skill_name),
        test_parts!inner (part_name)
      `;

      let query = supabase
        .from('score_benchmarks')
        .select(partName ? selectWithPart : baseSelect)
        .eq('exam_types.exam_name', examName)
        .eq('skill_types.skill_name', skillName);

      if (partName) {
        query = query.eq('test_parts.part_name', partName);
      }

      const { data, error } = await query.order('criterion_name, score_level');

      if (error) {
        console.error('Error fetching score benchmarks:', error);
        return [];
      }

      return (data || []) as unknown as ScoreBenchmark[];
    } catch (error) {
      console.error('Error in getScoreBenchmarks:', error);
      return [];
    }
  }

  /**
   * Get complete analysis prompt with examples and benchmarks
   */
  async getCompleteAnalysisPrompt(
    examName: string,
    skillName: string,
    partName: string,
    studentResponse: string,
    question?: string
  ): Promise<{
    systemPrompt: string;
    userPrompt: string;
    examples: ScoringExample[];
    benchmarks: ScoreBenchmark[];
  } | null> {
    try {
      // Get the prompt template
      const template = await this.getPromptTemplate(examName, skillName, partName);
      if (!template) return null;

      // Build the prompt with variables
      const promptData = await this.buildPrompt(template.id, {
        examName,
        skillName,
        partName,
        studentResponse,
        question: question || '',
        wordCount: studentResponse.trim().split(/\s+/).length
      });
      if (!promptData) return null;

      // Get scoring examples and benchmarks
      const [examples, benchmarks] = await Promise.all([
        this.getScoringExamples(examName, skillName, partName),
        this.getScoreBenchmarks(examName, skillName, partName)
      ]);

      // Build the complete user prompt
      let completeUserPrompt = `${promptData.instructions}\n\n`;
      
      if (question) {
        completeUserPrompt += `Question: "${question}"\n\n`;
      }
      
      completeUserPrompt += `Student Response: "${studentResponse}"\n\n`;
      completeUserPrompt += `Word Count: ${studentResponse.trim().split(/\s+/).length}\n\n`;

      // Add scoring examples if available
      if (examples.length > 0) {
        completeUserPrompt += `Reference Scoring Examples:\n`;
        examples.forEach(example => {
          completeUserPrompt += `\nBand ${example.score_level} Example:\n`;
          completeUserPrompt += `Response: "${example.example_response}"\n`;
          completeUserPrompt += `Justification: ${example.score_justification}\n`;
        });
        completeUserPrompt += '\n';
      }

      return {
        systemPrompt: promptData.systemPrompt,
        userPrompt: completeUserPrompt,
        examples,
        benchmarks
      };
    } catch (error) {
      console.error('Error in getCompleteAnalysisPrompt:', error);
      return null;
    }
  }

  /**
   * Track prompt usage for analytics
   */
  async trackPromptUsage(
    templateId: number,
    processingTime: number,
    success: boolean
  ): Promise<void> {
    try {
      // Get current analytics
      const { data: existing } = await supabase
        .from('prompt_usage_analytics')
        .select('*')
        .eq('prompt_template_id', templateId)
        .single();

      if (existing) {
        // Update existing record
        const newCount = existing.usage_count + 1;
        const newAvgTime = ((existing.avg_processing_time * existing.usage_count) + processingTime) / newCount;
        const successCount = existing.success_rate ? Math.round((existing.success_rate / 100) * existing.usage_count) : 0;
        const newSuccessRate = ((successCount + (success ? 1 : 0)) / newCount) * 100;

        await supabase
          .from('prompt_usage_analytics')
          .update({
            usage_count: newCount,
            avg_processing_time: newAvgTime,
            success_rate: newSuccessRate,
            last_used_at: new Date().toISOString()
          })
          .eq('id', existing.id);
      } else {
        // Create new record
        await supabase
          .from('prompt_usage_analytics')
          .insert({
            prompt_template_id: templateId,
            usage_count: 1,
            avg_processing_time: processingTime,
            success_rate: success ? 100 : 0,
            last_used_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Error tracking prompt usage:', error);
    }
  }

  /**
   * Process template variables in content
   */
  private processVariables(content: string, variables: Record<string, unknown>): string {
    let processedContent = content;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      processedContent = processedContent.replace(regex, String(value));
    });

    return processedContent;
  }
}

// Export singleton instance
export const promptManager = new PromptManager();

// Backward compatibility functions for existing API routes
export async function getWritingAnalysisPrompt(
  task: 'task1' | 'task2',
  text: string,
  question?: string
): Promise<{ systemPrompt: string; userPrompt: string } | null> {
  const result = await promptManager.getCompleteAnalysisPrompt(
    'IELTS',
    'writing',
    task,
    text,
    question
  );

  return result ? {
    systemPrompt: result.systemPrompt,
    userPrompt: result.userPrompt
  } : null;
}

export async function getSpeakingAnalysisPrompt(
  part: 'part1' | 'part2' | 'part3',
  transcript: string,
  question?: string
): Promise<{ systemPrompt: string; userPrompt: string } | null> {
  const result = await promptManager.getCompleteAnalysisPrompt(
    'IELTS',
    'speaking',
    part,
    transcript,
    question
  );

  return result ? {
    systemPrompt: result.systemPrompt,
    userPrompt: result.userPrompt
  } : null;
}