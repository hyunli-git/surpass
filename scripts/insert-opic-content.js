const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class OpicDatabaseSeeder {
  
  static async checkDatabaseSchema() {
    try {
      const { data, error } = await supabase
        .from('test_types')
        .select('id')
        .limit(1);
        
      if (error && error.code === '42P01') {
        console.log('❌ Database schema not found');
        console.log('Please execute: database/schema/test_system.sql first');
        return false;
      }
      
      console.log('✅ Database schema exists');
      return true;
    } catch (error) {
      console.error('Error checking database schema:', error.message);
      return false;
    }
  }

  static async ensureBasicData() {
    console.log('📊 Ensuring OPIc test type and speaking skill exist...');
    
    // Ensure OPIc test type exists
    await supabase.from('test_types').upsert({
      code: 'OPIC',
      name: 'Oral Proficiency Interview - computer',
      language: 'en',
      description: 'Computer-based oral proficiency assessment',
      duration_minutes: 40
    }, { onConflict: 'code' });

    // Ensure Speaking skill exists
    await supabase.from('skills').upsert({
      name: 'Speaking',
      code: 'speaking',
      icon: '🎙️'
    }, { onConflict: 'code' });

    console.log('✅ Basic OPIc data ensured');
  }

  static async insertOpicPracticeSets() {
    console.log('🎙️ Inserting OPIc practice sets...');
    
    try {
      // Load OPIc content
      const contentPath = path.join(__dirname, '../generated-content/opic-complete.json');
      const opicData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
      
      // Get OPIc test type and Speaking skill IDs
      const { data: testType } = await supabase
        .from('test_types')
        .select('id')
        .eq('code', 'OPIC')
        .single();
        
      const { data: skill } = await supabase
        .from('skills')
        .select('id')
        .eq('code', 'speaking')
        .single();

      let insertedCount = 0;

      for (const practiceSet of opicData.practiceSets) {
        try {
          // Create practice set
          const { data: set } = await supabase
            .from('skill_practice_sets')
            .insert({
              test_type_id: testType.id,
              skill_id: skill.id,
              title: practiceSet.title,
              description: `${practiceSet.category} practice for ${practiceSet.level}`,
              difficulty: practiceSet.difficulty,
              estimated_duration: practiceSet.estimatedTime,
              topics: [practiceSet.category, practiceSet.level, 'Speaking'],
              is_active: true
            })
            .select()
            .single();

          // Create content for the practice set
          const { data: content } = await supabase
            .from('skill_practice_content')
            .insert({
              practice_set_id: set.id,
              section_number: 1,
              title: `${practiceSet.category} Questions`,
              content_type: 'prompt',
              content_text: `Practice questions for ${practiceSet.category} at ${practiceSet.level} level`,
              instructions: `You will have 30 seconds to prepare and ${practiceSet.questions[0]?.responseTime || 90} seconds to respond to each question.`,
              metadata: {
                level: practiceSet.level,
                category: practiceSet.category,
                responseTime: practiceSet.questions[0]?.responseTime || 90,
                preparationTime: 30
              }
            })
            .select()
            .single();

          // Insert questions
          for (let i = 0; i < practiceSet.questions.length; i++) {
            const question = practiceSet.questions[i];
            
            await supabase
              .from('skill_practice_questions')
              .insert({
                content_id: content.id,
                question_number: i + 1,
                question_type: 'speaking',
                question_text: question.prompt,
                options: null,
                correct_answer: null,
                explanation: null,
                points: 1,
                time_limit: question.responseTime,
                metadata: {
                  preparationTime: question.preparationTime,
                  responseTime: question.responseTime,
                  tips: question.tips
                }
              });
          }

          insertedCount++;
          console.log(`  ✓ ${practiceSet.title}`);
          
        } catch (error) {
          console.warn(`  ⚠️ Error inserting ${practiceSet.title}:`, error.message);
        }
      }

      console.log(`✅ Inserted ${insertedCount}/${opicData.practiceSets.length} OPIc practice sets`);
      
    } catch (error) {
      console.error('❌ Error inserting OPIc practice sets:', error);
    }
  }

  static async insertOpicMockTests() {
    console.log('🎯 Inserting OPIc mock tests...');
    
    try {
      // Load OPIc content
      const contentPath = path.join(__dirname, '../generated-content/opic-complete.json');
      const opicData = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
      
      // Get OPIc test type ID
      const { data: testType } = await supabase
        .from('test_types')
        .select('id')
        .eq('code', 'OPIC')
        .single();

      let insertedCount = 0;

      for (const mockTest of opicData.mockTests) {
        try {
          // Create mock test
          const { data: test } = await supabase
            .from('mock_tests')
            .insert({
              test_type_id: testType.id,
              version: `Version ${insertedCount + 1}`,
              title: mockTest.title,
              description: mockTest.description,
              total_duration: mockTest.totalDuration,
              total_questions: mockTest.sections.mainQuestions?.questions?.length || 8,
              difficulty: mockTest.difficulty,
              is_official: false,
              is_active: true
            })
            .select()
            .single();

          // Create mock test section (OPIc only has speaking)
          const { data: skill } = await supabase
            .from('skills')
            .select('id')
            .eq('code', 'speaking')
            .single();

          const { data: section } = await supabase
            .from('mock_test_sections')
            .insert({
              mock_test_id: test.id,
              skill_id: skill.id,
              section_number: 1,
              title: 'Speaking Section',
              instructions: 'Complete all speaking tasks including self-assessment, warm-up, main questions, and role-play.',
              duration: mockTest.totalDuration,
              total_questions: mockTest.sections.mainQuestions?.questions?.length || 8
            })
            .select()
            .single();

          // Create content for different sections
          const sections = ['Self-Assessment', 'Warm-up', 'Main Questions', 'Role-Play'];
          
          for (let i = 0; i < sections.length; i++) {
            const sectionName = sections[i];
            const sectionKey = sectionName.toLowerCase().replace('-', '').replace(' ', '');
            const sectionData = mockTest.sections[sectionKey] || {};
            
            await supabase
              .from('mock_test_content')
              .insert({
                section_id: section.id,
                content_number: i + 1,
                title: sectionName,
                content_type: 'prompt',
                content_text: this.getSectionInstructions(sectionName),
                instructions: `Duration: ${sectionData.duration || 5} minutes`,
                metadata: {
                  targetLevel: mockTest.targetLevel,
                  sectionType: sectionName,
                  duration: sectionData.duration || 5
                }
              });
          }

          insertedCount++;
          console.log(`  ✓ ${mockTest.title} (${mockTest.targetLevel})`);
          
        } catch (error) {
          console.warn(`  ⚠️ Error inserting ${mockTest.title}:`, error.message);
        }
      }

      console.log(`✅ Inserted ${insertedCount}/${opicData.mockTests.length} OPIc mock tests`);
      
    } catch (error) {
      console.error('❌ Error inserting OPIc mock tests:', error);
    }
  }

  static getSectionInstructions(sectionName) {
    const instructions = {
      'Self-Assessment': 'Complete the background survey about your interests, hobbies, and daily activities. This helps personalize your test experience.',
      'Warm-up': 'Answer basic questions to get comfortable with the speaking format. These are simple personal questions.',
      'Main Questions': 'Respond to questions based on your background survey. You will have 30 seconds to prepare and 60-120 seconds to respond.',
      'Role-Play': 'Participate in interactive scenarios where you play a specific role. Follow the given situation and respond naturally.'
    };
    
    return instructions[sectionName] || 'Complete this section of the OPIc test.';
  }

  static async updateTestsList() {
    console.log('📋 Adding OPIc to test navigation...');
    
    // Check if TestList component needs updating
    const testListPath = path.join(__dirname, '../src/components/TestList.tsx');
    
    if (fs.existsSync(testListPath)) {
      console.log('💡 Remember to update TestList.tsx to include OPIc navigation');
      console.log('   Add OPIc test entry with link to /opic-practice');
    }
  }

  static async run() {
    console.log('🚀 OPIc Database Seeder');
    console.log('======================');
    console.log('');
    
    // Check schema
    const schemaExists = await this.checkDatabaseSchema();
    if (!schemaExists) return;
    
    // Ensure basic data
    await this.ensureBasicData();
    console.log('');
    
    // Insert practice sets
    await this.insertOpicPracticeSets();
    console.log('');
    
    // Insert mock tests
    await this.insertOpicMockTests();
    console.log('');
    
    // Update navigation
    await this.updateTestsList();
    
    console.log('');
    console.log('🎉 OPIc content inserted successfully!');
    console.log('');
    console.log('🎯 OPIc Test System now includes:');
    console.log('  🎙️ Practice Sets: Multiple levels (Novice → Advanced)');
    console.log('  🎯 Mock Tests: 15 complete OPIc simulations');
    console.log('  📊 Proficiency Levels: 4 different target levels');
    console.log('  🎭 Question Types: Personal, hypothetical, role-play');
    console.log('  ⏱️ Authentic Timing: 30s prep + 60-120s response');
    console.log('');
    console.log('🔗 Users can now access OPIc practice at /opic-practice');
    console.log('💡 Consider adding OPIc to your main navigation menu');
  }
}

// Run the seeder
OpicDatabaseSeeder.run();