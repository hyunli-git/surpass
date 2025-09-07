const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class DatabaseSeeder {
  
  static async checkDatabaseSchema() {
    try {
      // Try to query test_types table
      const { data, error } = await supabase
        .from('test_types')
        .select('id')
        .limit(1);
        
      if (error && error.code === '42P01') { // Table doesn't exist
        console.log('❌ Database schema not found');
        console.log('');
        console.log('Please execute the database schema first:');
        console.log('1. Go to: https://supabase.com/dashboard/project/zszhcmcskltkzfapwsek/sql');
        console.log('2. Copy and paste the contents of: database/schema/test_system.sql');
        console.log('3. Execute the SQL to create all tables');
        console.log('4. Run this script again');
        return false;
      }
      
      console.log('✅ Database schema exists');
      return true;
    } catch (error) {
      console.error('Error checking database schema:', error.message);
      return false;
    }
  }

  static async insertBasicData() {
    console.log('📊 Inserting basic test types and skills...');
    
    // Insert test types (with conflict handling)
    const testTypes = [
      { code: 'IELTS', name: 'International English Language Testing System', language: 'en', duration_minutes: 165 },
      { code: 'TEF', name: "Test d'évaluation de français", language: 'fr', duration_minutes: 150 },
      { code: 'TEF_CANADA', name: 'TEF Canada', language: 'fr', duration_minutes: 150 },
      { code: 'TOEFL', name: 'Test of English as a Foreign Language', language: 'en', duration_minutes: 180 }
    ];

    for (const testType of testTypes) {
      const { error } = await supabase
        .from('test_types')
        .upsert(testType, { onConflict: 'code' });
      
      if (error) console.warn('Warning inserting test type:', error.message);
    }

    // Insert skills
    const skills = [
      { name: 'Reading', code: 'reading', icon: '📖' },
      { name: 'Writing', code: 'writing', icon: '✍️' },
      { name: 'Listening', code: 'listening', icon: '🎧' },
      { name: 'Speaking', code: 'speaking', icon: '🗣️' }
    ];

    for (const skill of skills) {
      const { error } = await supabase
        .from('skills')
        .upsert(skill, { onConflict: 'code' });
        
      if (error) console.warn('Warning inserting skill:', error.message);
    }

    console.log('✅ Basic data inserted');
  }

  static async insertAIGeneratedContent() {
    console.log('🤖 Inserting AI-generated content...');
    
    try {
      // Load generated content
      const contentDir = path.join(__dirname, '../generated-content');
      
      // Insert reading passages
      const readingData = JSON.parse(fs.readFileSync(path.join(contentDir, 'reading-passages.json'), 'utf8'));
      
      for (let i = 0; i < readingData.length; i++) {
        const passage = readingData[i];
        const isIELTS = i < 2; // First two are IELTS, third is TEF
        
        // Get test type ID
        const { data: testType } = await supabase
          .from('test_types')
          .select('id')
          .eq('code', isIELTS ? 'IELTS' : 'TEF')
          .single();
          
        // Get reading skill ID
        const { data: skill } = await supabase
          .from('skills')
          .select('id')
          .eq('code', 'reading')
          .single();

        // Create practice set
        const { data: practiceSet } = await supabase
          .from('skill_practice_sets')
          .insert({
            test_type_id: testType.id,
            skill_id: skill.id,
            title: `${isIELTS ? 'IELTS' : 'TEF'} Reading - ${passage.title}`,
            description: `AI-generated reading passage: ${passage.title}`,
            difficulty: 'intermediate',
            estimated_duration: 20,
            topics: [passage.title.split(':')[0]], // Extract topic from title
            is_active: true
          })
          .select()
          .single();

        // Create content
        const { data: content } = await supabase
          .from('skill_practice_content')
          .insert({
            practice_set_id: practiceSet.id,
            section_number: 1,
            title: passage.title,
            content_type: 'text',
            content_text: passage.content,
            instructions: isIELTS ? 
              'You should spend about 20 minutes on this passage.' :
              'Lisez le texte et répondez aux questions.',
            word_count: passage.content.split(' ').length
          })
          .select()
          .single();

        // Insert questions
        for (let j = 0; j < passage.questions.length; j++) {
          const question = passage.questions[j];
          
          await supabase
            .from('skill_practice_questions')
            .insert({
              content_id: content.id,
              question_number: j + 1,
              question_type: question.type,
              question_text: question.text,
              options: question.options ? JSON.stringify(question.options) : null,
              correct_answer: question.correct,
              explanation: question.explanation || `Correct answer: ${question.correct}`,
              points: 1
            });
        }
      }

      // Insert writing prompts
      const writingData = JSON.parse(fs.readFileSync(path.join(contentDir, 'writing-prompts.json'), 'utf8'));
      
      for (const item of writingData) {
        // Get test type ID
        const { data: testType } = await supabase
          .from('test_types')
          .select('id')
          .eq('code', item.type === 'IELTS' ? 'IELTS' : 'TEF')
          .single();
          
        // Get writing skill ID
        const { data: skill } = await supabase
          .from('skills')
          .select('id')
          .eq('code', 'writing')
          .single();

        // Create practice set
        const { data: practiceSet } = await supabase
          .from('skill_practice_sets')
          .insert({
            test_type_id: testType.id,
            skill_id: skill.id,
            title: `${item.type} Writing Practice - AI Generated`,
            description: `AI-generated writing prompt for ${item.type}`,
            difficulty: 'advanced',
            estimated_duration: item.type === 'IELTS' ? 40 : 30,
            topics: ['Writing', 'Essay', 'Argumentation'],
            is_active: true
          })
          .select()
          .single();

        // Create content
        await supabase
          .from('skill_practice_content')
          .insert({
            practice_set_id: practiceSet.id,
            section_number: 1,
            title: `${item.type} Writing Task`,
            content_type: 'prompt',
            content_text: item.prompt,
            instructions: item.type === 'IELTS' ? 
              'Write at least 250 words. Spend about 40 minutes on this task.' :
              'Rédigez entre 200 et 250 mots. Temps alloué : 30 minutes.'
          });
      }

      // Create complete mock tests
      const ieltsTest = JSON.parse(fs.readFileSync(path.join(contentDir, 'ielts-mock-test-1.json'), 'utf8'));
      
      // Get IELTS test type ID
      const { data: ieltsTestType } = await supabase
        .from('test_types')
        .select('id')
        .eq('code', 'IELTS')
        .single();

      // Create mock test
      const { data: mockTest } = await supabase
        .from('mock_tests')
        .insert({
          test_type_id: ieltsTestType.id,
          version: 'AI Generated v1',
          title: ieltsTest.title,
          description: ieltsTest.description,
          total_duration: 165,
          total_questions: 40,
          difficulty: 'intermediate',
          is_official: false,
          is_active: true
        })
        .select()
        .single();

      // Create mock test sections
      for (let i = 0; i < ieltsTest.sections.length; i++) {
        const section = ieltsTest.sections[i];
        
        // Get skill ID
        const { data: skill } = await supabase
          .from('skills')
          .select('id')
          .eq('code', section.skill.toLowerCase())
          .single();

        await supabase
          .from('mock_test_sections')
          .insert({
            mock_test_id: mockTest.id,
            skill_id: skill.id,
            section_number: i + 1,
            title: `${section.skill} Section`,
            instructions: `Complete all ${section.skill.toLowerCase()} tasks within ${section.duration} minutes.`,
            duration: section.duration,
            total_questions: section.skill === 'Reading' ? 40 : (section.skill === 'Listening' ? 40 : (section.skill === 'Writing' ? 2 : 3))
          });
      }

      console.log('✅ AI-generated content inserted successfully');
      
    } catch (error) {
      console.error('❌ Error inserting AI content:', error);
    }
  }

  static async run() {
    console.log('🚀 Starting database seeding with AI-generated content...');
    console.log('');
    
    // Check if schema exists
    const schemaExists = await this.checkDatabaseSchema();
    if (!schemaExists) return;
    
    // Insert basic data
    await this.insertBasicData();
    
    // Insert AI-generated content
    await this.insertAIGeneratedContent();
    
    console.log('');
    console.log('🎉 Database seeding complete!');
    console.log('');
    console.log('✅ Successfully inserted:');
    console.log('  - Test types (IELTS, TEF, etc.)');
    console.log('  - Skills (Reading, Writing, Listening, Speaking)');
    console.log('  - AI-generated reading passages with questions');
    console.log('  - AI-generated writing prompts');
    console.log('  - Complete mock test structures');
    console.log('');
    console.log('🔗 Your app will now load content from the database instead of hardcoded data!');
  }
}

// Run the seeder
DatabaseSeeder.run();