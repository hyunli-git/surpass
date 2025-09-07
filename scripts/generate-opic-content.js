const fs = require('fs');
const path = require('path');

// OPIc (Oral Proficiency Interview - computer) Content Generator
class OpicContentGenerator {
  
  // OPIc Self-Assessment Topics (Background Survey)
  static selfAssessmentTopics = {
    'Living Situation': [
      'I live in an apartment',
      'I live in a house', 
      'I live in a dormitory',
      'I live with my family',
      'I live alone',
      'I live with roommates'
    ],
    'Work/Study': [
      'I am a student',
      'I work full-time',
      'I work part-time',
      'I am looking for a job',
      'I am retired',
      'I work from home'
    ],
    'Hobbies & Interests': [
      'Cooking and trying new recipes',
      'Playing musical instruments',
      'Photography and photo editing',
      'Reading books and magazines',
      'Watching movies and TV shows',
      'Playing sports regularly',
      'Exercising and going to the gym',
      'Traveling and exploring new places',
      'Playing video games',
      'Gardening and growing plants',
      'Shopping and fashion',
      'Arts and crafts activities'
    ],
    'Social Activities': [
      'Going to restaurants with friends',
      'Attending parties and social events',
      'Meeting friends for coffee',
      'Going to concerts and shows',
      'Participating in clubs or organizations',
      'Volunteering for community service'
    ]
  };

  // OPIc Speaking Questions by Proficiency Level
  static speakingQuestions = {
    'Novice Mid - Novice High': {
      'Personal Background': [
        "Tell me about yourself. What's your name and where are you from?",
        "Describe your family. How many people are in your family?",
        "What do you do? Are you a student or do you work?",
        "Tell me about where you live. Do you live in a house or an apartment?",
        "What languages do you speak? Which language do you speak best?"
      ],
      'Daily Routine': [
        "Describe your typical day. What time do you wake up?",
        "What do you usually eat for breakfast?",
        "How do you get to work or school?",
        "What do you do in your free time?",
        "What time do you usually go to bed?"
      ],
      'Family & Home': [
        "Tell me about your family members. What do they do?",
        "Describe your home. How many rooms does it have?",
        "What is your favorite room in your home? Why?",
        "Do you help with housework? What do you do?",
        "Do you have any pets? Tell me about them."
      ]
    },

    'Intermediate Low - Intermediate Mid': {
      'Past Experiences': [
        "Tell me about a memorable vacation you took. Where did you go and what did you do?",
        "Describe a time when you moved to a new place. How did you feel about it?",
        "Think about a special celebration or holiday from your childhood. What made it memorable?",
        "Tell me about a time when you tried something new. What was it and how did it go?",
        "Describe a memorable meal you had. Where was it and who were you with?"
      ],
      'Comparing Past and Present': [
        "How has your neighborhood changed since you were a child?",
        "Compare how you spent your free time in the past versus now.",
        "How has technology changed the way people communicate compared to 10 years ago?",
        "Think about your eating habits. How have they changed over the years?",
        "Compare your current job or studies with what you did in the past."
      ],
      'Personal Preferences': [
        "What type of movies do you prefer and why? Give me some examples.",
        "Describe your ideal vacation. Where would you go and what would you do?",
        "What kind of music do you like? How does it make you feel?",
        "Tell me about your favorite restaurant. What makes it special?",
        "What's your preferred way to exercise or stay healthy? Explain why."
      ]
    },

    'Intermediate High - Advanced Low': {
      'Problem Solving': [
        "Imagine you're planning a surprise party for a friend, but the venue cancels last minute. What would you do to solve this problem?",
        "Your coworker keeps interrupting you during meetings. How would you handle this situation diplomatically?",
        "You're traveling abroad and lose your passport. Walk me through the steps you would take to resolve this.",
        "A friend asks to borrow money, but they haven't returned money they borrowed before. How would you respond?",
        "You're assigned to work on a group project with someone who isn't contributing. What would you do?"
      ],
      'Hypothetical Situations': [
        "If you could change one thing about your city's transportation system, what would it be and why?",
        "Imagine you won a large amount of money in the lottery. What would you do with it?",
        "If you could have dinner with any three people, living or dead, who would you choose and why?",
        "Suppose your best friend was considering dropping out of school. What advice would you give them?",
        "If you could go back in time and change one decision you made, what would it be?"
      ],
      'Abstract Topics': [
        "What role does technology play in modern education? Discuss both positive and negative aspects.",
        "How important is work-life balance in today's society? Share your perspective.",
        "What are the advantages and disadvantages of social media for young people?",
        "How has globalization affected traditional cultures? Give your opinion with examples.",
        "Discuss the importance of environmental protection. What can individuals do to help?"
      ]
    },

    'Advanced Mid - Advanced High': {
      'Complex Argumentation': [
        "Some people believe that artificial intelligence will eventually replace most human jobs, while others think it will create new opportunities. What's your position on this debate?",
        "There's ongoing discussion about whether university education should be free for everyone. Present arguments for both sides and give your opinion.",
        "Climate change policies often conflict with economic interests. How do you think governments should balance environmental protection with economic growth?",
        "The rise of remote work has changed traditional office culture. Analyze the long-term implications of this shift on society and the economy.",
        "Social media platforms face criticism for their role in spreading misinformation. How should this issue be addressed while maintaining free speech?"
      ],
      'Cultural Analysis': [
        "How do cultural values influence people's approach to work and career success in different societies?",
        "Analyze how immigration has shaped the cultural landscape of modern cities. What are the benefits and challenges?",
        "Discuss the role of traditional festivals and celebrations in preserving cultural identity in a globalized world.",
        "How has the concept of family structure evolved in recent decades, and what factors have driven these changes?",
        "Examine the influence of Western culture on other parts of the world. Is this cultural exchange beneficial or problematic?"
      ],
      'Philosophical Questions': [
        "What defines a meaningful life? How do different people find purpose and fulfillment?",
        "Is it more important to focus on individual achievement or community well-being? Justify your perspective.",
        "How do you think artificial intelligence and automation will change human society in the next 20 years?",
        "What is the relationship between happiness and success? Can someone be successful without being happy?",
        "How should education systems adapt to prepare students for an rapidly changing world?"
      ]
    }
  };

  // OPIc Role-Play Scenarios
  static rolePlayScenarios = {
    'Intermediate': [
      {
        situation: "Restaurant Complaint",
        setup: "You're at a restaurant and there's a problem with your order. The server will help you.",
        rolePlay: "Your food arrived cold and it's not what you ordered. Politely explain the problem and ask for a solution.",
        followUp: "The manager offers you a discount, but you were hoping for a replacement meal. How do you respond?"
      },
      {
        situation: "Hotel Check-in Problem", 
        setup: "You've arrived at a hotel, but there's an issue with your reservation. Talk to the front desk clerk.",
        rolePlay: "Your room isn't ready, but you need to shower and change for an important meeting. Explain your situation and find a solution.",
        followUp: "The hotel is fully booked and can't provide another room. What alternatives would you suggest?"
      },
      {
        situation: "Shopping Return",
        setup: "You need to return an item to a store. The sales associate will help you.",
        rolePlay: "You bought a shirt online, but it doesn't fit properly. You want to exchange it for a different size.",
        followUp: "The shirt you want is out of stock in your size. How do you handle this situation?"
      }
    ],

    'Advanced': [
      {
        situation: "Job Interview Negotiation",
        setup: "You're in a job interview and discussing salary and benefits. The interviewer represents the company.",
        rolePlay: "The salary offer is lower than expected, and the benefits package doesn't include some things you need. Negotiate professionally.",
        followUp: "The company can't increase the salary, but they're open to other benefits. What would you propose?"
      },
      {
        situation: "Academic Conference Presentation",
        setup: "You're presenting research at an academic conference. A colleague will ask challenging questions.",
        rolePlay: "Present your research findings and handle critical questions about your methodology and conclusions.",
        followUp: "Someone challenges the validity of your data collection method. How do you defend your approach?"
      },
      {
        situation: "Community Meeting Facilitation",
        setup: "You're leading a community meeting about a local development project. Residents have concerns.",
        rolePlay: "Address residents' concerns about noise, traffic, and environmental impact while explaining project benefits.",
        followUp: "The meeting is getting heated and people are interrupting each other. How do you maintain order and progress?"
      }
    ]
  };

  // Generate OPIc Practice Sets
  static generateOpicPracticeSets() {
    const practiceSets = [];

    // Generate sets for each proficiency level
    Object.entries(this.speakingQuestions).forEach(([level, categories]) => {
      let setNumber = 1;
      
      Object.entries(categories).forEach(([category, questions]) => {
        // Create multiple practice sets per category
        const questionsPerSet = 5;
        for (let i = 0; i < questions.length; i += questionsPerSet) {
          const setQuestions = questions.slice(i, i + questionsPerSet);
          
          practiceSets.push({
            setId: `opic-${level.toLowerCase().replace(/\s+/g, '-')}-${category.toLowerCase().replace(/\s+/g, '-')}-${setNumber}`,
            title: `OPIc ${level} - ${category} Practice ${setNumber}`,
            level: level,
            category: category,
            difficulty: this.mapLevelToDifficulty(level),
            estimatedTime: 15,
            totalQuestions: setQuestions.length,
            questions: setQuestions.map((question, index) => ({
              questionNumber: index + 1,
              type: 'speaking',
              prompt: question,
              preparationTime: 30, // seconds
              responseTime: this.getResponseTime(level), // seconds
              tips: this.getQuestionTips(level, category)
            }))
          });
          
          setNumber++;
        }
      });
    });

    return practiceSets;
  }

  // Generate OPIc Mock Tests
  static generateOpicMockTests() {
    const mockTests = [];

    const levels = ['Intermediate Low', 'Intermediate Mid', 'Intermediate High', 'Advanced Low', 'Advanced Mid'];

    levels.forEach((level, index) => {
      for (let testNum = 1; testNum <= 3; testNum++) {
        const mockTest = {
          testId: `opic-mock-${level.toLowerCase().replace(/\s+/g, '-')}-${testNum}`,
          title: `OPIc Practice Test ${index * 3 + testNum} - ${level}`,
          description: `Complete OPIc simulation targeting ${level} proficiency`,
          targetLevel: level,
          difficulty: this.mapLevelToDifficulty(level),
          totalDuration: 40, // minutes
          sections: {
            selfAssessment: {
              duration: 5,
              description: "Complete background survey about yourself",
              topics: Object.keys(this.selfAssessmentTopics)
            },
            warmUp: {
              duration: 5,
              questions: this.getWarmUpQuestions()
            },
            mainQuestions: {
              duration: 25,
              questions: this.selectQuestionsForLevel(level, 8)
            },
            rolePlay: {
              duration: 5,
              scenarios: this.selectRolePlayForLevel(level, 1)
            }
          }
        };

        mockTests.push(mockTest);
      }
    });

    return mockTests;
  }

  // Helper methods
  static mapLevelToDifficulty(level) {
    if (level.includes('Novice')) return 'beginner';
    if (level.includes('Intermediate')) return 'intermediate';
    return 'advanced';
  }

  static getResponseTime(level) {
    if (level.includes('Novice')) return 60; // 1 minute
    if (level.includes('Intermediate')) return 90; // 1.5 minutes
    return 120; // 2 minutes
  }

  static getQuestionTips(level, category) {
    const tips = {
      'beginner': [
        "Use simple, clear sentences",
        "Take your time to think before speaking",
        "It's okay to make small mistakes",
        "Focus on communicating your main idea"
      ],
      'intermediate': [
        "Provide specific examples and details",
        "Use connecting words (because, however, although)",
        "Express your opinions clearly",
        "Compare past and present experiences"
      ],
      'advanced': [
        "Develop complex arguments with supporting evidence",
        "Use sophisticated vocabulary and structures", 
        "Address multiple perspectives on the topic",
        "Make abstract connections between ideas"
      ]
    };

    return tips[this.mapLevelToDifficulty(level)] || tips['intermediate'];
  }

  static getWarmUpQuestions() {
    return [
      "Please state your name and spell it for me.",
      "Tell me what you do for work or study.",
      "Describe the place where you live."
    ];
  }

  static selectQuestionsForLevel(level, count) {
    const questionsForLevel = this.speakingQuestions[level];
    if (!questionsForLevel) return [];

    const allQuestions = Object.values(questionsForLevel).flat();
    return allQuestions.slice(0, count);
  }

  static selectRolePlayForLevel(level, count) {
    const difficulty = this.mapLevelToDifficulty(level);
    const scenarios = this.rolePlayScenarios[difficulty === 'beginner' ? 'Intermediate' : 'Advanced'];
    return scenarios.slice(0, count);
  }

  // Main generation function
  static generateAllOpicContent() {
    console.log('🎙️ Generating OPIc Content...');

    const practiceSets = this.generateOpicPracticeSets();
    const mockTests = this.generateOpicMockTests();

    const opicContent = {
      testType: 'OPIc',
      description: 'Oral Proficiency Interview - computer',
      language: 'English',
      duration: '40 minutes',
      format: 'Computer-based speaking test',
      practiceSets: practiceSets,
      mockTests: mockTests,
      selfAssessmentTopics: this.selfAssessmentTopics,
      rolePlayScenarios: this.rolePlayScenarios
    };

    return opicContent;
  }

  static saveOpicContent() {
    const opicContent = this.generateAllOpicContent();
    
    const outputDir = path.join(__dirname, '../generated-content');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save complete OPIc content
    fs.writeFileSync(
      path.join(outputDir, 'opic-complete.json'),
      JSON.stringify(opicContent, null, 2)
    );

    // Save practice sets separately
    fs.writeFileSync(
      path.join(outputDir, 'opic-practice-sets.json'),
      JSON.stringify(opicContent.practiceSets, null, 2)
    );

    // Save mock tests separately  
    fs.writeFileSync(
      path.join(outputDir, 'opic-mock-tests.json'),
      JSON.stringify(opicContent.mockTests, null, 2)
    );

    console.log('✅ OPIc content saved successfully!');
    return opicContent;
  }
}

// Generate OPIc content
console.log('🚀 OPIc Content Generator Starting...');
console.log('');

const opicContent = OpicContentGenerator.saveOpicContent();

console.log('📊 OPIc Content Generated:');
console.log(`🎙️ Practice Sets: ${opicContent.practiceSets.length}`);
console.log(`🎯 Mock Tests: ${opicContent.mockTests.length}`);
console.log('');
console.log('📈 Proficiency Levels Covered:');
console.log('  • Novice Mid - Novice High');
console.log('  • Intermediate Low - Intermediate Mid');  
console.log('  • Intermediate High - Advanced Low');
console.log('  • Advanced Mid - Advanced High');
console.log('');
console.log('🎭 Question Types:');
console.log('  • Personal Background & Daily Routine');
console.log('  • Past Experiences & Comparisons');
console.log('  • Problem Solving & Hypotheticals');
console.log('  • Complex Argumentation & Cultural Analysis');
console.log('  • Role-Play Scenarios');
console.log('');
console.log('⏱️ Authentic Timing:');
console.log('  • 30 seconds preparation time');
console.log('  • 60-120 seconds response time (varies by level)');
console.log('  • 40 minutes total test duration');
console.log('');
console.log('📁 Files saved to: ./generated-content/');

module.exports = OpicContentGenerator;