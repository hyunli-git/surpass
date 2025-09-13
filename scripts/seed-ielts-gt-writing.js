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

async function addSampleAnswer(practice_set_id, { band, title, sample_text, tips }) {
  const { data: existing } = await supabase
    .from('skill_practice_content')
    .select('*')
    .eq('practice_set_id', practice_set_id)
    .eq('content_type', 'sample')
    .eq('metadata->>band', String(band))
    .maybeSingle();
  if (existing) return existing;
  const { data, error } = await supabase
    .from('skill_practice_content')
    .insert({
      practice_set_id,
      section_number: 99,
      title,
      content_type: 'sample',
      content_text: sample_text,
      instructions: 'Band ' + band + ' sample answer and tips',
      metadata: { band, tips, type: 'sample_answer' },
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

  await addSampleAnswer(t1.id, {
    band: 9,
    title: 'Band 9 Sample – Formal Complaint Letter',
    sample_text:
      `Dear Sir or Madam,\n\n` +
      `I am writing to express my dissatisfaction with a blender (Model SB-300) that I purchased from your Maple Avenue branch on 12 May. Although the item was advertised as suitable for daily use, it began malfunctioning within a week. The motor emits a burning smell and the machine shuts down after less than a minute of operation, even when blending soft fruit.\n\n` +
      `I contacted your customer service desk by phone on 19 May and was advised to bring the appliance to the store for inspection. I did so the following day; however, despite waiting for over thirty minutes, I was told that no technician was available and that I should return on another occasion. This has caused considerable inconvenience as I rely on the blender to prepare meals for my young child.\n\n` +
      `Under the Consumer Rights Act, I am entitled to a product that is of satisfactory quality and fit for purpose. I would therefore appreciate a full refund or an immediate replacement of equal or higher specification. Please also confirm, in writing, how you intend to prevent similar issues from affecting other customers.\n\n` +
      `I look forward to your prompt response.\n\n` +
      `Yours faithfully,\n` +
      `Alex Kim`,
    tips: [
      'Clear purpose in the opening and a decisive request in the closing',
      'Formal register with precise lexical choices (e.g., “dissatisfaction”, “malfunctioning”)',
      'Logical paragraphing: problem → prior contact → legal basis → requested resolution',
      'Accurate tone and sign-off (Yours faithfully) matching an unknown recipient',
    ],
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

  await addSampleAnswer(t2.id, {
    band: 9,
    title: 'Band 9 Sample – Transport Investment Essay',
    sample_text:
      `It is often argued that limited public funds should prioritise public transport rather than the construction of new roads. I fully agree with this view because high-capacity transit reduces congestion more sustainably and delivers broader social benefits than car‑centred infrastructure.\n\n` +
      `To begin with, mass transit moves far more people using far less space. A single metro line can carry the equivalent of several motorway lanes, yet it occupies only a fraction of the land and produces significantly fewer emissions per passenger. Cities such as Seoul and Singapore have demonstrated that sustained investment in rail and bus rapid transit leads to shorter travel times and greater economic productivity, even as populations grow. By contrast, expanding road capacity tends to induce additional demand; commuters who previously avoided driving are enticed back onto the network, and congestion soon returns.\n\n` +
      `Moreover, public transport advances equity and urban liveability. Reliable, affordable services allow students, older residents and low‑income workers to access jobs and education without the cost burden of car ownership. Streets with fewer cars can be redesigned for pedestrians and cyclists, improving air quality and public health. While road upgrades are sometimes necessary—for example, to maintain freight corridors—these projects should be selective and accompanied by pricing measures to manage demand.\n\n` +
      `In conclusion, channelling resources into public transport offers a durable solution to congestion while enhancing social inclusion and environmental outcomes. Governments should therefore prioritise high‑quality, integrated transit networks and resist the short‑term temptation to widen roads that will quickly fill again.`,
    tips: [
      'State a clear position in the introduction and sustain it throughout',
      'Use specific, policy‑level examples (e.g., induced demand, real cities)',
      'Demonstrate range and precision in vocabulary and complex grammar',
      'Conclude by synthesising arguments rather than repeating them',
    ],
  });

  console.log('[seed] Completed. Created or verified two GT writing practice sets.');
}

main().catch((e) => {
  console.error('[seed] Failed:', e);
  process.exit(1);
});
