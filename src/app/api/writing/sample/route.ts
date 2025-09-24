// src/app/api/writing/sample/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import OpenAI from 'openai';
import { supabase } from '@/utils/supabaseClient';

const BodySchema = z.object({
  response: z.string().min(10),
  task: z.enum(['task1', 'task2']),
  band: z.number().int().min(6).max(9),
  prompt: z.string().optional(),
  examName: z.string().default('IELTS'),
  skillName: z.string().default('writing'),
});

async function getIds(examName: string, skillName: string, partName: string) {
  const [examRes, skillRes, partRes] = await Promise.all([
    supabase.from('exam_types').select('id, exam_name').eq('exam_name', examName).single(),
    supabase.from('skill_types').select('id, skill_name').eq('skill_name', skillName).single(),
    supabase.from('test_parts').select('id, part_name').eq('part_name', partName).maybeSingle(),
  ]);

  return {
    exam_type_id: (examRes.data as { id?: number } | null)?.id || null,
    skill_type_id: (skillRes.data as { id?: number } | null)?.id || null,
    test_part_id: (partRes.data as { id?: number } | null)?.id || null,
  };
}

function buildPrompt(userResponse: string, targetBand: number, task: 'task1'|'task2', prompt?: string) {
  const taskDesc = task === 'task1' ? 'General Training Task 1 (formal letter)' : 'General Training Task 2 (opinion essay)';
  const sys = `You are an IELTS examiner and writing coach. Take the candidate's response and improve it to achieve Band ${targetBand} for ${taskDesc}. 

Key improvements to make:
- Maintain the candidate's original ideas and content structure
- Enhance vocabulary with more sophisticated and precise word choices
- Improve sentence variety and grammatical complexity
- Strengthen coherence and cohesion with better linking devices
- Ensure appropriate register and tone
- Correct any grammatical errors
- Stay within appropriate length (T1: 150–180 words, T2: 250–290 words)

The improved version should clearly demonstrate Band ${targetBand} qualities while staying true to the candidate's original intent.`;
  
  const usr = [
    prompt ? `Task Prompt:\n${prompt}` : null,
    `Candidate's Original Response:\n${userResponse}`,
    `Please provide the improved version that demonstrates Band ${targetBand} quality. Return only the improved text without explanations.`
  ].filter(Boolean).join('\n\n');
  return { system: sys, user: usr };
}

export async function POST(req: NextRequest) {
  try {
    const parsed = BodySchema.parse(await req.json());

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'AI generation not configured' }, { status: 503 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { system, user } = buildPrompt(parsed.response, parsed.band, parsed.task, parsed.prompt);

    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.4,
    });

    const sampleText = completion.choices[0]?.message?.content?.trim() || '';
    const ids = await getIds(parsed.examName, parsed.skillName, parsed.task);

    // Try to persist in scoring_examples for future reuse (if RLS allows)
    if (ids.exam_type_id && ids.skill_type_id) {
      await supabase.from('scoring_examples').insert({
        exam_type_id: ids.exam_type_id,
        skill_type_id: ids.skill_type_id,
        test_part_id: ids.test_part_id,
        score_level: parsed.band,
        example_response: sampleText,
        example_question: parsed.prompt || null,
        score_justification: `Model-generated rewrite targeting Band ${parsed.band}.`,
        strengths: [],
        weaknesses: [],
        criteria_breakdown: {},
        is_verified: false,
      } as never);
    }

    return NextResponse.json({ success: true, sample: sampleText });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request body', details: err.errors }, { status: 400 });
    }
    console.error('Sample generation error:', err);
    return NextResponse.json({ error: 'Failed to generate sample' }, { status: 500 });
  }
}

