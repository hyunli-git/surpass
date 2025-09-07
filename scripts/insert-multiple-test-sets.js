const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class MultipleTestSetsSeeder {
  
  static async checkDatabaseSchema() {
    try {
      const { data, error } = await supabase
        .from('test_types')
        .select('id')
        .limit(1);
        
      if (error && error.code === '42P01') {
        console.log('❌ Database schema not found');
        console.log('');
        console.log('Please execute the database schema first:');
        console.log('1. Go to: https://supabase.com/dashboard/project/zszhcmcskltkzfapwsek/sql');
        console.log('2. Copy and paste: database/schema/test_system.sql');
        console.log('3. Execute the SQL to create all tables');
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
    
    const testTypes = [
      { code: 'IELTS', name: 'International English Language Testing System', language: 'en', duration_minutes: 165 },
      { code: 'TEF', name: "Test d'évaluation de français", language: 'fr', duration_minutes: 150 }
    ];

    for (const testType of testTypes) {
      await supabase.from('test_types').upsert(testType, { onConflict: 'code' });
    }

    const skills = [
      { name: 'Reading', code: 'reading', icon: '📖' },
      { name: 'Writing', code: 'writing', icon: '✍️' },
      { name: 'Listening', code: 'listening', icon: '🎧' },
      { name: 'Speaking', code: 'speaking', icon: '🗣️' }
    ];

    for (const skill of skills) {
      await supabase.from('skills').upsert(skill, { onConflict: 'code' });
    }

    console.log('✅ Basic data inserted');
  }

  static async insertReadingSets(testType, readingSets) {
    console.log(`📖 Inserting ${testType.toUpperCase()} reading sets...`);
    
    const { data: testTypeData } = await supabase
      .from('test_types')
      .select('id')
      .eq('code', testType.toUpperCase())
      .single();
      
    const { data: skillData } = await supabase
      .from('skills')
      .select('id')
      .eq('code', 'reading')
      .single();

    let insertedCount = 0;

    for (const set of readingSets) {
      try {
        // Create practice set
        const { data: practiceSet } = await supabase
          .from('skill_practice_sets')
          .insert({
            test_type_id: testTypeData.id,
            skill_id: skillData.id,
            title: set.title,
            description: `${set.topic} - ${set.passage.title}`,
            difficulty: set.difficulty,
            estimated_duration: set.estimatedTime,
            topics: [set.topic, set.passage.title.split(':')[0]?.trim()].filter(Boolean),
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
            title: set.passage.title,
            content_type: 'text',
            content_text: set.passage.content,
            instructions: testType === 'ielts' ? 
              'You should spend about 20 minutes on this passage.' :
              'Lisez le texte et répondez aux questions.',
            word_count: set.passage.content.split(' ').length
          })
          .select()
          .single();

        // Insert questions
        for (let i = 0; i < set.passage.questions.length; i++) {
          const question = set.passage.questions[i];
          
          await supabase
            .from('skill_practice_questions')
            .insert({
              content_id: content.id,
              question_number: i + 1,
              question_type: question.type,
              question_text: question.text,
              options: question.options ? JSON.stringify(question.options) : null,
              correct_answer: question.correct,
              explanation: `Correct answer: ${question.correct}`,
              points: 1
            });
        }

        insertedCount++;
        console.log(`  ✓ ${set.title} (${set.difficulty})`);
        
      } catch (error) {
        console.warn(`  ⚠️ Error inserting ${set.title}:`, error.message);
      }
    }

    console.log(`✅ Inserted ${insertedCount}/${readingSets.length} reading sets`);
  }

  static async insertWritingSets(testType, writingSets) {
    console.log(`✍️  Inserting ${testType.toUpperCase()} writing sets...`);
    
    const { data: testTypeData } = await supabase
      .from('test_types')
      .select('id')
      .eq('code', testType.toUpperCase())
      .single();
      
    const { data: skillData } = await supabase
      .from('skills')
      .select('id')
      .eq('code', 'writing')
      .single();

    let insertedCount = 0;

    for (const set of writingSets) {
      try {
        // Create practice set
        const { data: practiceSet } = await supabase
          .from('skill_practice_sets')
          .insert({
            test_type_id: testTypeData.id,
            skill_id: skillData.id,
            title: set.title,
            description: `Writing practice: ${set.topic}`,
            difficulty: set.difficulty,
            estimated_duration: set.estimatedTime,
            topics: [set.topic, 'Writing', 'Essay'],
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
            title: `${set.topic} Writing Task`,
            content_type: 'prompt',
            content_text: set.prompt,
            instructions: testType === 'ielts' ? 
              'Write at least 250 words. Spend about 40 minutes on this task.' :
              'Rédigez entre 200 et 250 mots. Temps alloué : 30 minutes.'
          });

        insertedCount++;
        console.log(`  ✓ ${set.title} (${set.difficulty})`);
        
      } catch (error) {
        console.warn(`  ⚠️ Error inserting ${set.title}:`, error.message);
      }
    }

    console.log(`✅ Inserted ${insertedCount}/${writingSets.length} writing sets`);
  }

  static async insertMockTests(testType, mockTests) {
    console.log(`🎯 Inserting ${testType.toUpperCase()} mock tests...`);
    
    const { data: testTypeData } = await supabase
      .from('test_types')
      .select('id')
      .eq('code', testType.toUpperCase())
      .single();

    let insertedCount = 0;

    for (const mockTest of mockTests) {
      try {
        // Create mock test
        const { data: test } = await supabase
          .from('mock_tests')
          .insert({
            test_type_id: testTypeData.id,
            version: `Version ${insertedCount + 1}`,
            title: mockTest.title,
            description: mockTest.description,
            total_duration: mockTest.totalDuration,
            total_questions: testType === 'ielts' ? 40 : 35,
            difficulty: mockTest.difficulty,
            is_official: false,
            is_active: true
          })
          .select()
          .single();

        // Create sections based on test type
        const sectionsToCreate = testType === 'ielts' 
          ? ['listening', 'reading', 'writing', 'speaking']
          : ['reading', 'writing', 'listening', 'speaking'];

        for (let i = 0; i < sectionsToCreate.length; i++) {
          const skillCode = sectionsToCreate[i];
          
          const { data: skill } = await supabase
            .from('skills')
            .select('id')
            .eq('code', skillCode)
            .single();

          const sectionData = mockTest.sections[skillCode] || mockTest.sections[this.getSkillKey(skillCode, testType)];
          
          await supabase
            .from('mock_test_sections')
            .insert({
              mock_test_id: test.id,
              skill_id: skill.id,
              section_number: i + 1,
              title: `${skill.name || skillCode} Section`,
              instructions: `Complete all ${skillCode} tasks within the allocated time.`,
              duration: sectionData?.duration || (skillCode === 'reading' ? 60 : 30),
              total_questions: this.getQuestionCount(skillCode, testType)
            });
        }

        insertedCount++;
        console.log(`  ✓ ${mockTest.title} (${mockTest.difficulty})`);
        
      } catch (error) {
        console.warn(`  ⚠️ Error inserting ${mockTest.title}:`, error.message);
      }
    }

    console.log(`✅ Inserted ${insertedCount}/${mockTests.length} mock tests`);
  }

  static getSkillKey(skillCode, testType) {
    const mapping = {
      'ielts': {
        'reading': 'reading',
        'writing': 'writing', 
        'listening': 'listening',
        'speaking': 'speaking'
      },
      'tef': {
        'reading': 'comprehensionEcrite',
        'writing': 'expressionEcrite',
        'listening': 'comprehensionOrale', 
        'speaking': 'expressionOrale'
      }
    };
    
    return mapping[testType]?.[skillCode] || skillCode;
  }

  static getQuestionCount(skillCode, testType) {
    const counts = {
      'ielts': { 'listening': 40, 'reading': 40, 'writing': 2, 'speaking': 3 },
      'tef': { 'reading': 15, 'writing': 2, 'listening': 20, 'speaking': 2 }
    };
    
    return counts[testType]?.[skillCode] || 10;
  }

  static async insertAllTestSets() {
    try {
      // Load all generated content
      const contentPath = path.join(__dirname, '../generated-content/all-test-sets.json');
      const allContent = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
      
      console.log('📚 Starting insertion of all test sets...');
      console.log('');

      // Insert IELTS content
      await this.insertReadingSets('ielts', allContent.ielts.reading);
      await this.insertWritingSets('ielts', allContent.ielts.writing);
      await this.insertMockTests('ielts', allContent.ielts.mockTests);
      
      console.log('');
      
      // Insert TEF content  
      await this.insertReadingSets('tef', allContent.tef.reading);
      await this.insertWritingSets('tef', allContent.tef.writing);
      await this.insertMockTests('tef', allContent.tef.mockTests);

      console.log('');
      console.log('🎉 All test sets inserted successfully!');
      
    } catch (error) {
      console.error('❌ Error inserting test sets:', error);
    }
  }

  static async run() {
    console.log('🚀 Multiple Test Sets Database Seeder');
    console.log('====================================');
    console.log('');
    
    // Check schema
    const schemaExists = await this.checkDatabaseSchema();
    if (!schemaExists) return;
    
    // Insert basic data
    await this.insertBasicData();
    console.log('');
    
    // Insert all test sets
    await this.insertAllTestSets();
    
    console.log('');
    console.log('🎯 Database now contains:');
    console.log('  📖 IELTS Reading: 5 different sets (3 topics, multiple difficulty levels)');
    console.log('  ✍️  IELTS Writing: 7 different prompts (Technology, Environment, Education)');
    console.log('  🎯 IELTS Mock Tests: 5 complete practice tests');
    console.log('  📖 TEF Reading: 2 different sets (French content)');
    console.log('  ✍️  TEF Writing: 4 different prompts (French argumentation)');
    console.log('  🎯 TEF Mock Tests: 5 complete practice tests');
    console.log('');
    console.log('✨ Users now have access to:');
    console.log('  🎓 Multiple difficulty levels (Beginner → Advanced)');
    console.log('  🌍 Diverse topics (Technology, Environment, Society)');
    console.log('  ⏱️  Various practice durations (15-60 minutes)');
    console.log('  🔄 Enough content for extensive practice');
    console.log('');
    console.log('🔗 Your app will dynamically load this content from the database!');
  }
}

// Run the seeder
MultipleTestSetsSeeder.run();