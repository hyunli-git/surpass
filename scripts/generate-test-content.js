const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// AI-generated IELTS Academic Reading Passage 1
const ieltsReading1 = {
  title: "The Evolution of Urban Transportation",
  content: `The transformation of urban transportation systems has been one of the most significant developments in modern city planning. From horse-drawn carriages to electric vehicles, the evolution of how people move within cities reflects broader technological, environmental, and social changes.

In the early 19th century, most urban transport relied on walking or horse-drawn vehicles. The introduction of omnibuses in the 1820s marked the first attempt at organized public transport. These horse-drawn coaches followed fixed routes and schedules, laying the groundwork for modern public transit systems. However, the limitations were considerable: horses required extensive care, produced significant waste, and could only travel at modest speeds.

The railway revolution of the mid-1800s transformed long-distance travel, and it wasn't long before entrepreneurs recognized its potential for urban transport. The world's first underground railway, the Metropolitan Railway in London, opened in 1863. Despite initial public skepticism about traveling in underground tunnels, the system proved enormously popular, carrying over 9 million passengers in its first year.

Electric trams emerged in the 1880s as a cleaner alternative to steam-powered trains. Cities like Berlin, Richmond, and Melbourne pioneered electric tram networks that could navigate city streets more flexibly than rail systems. The electric tram represented a significant technological leap: it was faster than horse-drawn transport, cleaner than steam, and more affordable to operate than previous systems.

The 20th century brought the automobile, fundamentally reshaping urban landscapes. Initially luxury items, cars became mass-market products after Henry Ford's assembly line innovations reduced manufacturing costs. By the 1950s, many Western cities were redesigning their infrastructure around private vehicle ownership, constructing extensive highway networks and suburban developments.

However, the automobile's dominance created new challenges. Traffic congestion, air pollution, and urban sprawl became pressing concerns by the 1970s. Cities began reconsidering public transport investments, leading to the development of modern metro systems, light rail networks, and bus rapid transit.

Today's urban planners face the complex task of integrating multiple transport modes while addressing environmental sustainability. Electric vehicles, bike-sharing programs, and smart traffic management systems represent the latest chapter in this ongoing evolution. The COVID-19 pandemic has further accelerated changes, with increased demand for cycling infrastructure and reduced public transport usage affecting future planning decisions.`,
  
  questions: [
    {
      number: 1,
      type: "multiple-choice",
      text: "According to the passage, the world's first underground railway",
      options: ["was initially unpopular with the public", "carried fewer passengers than expected", "was constructed in Berlin", "opened in the 1880s"],
      correct: "was initially unpopular with the public",
      explanation: "The text states there was 'initial public skepticism about traveling in underground tunnels' but it 'proved enormously popular' afterward."
    },
    {
      number: 2,
      type: "true-false-not-given",
      text: "Electric trams were more expensive to operate than steam-powered trains.",
      correct: "False",
      explanation: "The passage states electric trams were 'more affordable to operate than previous systems'."
    },
    {
      number: 3,
      type: "sentence-completion",
      text: "The automobile became widely accessible after Henry Ford's _______ reduced manufacturing costs.",
      correct: "assembly line innovations",
      explanation: "The text directly mentions 'Henry Ford's assembly line innovations reduced manufacturing costs'."
    }
  ]
};

// AI-generated TEF Reading Passage
const tefReading1 = {
  title: "L'agriculture urbaine : une solution d'avenir",
  content: `L'agriculture urbaine connaît un essor remarquable dans les grandes métropoles mondiales. Cette pratique, qui consiste à cultiver des aliments en milieu urbain, répond à plusieurs défis contemporains : la sécurité alimentaire, la réduction de l'empreinte carbone et le renforcement du lien social.

À Paris, les toits végétalisés se multiplient. La ferme urbaine sur le toit du Palais des Congrès produit annuellement plus de 1000 kg de légumes. Ces installations utilisent des techniques innovantes comme l'hydroponie, permettant de cultiver sans sol en utilisant des solutions nutritives. Cette méthode consomme 90% moins d'eau que l'agriculture traditionnelle.

Les jardins communautaires représentent une autre facette de cette révolution verte. À Montréal, plus de 100 jardins collectifs permettent aux citadins de cultiver leurs propres légumes tout en créant des liens sociaux. Ces espaces favorisent l'échange de savoirs entre générations et sensibilisent les plus jeunes aux questions environnementales.

L'impact économique n'est pas négligeable. Une étude de l'INRA estime que l'agriculture urbaine pourrait créer 150 000 emplois en France d'ici 2030. Les circuits courts réduisent les intermédiaires, permettant aux consommateurs d'accéder à des produits frais à prix compétitifs.

Cependant, des défis subsistent. La pollution urbaine peut affecter la qualité des productions. De plus, l'accès au foncier reste problématique dans les centres-villes où les prix immobiliers sont élevés. Malgré ces obstacles, les villes intègrent progressivement l'agriculture dans leur planification urbaine, reconnaissant ses bénéfices multiples.`,

  questions: [
    {
      number: 1,
      type: "multiple-choice",
      text: "L'hydroponie permet de :",
      options: ["cultiver sans sol", "réduire les coûts de production", "augmenter la taille des légumes", "éviter les maladies des plantes"],
      correct: "cultiver sans sol",
      explanation: "Le texte précise que l'hydroponie permet de 'cultiver sans sol en utilisant des solutions nutritives'."
    },
    {
      number: 2,
      type: "vrai-faux",
      text: "L'agriculture urbaine consomme plus d'eau que l'agriculture traditionnelle.",
      correct: "Faux",
      explanation: "Le texte indique que l'hydroponie 'consomme 90% moins d'eau que l'agriculture traditionnelle'."
    }
  ]
};

// AI-generated IELTS Writing Task 2 Prompts
const ieltsWritingTask2Prompts = [
  {
    title: "Technology and Social Interaction",
    prompt: `Some people believe that technology has made our lives easier and more convenient. Others argue that technology has made us more isolated and less capable of forming meaningful relationships.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    topics: ["Technology", "Social Issues", "Modern Life"]
  },
  {
    title: "Environmental Protection vs Economic Development",
    prompt: `Many developing countries prioritize economic growth over environmental protection. However, some argue that environmental sustainability should be the primary concern for all nations.

To what extent do you agree or disagree with this statement?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    topics: ["Environment", "Economics", "Development"]
  }
];

// AI-generated TEF Writing Section B Prompts
const tefWritingSectionB = [
  {
    title: "Les réseaux sociaux et la vie privée",
    prompt: `Les réseaux sociaux sont omniprésents dans notre société. Certains considèrent qu'ils constituent une menace pour la vie privée, tandis que d'autres estiment qu'ils offrent de nouvelles opportunités de communication et d'expression.

Consignes :
• Présentez votre point de vue sur l'impact des réseaux sociaux sur la vie privée
• Donnez deux arguments principaux avec des exemples concrets
• Proposez des solutions pour concilier usage des réseaux sociaux et protection de la vie privée
• Rédigez une conclusion équilibrée

Nombre de mots requis : 200 à 250 mots
Temps alloué : 30 minutes`,
    topics: ["Technologie", "Société", "Vie privée"]
  },
  {
    title: "L'éducation à distance",
    prompt: `Avec la généralisation des outils numériques, l'éducation à distance se développe rapidement. Certains y voient une révolution pédagogique, d'autres craignent une déshumanisation de l'enseignement.

Consignes :
• Exprimez votre opinion sur l'éducation à distance
• Développez deux arguments principaux
• Illustrez avec des exemples précis
• Concluez en proposant une approche équilibrée entre enseignement présentiel et à distance

Nombre de mots requis : 200 à 250 mots
Temps alloué : 30 minutes`,
    topics: ["Éducation", "Technologie", "Société"]
  }
];

async function insertSampleData() {
  console.log('Starting to insert comprehensive sample data...');
  
  try {
    // Insert IELTS Reading Practice Set
    console.log('Inserting IELTS Reading content...');
    
    const { data: ieltsReadingSet } = await supabase
      .from('skill_practice_sets')
      .insert({
        test_type_id: 1, // IELTS
        skill_id: 1, // Reading
        title: 'IELTS Academic Reading Practice Test 1',
        description: 'Complete academic reading test with authentic passages covering urban development, technology, and society',
        difficulty: 'intermediate',
        estimated_duration: 60,
        topics: ['Urban Development', 'Transportation', 'Technology'],
        is_active: true
      })
      .select()
      .single();

    // Insert IELTS Reading Content
    const { data: ieltsContent } = await supabase
      .from('skill_practice_content')
      .insert({
        practice_set_id: ieltsReadingSet.id,
        section_number: 1,
        title: ieltsReading1.title,
        content_type: 'text',
        content_text: ieltsReading1.content,
        instructions: 'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1.',
        word_count: ieltsReading1.content.split(' ').length
      })
      .select()
      .single();

    // Insert IELTS Reading Questions
    for (const question of ieltsReading1.questions) {
      await supabase
        .from('skill_practice_questions')
        .insert({
          content_id: ieltsContent.id,
          question_number: question.number,
          question_type: question.type,
          question_text: question.text,
          options: question.options || null,
          correct_answer: question.correct,
          explanation: question.explanation,
          points: 1
        });
    }

    // Insert TEF Reading Practice Set
    console.log('Inserting TEF Reading content...');
    
    const { data: tefReadingSet } = await supabase
      .from('skill_practice_sets')
      .insert({
        test_type_id: 2, // TEF
        skill_id: 1, // Reading
        title: 'TEF Compréhension écrite - Test 1',
        description: 'Exercices de compréhension écrite sur des sujets contemporains',
        difficulty: 'intermediate',
        estimated_duration: 60,
        topics: ['Agriculture', 'Environnement', 'Innovation'],
        is_active: true
      })
      .select()
      .single();

    const { data: tefContent } = await supabase
      .from('skill_practice_content')
      .insert({
        practice_set_id: tefReadingSet.id,
        section_number: 1,
        title: tefReading1.title,
        content_type: 'text',
        content_text: tefReading1.content,
        instructions: 'Lisez le texte suivant et répondez aux questions. Temps recommandé : 20 minutes.',
        word_count: tefReading1.content.split(' ').length
      })
      .select()
      .single();

    // Insert TEF Reading Questions
    for (const question of tefReading1.questions) {
      await supabase
        .from('skill_practice_questions')
        .insert({
          content_id: tefContent.id,
          question_number: question.number,
          question_type: question.type,
          question_text: question.text,
          options: question.options || null,
          correct_answer: question.correct,
          explanation: question.explanation,
          points: 1
        });
    }

    // Insert IELTS Writing Practice Sets
    console.log('Inserting IELTS Writing content...');
    
    for (let i = 0; i < ieltsWritingTask2Prompts.length; i++) {
      const prompt = ieltsWritingTask2Prompts[i];
      
      const { data: writingSet } = await supabase
        .from('skill_practice_sets')
        .insert({
          test_type_id: 1, // IELTS
          skill_id: 2, // Writing
          title: `IELTS Writing Task 2 - ${prompt.title}`,
          description: 'Academic Writing Task 2 essay practice with authentic topics',
          difficulty: 'advanced',
          estimated_duration: 40,
          topics: prompt.topics,
          is_active: true
        })
        .select()
        .single();

      await supabase
        .from('skill_practice_content')
        .insert({
          practice_set_id: writingSet.id,
          section_number: 1,
          title: prompt.title,
          content_type: 'prompt',
          content_text: prompt.prompt,
          instructions: 'Write at least 250 words. You should spend about 40 minutes on this task.'
        });
    }

    // Insert TEF Writing Practice Sets
    console.log('Inserting TEF Writing content...');
    
    for (let i = 0; i < tefWritingSectionB.length; i++) {
      const prompt = tefWritingSectionB[i];
      
      const { data: writingSet } = await supabase
        .from('skill_practice_sets')
        .insert({
          test_type_id: 2, // TEF
          skill_id: 2, // Writing
          title: `TEF Section B - ${prompt.title}`,
          description: 'Expression écrite argumentative sur des sujets contemporains',
          difficulty: 'advanced',
          estimated_duration: 30,
          topics: prompt.topics,
          is_active: true
        })
        .select()
        .single();

      await supabase
        .from('skill_practice_content')
        .insert({
          practice_set_id: writingSet.id,
          section_number: 1,
          title: prompt.title,
          content_type: 'prompt',
          content_text: prompt.prompt,
          instructions: 'Rédigez entre 200 et 250 mots. Temps alloué : 30 minutes.'
        });
    }

    // Create Complete Mock Test
    console.log('Creating complete IELTS mock test...');
    
    const { data: mockTest } = await supabase
      .from('mock_tests')
      .insert({
        test_type_id: 1, // IELTS
        version: 'Practice Test 1',
        title: 'IELTS Academic Practice Test 1',
        description: 'Complete IELTS Academic test simulation with all four skills',
        total_duration: 165,
        total_questions: 40,
        difficulty: 'intermediate',
        is_official: false,
        is_active: true
      })
      .select()
      .single();

    // Create Mock Test Sections
    const skills = [
      { skill_id: 3, name: 'Listening', duration: 30, questions: 40 },
      { skill_id: 1, name: 'Reading', duration: 60, questions: 40 },
      { skill_id: 2, name: 'Writing', duration: 60, questions: 2 },
      { skill_id: 4, name: 'Speaking', duration: 15, questions: 3 }
    ];

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];
      
      await supabase
        .from('mock_test_sections')
        .insert({
          mock_test_id: mockTest.id,
          skill_id: skill.skill_id,
          section_number: i + 1,
          title: `${skill.name} Section`,
          instructions: `Complete all ${skill.name.toLowerCase()} tasks within ${skill.duration} minutes.`,
          duration: skill.duration,
          total_questions: skill.questions
        });
    }

    console.log('✅ Sample data insertion completed successfully!');
    console.log('🎯 Database now contains:');
    console.log('  - IELTS and TEF reading passages with questions');
    console.log('  - IELTS and TEF writing prompts');
    console.log('  - Complete IELTS mock test structure');
    console.log('  - All content follows authentic test formats');

  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  }
}

insertSampleData();