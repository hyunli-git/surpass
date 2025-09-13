/**
 * Seed IELTS General Training Writing practice sets into the database.
 * - Creates/ensures `IELTS` test type and `writing` skill
 * - Adds two practice sets (Task 1 letter, Task 2 essay)
 * - Adds prompt/instructions content for each set
 *
 * Usage:
 *   1) Add to surpass/.env.local
 *        NEXT_PUBLIC_SUPABASE_URL=... (your project URL)
 *        SUPABASE_SERVICE_ROLE_KEY=... (service role key)
 *   2) From surpass/: node scripts/seed-ielts-gt-writing.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('[seed] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function ensureTestType(code, name, language) {
  const { data: existing } = await supabase.from('test_types').select('*').eq('code', code).maybeSingle();
  if (existing) return existing;
  const { data, error } = await supabase
    .from('test_types')
    .insert({ code, name, language, description: 'International English Language Testing System' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function ensureSkill(code, name, icon) {
  const { data: existing } = await supabase.from('skills').select('*').eq('code', code).maybeSingle();
  if (existing) return existing;
  const { data, error } = await supabase
    .from('skills')
    .insert({ code, name, icon })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function upsertPracticeSet({ test_type_id, skill_id, title, description, difficulty, estimated_duration, topics }) {
  const { data: existing } = await supabase
    .from('skill_practice_sets')
    .select('*')
    .eq('test_type_id', test_type_id)
    .eq('skill_id', skill_id)
    .eq('title', title)
    .maybeSingle();
  if (existing) return existing;
  const { data, error } = await supabase
    .from('skill_practice_sets')
    .insert({ test_type_id, skill_id, title, description, difficulty, estimated_duration, topics, is_active: true })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function addPromptContent(practice_set_id, { title, instructions, content_text, section_number = 1 }) {
  const { data: existing } = await supabase
    .from('skill_practice_content')
    .select('*')
    .eq('practice_set_id', practice_set_id)
    .eq('section_number', section_number)
    .maybeSingle();
  if (existing) return existing;
  const { data, error } = await supabase
    .from('skill_practice_content')
    .insert({
      practice_set_id,
      section_number,
      title,
      content_type: 'prompt',
      content_text,
      instructions,
      word_count: null,
      metadata: { source: 'seed:ielts-gt-writing' },
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function main() {
  console.log('[seed] Seeding IELTS GT Writing practice…');
  const testType = await ensureTestType('IELTS', 'IELTS', 'en');
  const skill = await ensureSkill('writing', 'Writing', '✍️');

  // Task 1 – Letter
  const t1 = await upsertPracticeSet({
    test_type_id: testType.id,
    skill_id: skill.id,
    title: 'GT Writing Task 1 – Customer Complaint Letter',
    description: 'Write a formal complaint letter to a store manager about a faulty appliance.',
    difficulty: 'intermediate',
    estimated_duration: 20,
    topics: ['Customer Service', 'Everyday Life', 'Formal Letter'],
  });
  await addPromptContent(t1.id, {
    title: 'Task 1 Prompt',
    instructions: 'Write at least 150 words. Use an appropriate formal tone and structure (greeting, purpose, details, request, closing).',
    content_text:
      'You recently bought a kitchen appliance but it does not work properly. Write a letter to the shop manager. In your letter: \n' +
      '• describe the problem with the appliance\n' +
      '• explain what happened when you contacted the shop\n' +
      '• state what you would like the manager to do',
  });

  // Task 2 – Essay
  const t2 = await upsertPracticeSet({
    test_type_id: testType.id,
    skill_id: skill.id,
    title: 'GT Writing Task 2 – Public Transport vs Roads',
    description: 'Opinion essay about government investment priorities for transport infrastructure.',
    difficulty: 'intermediate',
    estimated_duration: 40,
    topics: ['Government', 'Transport', 'Society'],
  });
  await addPromptContent(t2.id, {
    title: 'Task 2 Prompt',
    instructions: 'Write at least 250 words. Present a clear position, support with reasons and examples, and conclude effectively.',
    content_text:
      'Some people think governments should invest more in public transport than building new roads. To what extent do you agree or disagree? Give reasons for your answer and include relevant examples from your own knowledge or experience.',
  });

  console.log('[seed] Completed. Created or verified two GT writing practice sets.');
}

main().catch((e) => {
  console.error('[seed] Failed:', e);
  process.exit(1);
});

