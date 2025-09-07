const fs = require('fs');
const path = require('path');

// Expanded AI Content Generator with Multiple Test Sets
class MultipleTestSetsGenerator {
  
  // IELTS Reading Passages - Multiple Topics
  static ieltsReadingPassages = {
    'Technology & Innovation': [
      {
        title: "Artificial Intelligence in Healthcare Diagnostics",
        content: `The integration of artificial intelligence into medical diagnostics represents a paradigm shift in healthcare delivery. Machine learning algorithms can now analyze medical images, interpret laboratory results, and predict disease outcomes with remarkable accuracy, often surpassing human specialists in specific diagnostic tasks.

Deep learning models have revolutionized radiology, with AI systems capable of detecting early-stage cancers in mammograms, identifying diabetic retinopathy in eye scans, and spotting pneumonia in chest X-rays. Google's DeepMind developed an AI system that can diagnose over 50 eye diseases with 94% accuracy, potentially preventing blindness in millions of patients worldwide.

However, the implementation of AI diagnostics raises significant ethical and practical concerns. Medical professionals worry about liability when AI systems make incorrect diagnoses. Who bears responsibility if an algorithm misses a critical diagnosis or recommends inappropriate treatment? Current legal frameworks struggle to address these unprecedented scenarios.

Furthermore, AI systems can perpetuate existing healthcare inequalities. Training data often lacks diversity, leading to algorithms that perform poorly for underrepresented populations. Studies have shown that skin cancer detection AI systems are less accurate for darker skin tones, potentially exacerbating health disparities.

Despite these challenges, healthcare institutions worldwide are investing heavily in AI diagnostics. The Mayo Clinic uses AI to predict patient deterioration, while IBM Watson assists oncologists in treatment planning. The COVID-19 pandemic accelerated AI adoption, with algorithms helping to analyze chest CT scans and predict patient outcomes.`,
        
        questions: [
          { type: "multiple-choice", text: "Google's DeepMind AI system can diagnose eye diseases with what accuracy?", options: ["84% accuracy", "94% accuracy", "99% accuracy", "90% accuracy"], correct: "94% accuracy" },
          { type: "true-false-not-given", text: "AI diagnostic systems perform equally well for all ethnic groups.", correct: "False" },
          { type: "sentence-completion", text: "The _______ pandemic accelerated AI adoption in healthcare.", correct: "COVID-19" }
        ]
      },
      {
        title: "The Rise of Quantum Computing",
        content: `Quantum computing represents the next frontier in computational technology, promising to solve complex problems that are currently impossible for classical computers. Unlike traditional computers that process information in binary bits, quantum computers use quantum bits (qubits) that can exist in multiple states simultaneously.

This quantum superposition allows quantum computers to perform certain calculations exponentially faster than classical computers. While a classical computer might take millions of years to factor large numbers used in encryption, a sufficiently powerful quantum computer could accomplish this task in hours or days.

Major technology companies are investing billions in quantum research. IBM has developed quantum computers with over 1000 qubits, while Google claimed "quantum supremacy" in 2019 by performing a specific calculation faster than the world's most powerful supercomputer. However, current quantum computers are extremely fragile, requiring temperatures colder than outer space to maintain quantum states.

The potential applications are revolutionary. Quantum computers could accelerate drug discovery by simulating molecular interactions, optimize complex logistics networks, and enhance artificial intelligence capabilities. In cryptography, quantum computers pose both opportunities and threats, potentially breaking current encryption while enabling unhackable quantum communication.

Despite enormous investment and research efforts, practical quantum computing remains years away. Current quantum computers are prone to errors and can only maintain quantum states for microseconds. Scientists are working on error correction methods and more stable qubit designs to overcome these limitations.`,

        questions: [
          { type: "multiple-choice", text: "IBM's quantum computers have how many qubits?", options: ["over 500 qubits", "exactly 1000 qubits", "over 1000 qubits", "under 1000 qubits"], correct: "over 1000 qubits" },
          { type: "true-false-not-given", text: "Google achieved quantum supremacy in 2018.", correct: "False" },
          { type: "sentence-completion", text: "Quantum computers require temperatures colder than _______ to function.", correct: "outer space" }
        ]
      }
    ],

    'Environment & Sustainability': [
      {
        title: "Ocean Plastic Pollution and Innovative Solutions",
        content: `The world's oceans contain an estimated 150 million tonnes of plastic waste, with an additional 8 million tonnes entering marine environments annually. This pollution threatens marine ecosystems, human health, and global food security, creating one of the most pressing environmental challenges of our time.

Microplastics, particles smaller than 5 millimeters, have been found in marine organisms from plankton to whales. These particles enter the food chain, potentially affecting human health through seafood consumption. Research has detected microplastics in human blood, placenta, and lung tissue, though long-term health effects remain unclear.

Traditional cleanup methods prove inadequate for the scale of ocean plastic pollution. However, innovative technologies are emerging to address this crisis. The Ocean Cleanup, founded by Dutch inventor Boyan Slat, has developed systems to collect plastic from the Great Pacific Garbage Patch, a concentration of debris twice the size of Texas.

Biotechnology offers promising solutions through plastic-eating enzymes and bacteria. Scientists have discovered microorganisms capable of breaking down PET plastic, commonly used in bottles and packaging. These biological solutions could potentially degrade plastic waste in marine environments without harmful byproducts.

Prevention remains crucial for long-term ocean health. Extended producer responsibility programs require manufacturers to manage plastic waste throughout product lifecycles. Several countries have implemented plastic bottle deposit systems, achieving recycling rates exceeding 90%. Single-use plastic bans in cities worldwide demonstrate growing commitment to pollution prevention.`,

        questions: [
          { type: "multiple-choice", text: "How much plastic waste enters oceans annually?", options: ["6 million tonnes", "8 million tonnes", "10 million tonnes", "12 million tonnes"], correct: "8 million tonnes" },
          { type: "true-false-not-given", text: "The Great Pacific Garbage Patch is three times the size of Texas.", correct: "False" },
          { type: "sentence-completion", text: "_______ programs require manufacturers to manage plastic waste throughout product lifecycles.", correct: "Extended producer responsibility" }
        ]
      },
      {
        title: "Urban Vertical Farming Revolution",
        content: `Vertical farming, the practice of growing crops in vertically stacked layers within controlled environments, represents a revolutionary approach to agriculture that could transform food production in urban areas. This innovative farming method uses significantly less water, eliminates pesticide use, and produces higher yields per square meter than traditional agriculture.

LED lighting systems have made vertical farming economically viable by providing energy-efficient, full-spectrum light that optimizes plant growth. Advanced hydroponic and aeroponic systems deliver precise nutrients to plant roots, resulting in crops that grow 30-50% faster than field-grown alternatives while using 95% less water.

Singapore leads global vertical farming adoption, with the government investing heavily in food security initiatives. The city-state aims to produce 30% of nutritional needs locally by 2030 through vertical farms and other urban agriculture methods. Companies like Sky Greens operate commercial vertical farms producing vegetables for local supermarkets.

Environmental benefits extend beyond water conservation. Vertical farms eliminate agricultural runoff, reduce transportation costs and emissions, and protect crops from climate-related weather events. Year-round production ensures consistent food supply regardless of seasonal variations or extreme weather conditions.

However, significant challenges remain. High initial capital costs and energy consumption for LED lighting make vertical farming expensive compared to traditional agriculture. Currently, vertical farms focus on high-value crops like leafy greens and herbs rather than staple grains, limiting their impact on global food security.`,

        questions: [
          { type: "multiple-choice", text: "Singapore aims to produce what percentage of nutritional needs locally by 2030?", options: ["20%", "25%", "30%", "35%"], correct: "30%" },
          { type: "true-false-not-given", text: "Vertical farming uses 95% less water than traditional agriculture.", correct: "True" },
          { type: "sentence-completion", text: "Vertical farm crops grow _______% faster than field-grown alternatives.", correct: "30-50" }
        ]
      }
    ],

    'Social Issues & Culture': [
      {
        title: "Digital Divide and Educational Inequality",
        content: `The digital divide, the gap between those with access to modern digital technology and those without, has become a critical factor in educational inequality worldwide. This disparity affects students' academic performance, future career prospects, and participation in an increasingly digital society.

The COVID-19 pandemic starkly revealed the extent of digital inequality when schools shifted to online learning. An estimated 1.6 billion students were affected by school closures, yet many lacked reliable internet access or digital devices necessary for remote education. Rural communities and low-income families were disproportionately impacted, widening existing educational gaps.

In developed countries, the homework gap affects millions of students who cannot complete digital assignments at home. The Federal Communications Commission estimates that 15-17 million US students lack broadband internet access at home, forcing them to seek WiFi in parking lots outside libraries and restaurants during the pandemic.

Beyond internet access, digital literacy represents another dimension of the divide. Students from disadvantaged backgrounds often lack experience with digital tools and online learning platforms, putting them at a significant disadvantage. Teachers in under-resourced schools frequently lack training and support to effectively integrate technology into instruction.

Governments and organizations worldwide are implementing initiatives to bridge the digital divide. Estonia provides free WiFi in public spaces and digital literacy training for all citizens. The One Laptop Per Child initiative has distributed millions of low-cost computers to students in developing countries, though mixed results highlight the complexity of addressing digital inequality through technology alone.`,

        questions: [
          { type: "multiple-choice", text: "How many students worldwide were affected by COVID-19 school closures?", options: ["1.2 billion", "1.4 billion", "1.6 billion", "1.8 billion"], correct: "1.6 billion" },
          { type: "true-false-not-given", text: "Estonia provides free WiFi in all residential areas.", correct: "Not Given" },
          { type: "sentence-completion", text: "The _______ gap affects students who cannot complete digital assignments at home.", correct: "homework" }
        ]
      }
    ]
  };

  // TEF Reading Passages - Multiple Topics in French
  static tefReadingPassages = {
    'Société et Innovation': [
      {
        title: "Les voitures électriques : vers une mobilité durable",
        content: `L'adoption des véhicules électriques s'accélère dans le monde entier, portée par les préoccupations environnementales et les avancées technologiques. En 2023, les ventes mondiales de voitures électriques ont dépassé 10 millions d'unités, représentant 14% du marché automobile total.

La Norvège fait figure de pionnier avec 80% de ventes de véhicules électriques en 2023, grâce à une politique incitative comprenant des exemptions fiscales, l'accès gratuit aux péages et au stationnement. Ce succès démontre l'efficacité des mesures gouvernementales pour accélérer la transition énergétique.

L'autonomie des batteries reste un défi majeur. Les modèles actuels offrent généralement 300 à 500 kilomètres d'autonomie, suffisant pour la majorité des trajets quotidiens mais limitant les voyages longue distance. Les constructeurs investissent massivement dans la recherche pour développer des batteries plus performantes et durables.

L'infrastructure de recharge constitue un autre enjeu crucial. L'Europe compte environ 400 000 bornes de recharge publiques, mais les experts estiment qu'il faudra tripler ce nombre d'ici 2030 pour répondre à la demande croissante. La recharge rapide progresse également, permettant de récupérer 80% de la capacité en moins de 30 minutes.

Les défis environnementaux persistent néanmoins. L'extraction du lithium nécessaire aux batteries pose des problèmes écologiques dans certaines régions. De plus, l'impact carbone dépend largement de la source d'électricité utilisée pour la recharge, privilégiant les pays avec une électricité décarbonée.`,

        questions: [
          { type: "QCM", text: "En Norvège, quel pourcentage des ventes de voitures étaient électriques en 2023?", options: ["70%", "75%", "80%", "85%"], correct: "80%" },
          { type: "vrai-faux", text: "L'Europe devra tripler son nombre de bornes de recharge d'ici 2030.", correct: "Vrai" },
          { type: "complétement", text: "Les ventes mondiales de voitures électriques ont représenté _____% du marché automobile en 2023.", correct: "14" }
        ]
      },
      {
        title: "L'économie circulaire : repenser notre modèle de consommation",
        content: `L'économie circulaire propose une alternative au modèle linéaire traditionnel "extraire-produire-jeter" en favorisant la réutilisation, le recyclage et la réparation des produits. Cette approche vise à réduire les déchets et l'utilisation des ressources naturelles tout en créant de nouveaux emplois.

Les entreprises innovantes adoptent des modèles d'affaires circulaires. Patagonia, marque de vêtements outdoor, répare gratuitement ses produits et rachète les articles usagés pour les revendre. Cette stratégie renforce la fidélité client tout en réduisant l'impact environnemental de la production textile.

Le secteur du bâtiment expérimente également la circularité. Les Pays-Bas ont développé des "passeports matériaux" numériques qui documentent tous les matériaux utilisés dans les constructions, facilitant leur réutilisation lors de démolitions. Cette innovation pourrait révolutionner l'industrie de la construction, traditionnellement très consommatrice de ressources.

L'Union européenne s'engage vers l'économie circulaire avec des objectifs ambitieux : recycler 65% des déchets municipaux d'ici 2035 et réduire la mise en décharge à maximum 10%. Des mesures comme le "droit à la réparation" obligent les fabricants à proposer des pièces détachées pendant au moins 10 ans.

Cependant, la transition nécessite un changement profond des mentalités consuméristes. Les consommateurs doivent privilégier la durabilité à la nouveauté, accepter les produits reconditionnés et modifier leurs habitudes d'achat. Cette transformation culturelle représente le plus grand défi de l'économie circulaire.`,

        questions: [
          { type: "QCM", text: "L'UE vise à recycler quel pourcentage des déchets municipaux d'ici 2035?", options: ["60%", "65%", "70%", "75%"], correct: "65%" },
          { type: "vrai-faux", text: "Le 'droit à la réparation' oblige les fabricants à proposer des pièces détachées pendant 5 ans.", correct: "Faux" },
          { type: "complétement", text: "Les _______ matériaux documentent tous les matériaux utilisés dans les constructions.", correct: "passeports" }
        ]
      }
    ]
  };

  // IELTS Writing Task 2 Prompts - Multiple Topics
  static ieltsWritingPrompts = {
    'Technology': [
      `Some people believe that social media platforms have a positive impact on society by connecting people and sharing information. Others argue that social media creates more problems than benefits, including misinformation and social isolation.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.
Write at least 250 words.`,

      `Many workplaces are adopting artificial intelligence and automation to replace human workers. Some believe this will lead to mass unemployment, while others argue it will create new opportunities and improve productivity.

To what extent do you agree that AI and automation are beneficial for society?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.
Write at least 250 words.`,

      `The use of smartphones and digital devices has become widespread among children and teenagers. Some educators believe technology enhances learning, while others worry about negative effects on concentration and social development.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.
Write at least 250 words.`
    ],

    'Environment': [
      `Climate change is one of the most pressing issues facing humanity. Some argue that individual actions are sufficient to address environmental problems, while others believe only government regulation and international cooperation can create meaningful change.

To what extent do you think individual actions can solve environmental problems?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.
Write at least 250 words.`,

      `Many cities around the world are experiencing air pollution problems. Some people suggest that the best solution is to increase the price of fuel for cars and other vehicles, while others believe there are better alternatives.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.
Write at least 250 words.`
    ],

    'Education': [
      `Some people believe that university education should be free for all students, while others think students should pay for their education. 

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.
Write at least 250 words.`,

      `Traditional classroom teaching is being increasingly supplemented or replaced by online learning. Some educators embrace this change, while others prefer face-to-face instruction.

Discuss the advantages and disadvantages of online learning compared to traditional classroom education.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.
Write at least 250 words.`
    ]
  };

  // TEF Writing Section B Prompts - Multiple Topics in French
  static tefWritingPrompts = {
    'Environnement': [
      `De nombreuses villes interdisent progressivement les voitures diesel et essence dans leurs centres pour réduire la pollution. Cette mesure suscite des débats entre partisans de l'écologie et défenseurs de la liberté de circulation.

Consignes :
• Présentez votre position sur ces interdictions de circulation
• Développez deux arguments principaux avec des exemples concrets
• Proposez des alternatives pour faciliter cette transition
• Concluez en évoquant l'avenir de la mobilité urbaine

Nombre de mots requis : 200 à 250 mots
Temps alloué : 30 minutes`,

      `L'agriculture biologique se développe rapidement mais reste plus chère que l'agriculture conventionnelle. Certains considèrent qu'elle devrait être accessible à tous, d'autres estiment que son prix reflète sa qualité supérieure.

Consignes :
• Exprimez votre point de vue sur l'accessibilité de l'agriculture biologique
• Justifiez votre position avec deux arguments principaux
• Illustrez avec des exemples précis
• Proposez des solutions pour démocratiser l'alimentation de qualité

Nombre de mots requis : 200 à 250 mots
Temps alloué : 30 minutes`
    ],

    'Technologie': [
      `Les voitures autonomes commencent à circuler sur les routes. Certains y voient une révolution qui améliorera la sécurité routière, d'autres s'inquiètent des risques technologiques et éthiques.

Consignes :
• Présentez votre opinion sur les voitures autonomes
• Développez deux arguments principaux
• Donnez des exemples concrets pour illustrer vos propos
• Concluez en évoquant les conditions nécessaires à leur développement

Nombre de mots requis : 200 à 250 mots
Temps alloué : 30 minutes`,

      `L'intelligence artificielle commence à être utilisée dans l'éducation pour personnaliser l'apprentissage. Cette évolution divise les enseignants entre enthousiastes et sceptiques.

Consignes :
• Exprimez votre point de vue sur l'IA dans l'éducation
• Justifiez avec deux arguments principaux et des exemples
• Analysez les bénéfices et les risques potentiels
• Proposez une approche équilibrée pour l'avenir

Nombre de mots requis : 200 à 250 mots
Temps alloué : 30 minutes`
    ]
  };

  // Generate all test sets
  static generateAllTestSets() {
    const allContent = {
      ielts: {
        reading: [],
        writing: [],
        mockTests: []
      },
      tef: {
        reading: [],
        writing: [],
        mockTests: []
      }
    };

    // Generate IELTS Reading Sets
    Object.entries(this.ieltsReadingPassages).forEach(([topic, passages]) => {
      passages.forEach((passage, index) => {
        allContent.ielts.reading.push({
          setId: `ielts-reading-${topic.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
          title: `IELTS Reading - ${passage.title}`,
          topic: topic,
          difficulty: index % 3 === 0 ? 'beginner' : index % 3 === 1 ? 'intermediate' : 'advanced',
          estimatedTime: 20,
          passage: passage
        });
      });
    });

    // Generate TEF Reading Sets
    Object.entries(this.tefReadingPassages).forEach(([topic, passages]) => {
      passages.forEach((passage, index) => {
        allContent.tef.reading.push({
          setId: `tef-reading-${topic.toLowerCase().replace(/\s+/g, '-')}-${index + 1}`,
          title: `TEF Lecture - ${passage.title}`,
          topic: topic,
          difficulty: 'intermediate',
          estimatedTime: 20,
          passage: passage
        });
      });
    });

    // Generate IELTS Writing Sets
    Object.entries(this.ieltsWritingPrompts).forEach(([topic, prompts]) => {
      prompts.forEach((prompt, index) => {
        allContent.ielts.writing.push({
          setId: `ielts-writing-${topic.toLowerCase()}-${index + 1}`,
          title: `IELTS Writing Task 2 - ${topic}`,
          topic: topic,
          difficulty: 'advanced',
          estimatedTime: 40,
          prompt: prompt
        });
      });
    });

    // Generate TEF Writing Sets
    Object.entries(this.tefWritingPrompts).forEach(([topic, prompts]) => {
      prompts.forEach((prompt, index) => {
        allContent.tef.writing.push({
          setId: `tef-writing-${topic.toLowerCase()}-${index + 1}`,
          title: `TEF Expression écrite - ${topic}`,
          topic: topic,
          difficulty: 'advanced',
          estimatedTime: 30,
          prompt: prompt
        });
      });
    });

    // Generate Complete Mock Tests (5 different versions each)
    for (let i = 1; i <= 5; i++) {
      // IELTS Mock Tests
      allContent.ielts.mockTests.push({
        testId: `ielts-mock-${i}`,
        title: `IELTS Academic Practice Test ${i}`,
        description: `Complete IELTS Academic test simulation - Version ${i}`,
        difficulty: i <= 2 ? 'beginner' : i <= 4 ? 'intermediate' : 'advanced',
        totalDuration: 165,
        sections: {
          listening: {
            duration: 30,
            scenarios: [
              { title: `University Information Session ${i}`, type: 'academic' },
              { title: `Student Accommodation Inquiry ${i}`, type: 'social' },
              { title: `Academic Lecture ${i}`, type: 'academic' },
              { title: `Discussion on Research Methods ${i}`, type: 'academic' }
            ]
          },
          reading: {
            duration: 60,
            passages: this.getRandomPassages('ielts', 3)
          },
          writing: {
            duration: 60,
            tasks: [
              { type: 'Task 1', description: `Chart analysis ${i}`, time: 20 },
              { type: 'Task 2', prompt: this.getRandomPrompt('ielts'), time: 40 }
            ]
          },
          speaking: {
            duration: 15,
            parts: [
              { part: 'Part 1', questions: [`Personal questions set ${i}`] },
              { part: 'Part 2', questions: [`Cue card topic ${i}`] },
              { part: 'Part 3', questions: [`Discussion questions ${i}`] }
            ]
          }
        }
      });

      // TEF Mock Tests
      allContent.tef.mockTests.push({
        testId: `tef-mock-${i}`,
        title: `TEF Test complet ${i}`,
        description: `Simulation complète du TEF - Version ${i}`,
        difficulty: i <= 2 ? 'débutant' : i <= 4 ? 'intermédiaire' : 'avancé',
        totalDuration: 150,
        sections: {
          comprehensionEcrite: {
            duration: 60,
            passages: this.getRandomPassages('tef', 2)
          },
          expressionEcrite: {
            duration: 60,
            tasks: [
              { type: 'Section A', description: `Message professionnel ${i}`, time: 15 },
              { type: 'Section B', prompt: this.getRandomPrompt('tef'), time: 30 }
            ]
          },
          comprehensionOrale: {
            duration: 40,
            scenarios: [
              { title: `Situation quotidienne ${i}`, type: 'social' },
              { title: `Contexte professionnel ${i}`, type: 'professionnel' }
            ]
          },
          expressionOrale: {
            duration: 15,
            sections: [
              { section: 'A', description: `Entretien dirigé ${i}` },
              { section: 'B', description: `Expression libre ${i}` }
            ]
          }
        }
      });
    }

    return allContent;
  }

  static getRandomPassages(testType, count) {
    const passages = testType === 'ielts' ? 
      Object.values(this.ieltsReadingPassages).flat() :
      Object.values(this.tefReadingPassages).flat();
    
    return passages.slice(0, count);
  }

  static getRandomPrompt(testType) {
    const prompts = testType === 'ielts' ?
      Object.values(this.ieltsWritingPrompts).flat() :
      Object.values(this.tefWritingPrompts).flat();
    
    return prompts[Math.floor(Math.random() * prompts.length)];
  }

  static saveAllContent() {
    const allContent = this.generateAllTestSets();
    
    const outputDir = path.join(__dirname, '../generated-content');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Save comprehensive content
    fs.writeFileSync(
      path.join(outputDir, 'all-test-sets.json'), 
      JSON.stringify(allContent, null, 2)
    );

    // Save individual components for easy access
    fs.writeFileSync(
      path.join(outputDir, 'ielts-reading-sets.json'),
      JSON.stringify(allContent.ielts.reading, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'tef-reading-sets.json'),
      JSON.stringify(allContent.tef.reading, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'ielts-writing-sets.json'),
      JSON.stringify(allContent.ielts.writing, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'tef-writing-sets.json'),
      JSON.stringify(allContent.tef.writing, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'all-mock-tests.json'),
      JSON.stringify({
        ielts: allContent.ielts.mockTests,
        tef: allContent.tef.mockTests
      }, null, 2)
    );

    return allContent;
  }
}

// Generate all content
console.log('🚀 Generating Multiple Test Sets...');
console.log('');

const allContent = MultipleTestSetsGenerator.saveAllContent();

console.log('✅ Generated Content Summary:');
console.log(`📖 IELTS Reading Sets: ${allContent.ielts.reading.length}`);
console.log(`✍️  IELTS Writing Sets: ${allContent.ielts.writing.length}`);
console.log(`🎯 IELTS Mock Tests: ${allContent.ielts.mockTests.length}`);
console.log('');
console.log(`📖 TEF Reading Sets: ${allContent.tef.reading.length}`);
console.log(`✍️  TEF Writing Sets: ${allContent.tef.writing.length}`);
console.log(`🎯 TEF Mock Tests: ${allContent.tef.mockTests.length}`);
console.log('');
console.log('📊 Topics Covered:');
console.log('  IELTS: Technology & Innovation, Environment & Sustainability, Social Issues & Culture');
console.log('  TEF: Société et Innovation, Environnement, Technologie');
console.log('');
console.log('🎓 Difficulty Levels: Beginner, Intermediate, Advanced');
console.log('⏱️  Various Durations: 15-60 minutes per practice set');
console.log('');
console.log('📁 All content saved to: ./generated-content/');

module.exports = MultipleTestSetsGenerator;