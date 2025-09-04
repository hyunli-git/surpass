'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Question {
  id: number;
  type: 'multiple-choice' | 'true-false-not-given' | 'matching-headings' | 'sentence-completion' | 'summary-completion' | 'matching-information' | 'short-answer';
  question: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
}

interface Passage {
  id: number;
  title: string;
  text: string;
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
  wordCount: number;
  timeAllocation: number;
}

interface TestSet {
  id: number;
  name: string;
  description: string;
  passages: Passage[];
  totalTime: number;
  totalQuestions: number;
  category: 'Academic' | 'General Training';
  topics: string[];
  year: string;
}

export default function IELTSReadingPractice() {
  const searchParams = useSearchParams();
  const testType = searchParams.get('test') || 'ielts';
  const language = searchParams.get('lang') || 'en';
  const isTEF = testType === 'tef';
  
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [currentPassage, setCurrentPassage] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(isTEF ? 3600 : 3600); // 60 minutes for both
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'Academic' | 'General Training'>('Academic');

  // Comprehensive test sets reflecting current IELTS trends (2024-2025)
  const testSets: TestSet[] = [
    {
      id: 1,
      name: "Test Set 1: Climate & Technology",
      description: "Focus on environmental science and technological innovations",
      category: "Academic",
      topics: ["Climate Change", "Renewable Energy", "AI Ethics"],
      year: "2024",
      totalTime: 60,
      totalQuestions: 40,
      passages: [
        {
          id: 1,
          title: "The Great Pacific Garbage Patch: A Modern Environmental Crisis",
          difficulty: "easy",
          wordCount: 750,
          timeAllocation: 20,
          text: `The Great Pacific Garbage Patch, located between Hawaii and California, represents one of the most visible symptoms of global plastic pollution. This massive collection of marine debris, primarily consisting of microplastics, spans an area roughly twice the size of Texas. Scientists first discovered this phenomenon in 1997, though evidence suggests its formation began decades earlier with the rise of disposable plastic products.

          The patch forms due to ocean currents called gyres, which act like enormous whirlpools, trapping floating debris in their centers. The North Pacific Subtropical Gyre, where this patch resides, moves in a clockwise spiral pattern that continuously draws in plastic waste from coastal areas and shipping routes. What makes this particularly concerning is that plastics don't biodegrade; instead, they photodegrade, breaking down into smaller pieces that marine life often mistakes for food.

          Recent studies indicate that the patch contains approximately 1.8 trillion pieces of plastic, weighing around 80,000 metric tons. Fishing nets account for 46% of the total mass, while microplastics smaller than 5mm constitute 94% of the estimated 1.8 trillion pieces. These microplastics pose severe threats to marine ecosystems, as they enter the food chain when consumed by small fish and eventually accumulate in larger predators, including humans who consume seafood.

          The economic impact extends beyond environmental damage. The fishing industry loses approximately $13 billion annually due to marine plastic pollution, while tourism in affected coastal areas suffers significant revenue losses. Cleanup efforts face enormous challenges due to the patch's remote location, vast size, and the constant influx of new debris. The Ocean Cleanup project, launched in 2018, uses specialized systems to collect plastic, but experts estimate it would take decades to make substantial progress.

          Solutions require international cooperation and systemic changes in plastic production and consumption. Some proposed strategies include improving waste management infrastructure in coastal regions, developing biodegradable alternatives to conventional plastics, implementing stricter regulations on single-use plastics, and creating economic incentives for plastic recycling. Several countries have begun banning specific plastic products, while others invest in innovative recycling technologies.

          Individual actions, though seemingly small, contribute to larger solutions. Reducing plastic consumption, properly disposing of waste, participating in beach cleanups, and supporting businesses that minimize plastic packaging all play roles in addressing this crisis. Education remains crucial, as many people remain unaware of their plastic consumption's far-reaching consequences.

          The Great Pacific Garbage Patch serves as a stark reminder of humanity's impact on ocean ecosystems. Without immediate and sustained action, scientists predict the amount of plastic in the ocean could triple by 2040. This environmental challenge requires unprecedented global coordination, technological innovation, and fundamental changes in how society produces, uses, and disposes of plastic materials.`,
          questions: [
            {
              id: 1,
              type: "multiple-choice",
              question: "What percentage of the Great Pacific Garbage Patch's mass consists of fishing nets?",
              options: ["94%", "46%", "80%", "13%"],
              answer: "46%",
              explanation: "The passage states that 'Fishing nets account for 46% of the total mass'"
            },
            {
              id: 2,
              type: "true-false-not-given",
              question: "The Great Pacific Garbage Patch was first discovered in 1997.",
              options: ["True", "False", "Not Given"],
              answer: "True",
              explanation: "The passage mentions 'Scientists first discovered this phenomenon in 1997'"
            },
            {
              id: 3,
              type: "multiple-choice",
              question: "According to the passage, what happens to plastics in the ocean?",
              options: [
                "They biodegrade completely",
                "They photodegrade into smaller pieces",
                "They dissolve in saltwater",
                "They sink to the ocean floor"
              ],
              answer: "They photodegrade into smaller pieces",
              explanation: "The text states plastics 'don't biodegrade; instead, they photodegrade, breaking down into smaller pieces'"
            },
            {
              id: 4,
              type: "sentence-completion",
              question: "The fishing industry loses approximately _____ annually due to marine plastic pollution.",
              answer: "$13 billion",
              explanation: "The passage mentions this specific figure for fishing industry losses"
            },
            {
              id: 5,
              type: "true-false-not-given",
              question: "The Ocean Cleanup project will completely clean the patch within five years.",
              options: ["True", "False", "Not Given"],
              answer: "False",
              explanation: "The passage states 'experts estimate it would take decades to make substantial progress'"
            },
            {
              id: 6,
              type: "matching-information",
              question: "Which paragraph discusses individual actions to address the crisis?",
              answer: "Paragraph 6",
              explanation: "The sixth paragraph specifically discusses individual actions like reducing plastic consumption"
            },
            {
              id: 7,
              type: "short-answer",
              question: "By what year could the amount of plastic in the ocean triple according to scientists? (Use no more than 2 words)",
              answer: "2040",
              explanation: "The final paragraph mentions this prediction"
            }
          ]
        },
        {
          id: 2,
          title: "Artificial Intelligence in Healthcare: Revolution or Risk?",
          difficulty: "medium",
          wordCount: 850,
          timeAllocation: 20,
          text: `The integration of artificial intelligence (AI) into healthcare systems worldwide represents a paradigm shift in medical practice, diagnosis, and patient care. From IBM Watson's cancer treatment recommendations to Google's DeepMind predicting acute kidney injury 48 hours before it occurs, AI applications demonstrate unprecedented potential for improving health outcomes. However, this technological revolution brings complex challenges regarding accuracy, ethics, liability, and the fundamental nature of medical practice itself.

          Machine learning algorithms now analyze medical images with accuracy rates exceeding those of experienced radiologists in specific contexts. A Stanford University study showed that their AI system could diagnose skin cancer from photographs with the same accuracy as board-certified dermatologists. Similarly, researchers at Google Health developed an AI model that detects breast cancer in mammograms with greater accuracy than human radiologists, reducing false positives by 5.7% and false negatives by 9.4%. These achievements suggest AI could address the global shortage of medical specialists, particularly in underserved regions where access to expert diagnosis remains limited.

          Drug discovery, traditionally requiring 10-15 years and billions of dollars, undergoes radical transformation through AI applications. Machine learning algorithms analyze vast molecular databases, predict drug interactions, and identify potential therapeutic compounds in months rather than years. Atomwise, a company using AI for drug discovery, identified two potential Ebola treatments in days rather than months or years. During the COVID-19 pandemic, AI platforms accelerated vaccine development by predicting protein structures and analyzing viral mutations, contributing to the fastest vaccine development in history.

          Despite remarkable successes, AI in healthcare faces significant limitations and risks. Algorithms trained on biased datasets perpetuate and amplify existing healthcare disparities. Studies reveal that AI systems often perform poorly for ethnic minorities, women, and elderly patients when training data predominantly represents young, white, male populations. The "black box" nature of many AI systems poses another challenge: when deep learning algorithms make diagnostic recommendations, they often cannot explain their reasoning in ways physicians and patients can understand, raising questions about trust and accountability.

          Ethical dilemmas multiply as AI assumes greater responsibilities in healthcare decisions. Who bears liability when an AI system makes an incorrect diagnosis—the software developer, the hospital, or the physician who relied on the recommendation? How should healthcare systems balance efficiency gains from automation against the potential loss of human empathy and intuition that characterizes effective medical practice? These questions become more pressing as AI systems move from supportive tools to autonomous decision-makers in certain medical contexts.

          Privacy concerns intensify with AI's hunger for data. Effective medical AI requires vast amounts of patient information, including genetic data, lifestyle factors, and detailed medical histories. While this data enables personalized treatment recommendations, it also creates unprecedented risks for privacy breaches and discrimination. Insurance companies might use AI predictions to deny coverage, employers could discriminate based on health risk assessments, and hackers could exploit vulnerabilities in AI systems storing sensitive medical information.

          The path forward requires careful navigation between innovation and caution. Regulatory frameworks struggle to keep pace with rapid technological advancement, leaving gaps in oversight and accountability. The FDA's approval process for AI medical devices differs from traditional medical equipment, recognizing that machine learning systems continuously evolve and improve. Some experts advocate for "explainable AI" requirements in healthcare, mandating that AI systems provide interpretable reasoning for their recommendations. Others propose hybrid approaches where AI augments rather than replaces human medical judgment.

          Healthcare professionals increasingly recognize that AI will fundamentally alter their roles rather than replace them entirely. Radiologists might shift from image interpretation to managing AI systems and handling complex cases that require human insight. Primary care physicians could spend less time on routine diagnoses and more time on patient communication and complex medical decision-making. Medical education already adapts, with many schools introducing AI and data science courses into their curricula, preparing future physicians for an AI-integrated healthcare landscape.`,
          questions: [
            {
              id: 8,
              type: "matching-headings",
              question: "Match the paragraph with the most suitable heading",
              options: [
                "The Promise of AI in Medical Imaging",
                "Transforming Drug Development",
                "Challenges and Limitations",
                "Ethical Considerations",
                "Data Privacy Issues",
                "Future Integration Strategies",
                "Changing Medical Roles"
              ],
              answer: "Paragraph 2: The Promise of AI in Medical Imaging",
              explanation: "This paragraph focuses on AI's success in analyzing medical images"
            },
            {
              id: 9,
              type: "multiple-choice",
              question: "According to the passage, Google Health's AI model for breast cancer detection:",
              options: [
                "Reduced false positives by 9.4% and false negatives by 5.7%",
                "Reduced false positives by 5.7% and false negatives by 9.4%",
                "Increased accuracy by 15%",
                "Performed worse than radiologists"
              ],
              answer: "Reduced false positives by 5.7% and false negatives by 9.4%",
              explanation: "The specific percentages are mentioned in paragraph 2"
            },
            {
              id: 10,
              type: "summary-completion",
              question: "Complete the summary using words from the passage:\n\nAI in drug discovery has reduced the traditional timeline from _____ to just months. During COVID-19, AI helped develop vaccines by predicting _____ and analyzing _____.",
              answer: ["10-15 years", "protein structures", "viral mutations"],
              explanation: "These specific details are found in paragraph 3"
            },
            {
              id: 11,
              type: "true-false-not-given",
              question: "The FDA uses the same approval process for AI medical devices as for traditional equipment.",
              options: ["True", "False", "Not Given"],
              answer: "False",
              explanation: "Paragraph 7 states the FDA's process 'differs from traditional medical equipment'"
            },
            {
              id: 12,
              type: "matching-information",
              question: "Which paragraph discusses the 'black box' problem of AI systems?",
              answer: "Paragraph 4",
              explanation: "The fourth paragraph specifically mentions the 'black box' nature of AI systems"
            },
            {
              id: 13,
              type: "short-answer",
              question: "What type of AI do some experts advocate for in healthcare? (Maximum 2 words)",
              answer: "Explainable AI",
              explanation: "Mentioned in paragraph 7 as a proposed requirement"
            }
          ]
        },
        {
          id: 3,
          title: "The Anthropocene: Humanity's Geological Legacy",
          difficulty: "hard",
          wordCount: 950,
          timeAllocation: 20,
          text: `The proposition that Earth has entered a new geological epoch—the Anthropocene—represents more than semantic debate among stratigraphers; it fundamentally challenges how humanity conceptualizes its relationship with planetary systems. This proposed epoch, characterized by human activities' dominant influence on climate and environment, would mark the first geological period defined by a single species' impact. The Anthropocene Working Group, established in 2009, continues evaluating evidence for formally recognizing this epoch within the Geological Time Scale, a decision carrying profound scientific, philosophical, and policy implications.

          Stratigraphic evidence supporting the Anthropocene designation appears overwhelming in scope and clarity. The mid-20th century reveals a sharp discontinuity in geological deposits worldwide, marked by plutonium isotopes from nuclear weapons testing, microplastics in sedimentary layers, elevated nitrogen and phosphorus levels from industrial agriculture, and unprecedented concentrations of carbon dioxide in ice cores. This "Great Acceleration" around 1950 provides a potential "golden spike"—a Global Boundary Stratotype Section and Point (GSSP)—that geologists require for formal epoch designation. Crawford Lake in Ontario, with its precisely layered sediments preserving annual records of environmental change, emerged as the proposed type locality for defining the Anthropocene's beginning.

          Critics within the geological community raise substantial objections to Anthropocene formalization, arguing that 70 years represents an impossibly brief duration for a geological epoch, which typically span millions of years. They contend that human impacts, while significant, remain superficial compared to forces that defined previous epochs: asteroid impacts, massive volcanism, or continental drift. Some propose alternative framings, such as classifying the Anthropocene as an "event" similar to the Paleocene-Eocene Thermal Maximum rather than an epoch. Others suggest the term belongs in cultural and political discourse rather than formal geological classification, warning that mixing advocacy with stratigraphy compromises scientific objectivity.

          The Anthropocene concept transcends geological debate, profoundly influencing environmental humanities, social sciences, and policy discussions. Historians examine how colonialism, industrialization, and capitalism created conditions for planetary-scale environmental change. Some scholars prefer "Capitalocene," emphasizing specific economic systems rather than humanity collectively as the driving force. Indigenous scholars critique the universalizing narrative of the Anthropocene, noting that environmental destruction stems from particular cultural practices rather than inherent human nature, and that many societies maintained sustainable relationships with their environments for millennia.

          Regardless of formal geological recognition, the Anthropocene framework already reshapes environmental governance and policy. The concept underlies international agreements like the Paris Climate Accord and the UN Sustainable Development Goals, providing scientific grounding for urgent action. It challenges traditional nature-culture dichotomies that underpin environmental law, suggesting that pristine nature no longer exists and that conservation must acknowledge pervasive human influence. Some legal scholars propose "Earth system law" as a new paradigm recognizing planetary boundaries and humanity's role as a geological force requiring corresponding responsibilities.

          Technological responses to Anthropocene challenges generate intense debate about humanity's future trajectory. Geoengineering proposals—solar radiation management, ocean fertilization, massive reforestation, direct air capture of carbon dioxide—represent attempts to deliberately manipulate Earth systems to counteract unintended consequences of industrialization. Proponents argue that having inadvertently become a geological force, humanity must now consciously manage planetary systems. Critics warn that such hubris could trigger catastrophic unintended consequences and that geoengineering addresses symptoms while ignoring root causes of environmental crisis.

          The Anthropocene's psychological and cultural dimensions prove equally significant as its physical manifestations. "Anthropocene anxiety" emerges as people grapple with their species' planetary impact and question fundamental assumptions about progress, growth, and humanity's future. Artists, writers, and filmmakers explore Anthropocene themes, creating new genres of climate fiction, extinction art, and deep-time thinking that challenge anthropocentric perspectives. Museums worldwide develop Anthropocene exhibitions, translating complex scientific concepts for public understanding and engagement.

          Educational implications of the Anthropocene concept extend across disciplines, demanding integration of Earth system science, human history, and future studies. Traditional disciplinary boundaries dissolve as understanding Anthropocene challenges requires combining geological timescales with human timescales, natural sciences with social sciences, and local observations with planetary perspectives. Universities establish Anthropocene research programs, develop interdisciplinary curricula, and train students for careers addressing planetary-scale challenges that previous generations could scarcely imagine.

          The Anthropocene ultimately raises existential questions about human agency, responsibility, and destiny. If humanity has become a geological force comparable to volcanoes or glaciers, what ethical obligations follow? How should present generations balance their needs against their geological legacy for countless future generations? Can technological civilization achieve sustainability, or does the Anthropocene represent a brief, self-terminating geological event? These questions lack easy answers, but engaging them becomes essential as humanity navigates its unprecedented role in Earth's geological history.`,
          questions: [
            {
              id: 14,
              type: "matching-headings",
              question: "Choose the most appropriate heading for paragraph 4:",
              options: [
                "Scientific Evidence for a New Epoch",
                "Beyond Geology: Wider Implications",
                "Technical Challenges in Classification",
                "The Role of Technology",
                "Environmental Policy Responses"
              ],
              answer: "Beyond Geology: Wider Implications",
              explanation: "This paragraph discusses how the Anthropocene concept influences fields beyond geology"
            },
            {
              id: 15,
              type: "multiple-choice",
              question: "What location has been proposed as the type locality for defining the Anthropocene's beginning?",
              options: [
                "The Pacific Ocean",
                "Antarctica ice cores",
                "Crawford Lake in Ontario",
                "Industrial sites in Europe"
              ],
              answer: "Crawford Lake in Ontario",
              explanation: "Specifically mentioned in paragraph 2 as the proposed type locality"
            },
            {
              id: 16,
              type: "true-false-not-given",
              question: "All scientists agree that the Anthropocene should be formally recognized as a geological epoch.",
              options: ["True", "False", "Not Given"],
              answer: "False",
              explanation: "Paragraph 3 details substantial objections from critics within the geological community"
            },
            {
              id: 17,
              type: "sentence-completion",
              question: "Some scholars prefer the term '______' to emphasize specific economic systems rather than humanity collectively.",
              answer: "Capitalocene",
              explanation: "This alternative term is mentioned in paragraph 4"
            },
            {
              id: 18,
              type: "summary-completion",
              question: "Complete the summary:\n\nThe 'Great Acceleration' around _____ shows evidence including plutonium isotopes from _____, microplastics in _____, and elevated _____ and _____ levels from industrial agriculture.",
              answer: ["1950", "nuclear weapons testing", "sedimentary layers", "nitrogen", "phosphorus"],
              explanation: "All these details are found in paragraph 2"
            },
            {
              id: 19,
              type: "short-answer",
              question: "What term describes the formal marker geologists require for epoch designation? (Maximum 3 words)",
              answer: "golden spike",
              explanation: "Mentioned in paragraph 2, also known as GSSP"
            },
            {
              id: 20,
              type: "matching-information",
              question: "In which paragraph is 'Anthropocene anxiety' discussed?",
              answer: "Paragraph 7",
              explanation: "The seventh paragraph discusses psychological and cultural dimensions including 'Anthropocene anxiety'"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Test Set 2: Social Sciences & Culture",
      description: "Contemporary social issues, cultural studies, and demographic changes",
      category: "Academic",
      topics: ["Urban Development", "Digital Society", "Cultural Heritage"],
      year: "2024",
      totalTime: 60,
      totalQuestions: 40,
      passages: [
        {
          id: 4,
          title: "The 15-Minute City: Urban Planning for Post-Pandemic Life",
          difficulty: "medium",
          wordCount: 800,
          timeAllocation: 20,
          text: `The concept of the "15-minute city," where essential services lie within a quarter-hour walk or bike ride from residents' homes, has evolved from urban planning theory to practical policy in cities worldwide. Paris Mayor Anne Hidalgo championed this approach, transforming it from academic concept to concrete urban strategy. The COVID-19 pandemic accelerated adoption as lockdowns highlighted the importance of local amenities and community connections. This urban model promises reduced carbon emissions, enhanced quality of life, and stronger neighborhood bonds, yet faces criticism regarding feasibility, equity, and potential for increased segregation.

          Carlos Moreno, the Sorbonne professor who popularized the 15-minute city concept, identifies six essential urban functions: living, working, commerce, healthcare, education, and entertainment. His vision reimagines cities as collections of self-sufficient neighborhoods rather than zones segregated by function. This challenges a century of urban planning dominated by separation of residential, commercial, and industrial areas—a legacy of industrialization when factories' pollution necessitated distance from homes. Modern cities, Moreno argues, must abandon this obsolete model that generates excessive commuting, air pollution, and social isolation.

          Paris's implementation demonstrates both possibilities and challenges of the 15-minute city model. The city has created 1,000 kilometers of cycling paths, pedestrianized streets around schools, and transformed parking spaces into community gardens and outdoor dining areas. The Rue de Rivoli, once choked with traffic, now prioritizes cyclists and pedestrians. However, critics note that such transformations prove easier in Paris's already-dense, mixed-use neighborhoods than in sprawling cities built around automobile dependence. Gentrification concerns arise as improved neighborhoods attract wealthier residents, potentially displacing long-term inhabitants who inspired the improvements.

          Barcelona's "superblocks" offer another interpretation of localized urban living. By restricting through-traffic in nine-block areas, the city creates pedestrian-priority zones with reduced pollution and noise. Initial resistance from motorists and businesses fearing customer loss gave way to acceptance as retail sales increased and property values rose in pedestrianized areas. The city plans 503 superblocks by 2030, reclaiming 70% of street space currently devoted to cars. Melbourne's "20-minute neighborhoods" and Portland's "complete neighborhoods" represent variations adapted to different urban contexts and cultural expectations.

          Technology enables and complicates 15-minute city implementation. Digital platforms facilitate local commerce, remote work reduces commuting needs, and smart city sensors optimize resource distribution. However, algorithmic sorting of residents into neighborhood-based services might reinforce existing inequalities. Wealthier areas could attract better services while disadvantaged neighborhoods remain underserved, creating "15-minute cities" for some and "transit deserts" for others. The digital divide becomes more consequential when local services assume universal smartphone access and digital literacy.

          Economic implications extend beyond individual convenience to fundamental questions about urban productivity and innovation. Richard Florida's research on creative cities emphasizes how random encounters and diverse interactions drive innovation—precisely the serendipitous meetings that localized living might reduce. Counter-arguments suggest that stronger local communities foster different forms of creativity and that digital connectivity maintains global connections while strengthening local ones. The pandemic demonstrated remote work's viability, but also revealed "Zoom fatigue" and the irreplaceable value of in-person collaboration.

          Environmental benefits appear substantial but require comprehensive implementation to avoid unintended consequences. Reduced commuting could significantly lower carbon emissions, but only if cities simultaneously improve public transit for necessary longer journeys and prevent suburban sprawl as remote workers flee expensive city centers. Urban agriculture, community energy projects, and local circular economies could emerge in 15-minute cities, but require regulatory changes and cultural shifts. Critics warn that without regional coordination, 15-minute cities might simply export environmental problems to surrounding areas.

          The 15-minute city intersects with broader debates about post-pandemic urban futures, technological disruption, and climate action. Success requires more than infrastructure changes; it demands reconceptualizing urban life, economic activity, and social organization. As cities worldwide experiment with variations of this model, evidence accumulates about what works, what fails, and what adaptations different contexts require. The 15-minute city might not provide a universal template, but it offers a framework for imagining more sustainable, equitable, and livable urban futures.`,
          questions: [
            {
              id: 21,
              type: "multiple-choice",
              question: "According to Carlos Moreno, how many essential urban functions should a 15-minute city provide?",
              options: ["Four", "Five", "Six", "Seven"],
              answer: "Six",
              explanation: "Paragraph 2 lists the six functions: living, working, commerce, healthcare, education, and entertainment"
            },
            {
              id: 22,
              type: "matching-information",
              question: "Which city's model involves creating 'superblocks' by restricting through-traffic?",
              answer: "Barcelona",
              explanation: "Paragraph 4 specifically describes Barcelona's superblocks"
            },
            {
              id: 23,
              type: "true-false-not-given",
              question: "Paris has created over 1,500 kilometers of cycling paths.",
              options: ["True", "False", "Not Given"],
              answer: "False",
              explanation: "The passage states Paris created 1,000 kilometers, not over 1,500"
            },
            {
              id: 24,
              type: "sentence-completion",
              question: "Barcelona plans to reclaim ___% of street space currently devoted to cars by 2030.",
              answer: "70",
              explanation: "This specific percentage is mentioned in paragraph 4"
            },
            {
              id: 25,
              type: "summary-completion",
              question: "Complete the summary:\n\nThe 15-minute city concept aims to place essential services within a _____ walk or bike ride. Critics worry about increased _____ and potential _____.",
              answer: ["quarter-hour/15-minute", "segregation", "gentrification"],
              explanation: "These concerns are mentioned in the first and third paragraphs"
            }
          ]
        }
      ]
    },
    {
      id: 3,
      name: "Test Set 3: Health & Psychology",
      description: "Mental health, medical breakthroughs, and psychological research",
      category: "Academic",
      topics: ["Neuroscience", "Public Health", "Behavioral Psychology"],
      year: "2024",
      totalTime: 60,
      totalQuestions: 40,
      passages: [] // Would contain 3 full passages with questions
    },
    {
      id: 4,
      name: "Test Set 4: Technology & Innovation",
      description: "Quantum computing, cybersecurity, and space exploration",
      category: "Academic",
      topics: ["Quantum Computing", "Cybersecurity", "Space Technology"],
      year: "2025",
      totalTime: 60,
      totalQuestions: 40,
      passages: [] // Would contain 3 full passages with questions
    },
    {
      id: 5,
      name: "Test Set 5: Education & Learning",
      description: "Online education, cognitive development, and educational technology",
      category: "Academic",
      topics: ["E-Learning", "Cognitive Science", "Educational Policy"],
      year: "2024",
      totalTime: 60,
      totalQuestions: 40,
      passages: [] // Would contain 3 full passages with questions
    },
    {
      id: 6,
      name: "Test Set 6: Business & Economics",
      description: "Global trade, cryptocurrency, and sustainable business",
      category: "General Training",
      topics: ["Digital Economy", "Sustainable Business", "Global Markets"],
      year: "2024",
      totalTime: 60,
      totalQuestions: 40,
      passages: [] // Would contain 3 full passages with questions
    },
    {
      id: 7,
      name: "Test Set 7: Arts & Literature",
      description: "Contemporary art movements, digital media, and cultural criticism",
      category: "Academic",
      topics: ["Digital Art", "Literary Theory", "Cultural Studies"],
      year: "2024",
      totalTime: 60,
      totalQuestions: 40,
      passages: [] // Would contain 3 full passages with questions
    },
    {
      id: 8,
      name: "Test Set 8: Natural Sciences",
      description: "Biodiversity, ocean science, and conservation",
      category: "Academic",
      topics: ["Marine Biology", "Conservation", "Ecology"],
      year: "2025",
      totalTime: 60,
      totalQuestions: 40,
      passages: [] // Would contain 3 full passages with questions
    },
    {
      id: 9,
      name: "Test Set 9: History & Archaeology",
      description: "Recent archaeological discoveries and historical reinterpretations",
      category: "Academic",
      topics: ["Ancient Civilizations", "Modern History", "Archaeological Methods"],
      year: "2024",
      totalTime: 60,
      totalQuestions: 40,
      passages: [] // Would contain 3 full passages with questions
    },
    {
      id: 10,
      name: "Test Set 10: Media & Communication",
      description: "Social media impact, journalism, and communication theory",
      category: "General Training",
      topics: ["Social Media", "Digital Journalism", "Mass Communication"],
      year: "2024",
      totalTime: 60,
      totalQuestions: 40,
      passages: [] // Would contain 3 full passages with questions
    },
    {
      id: 11,
      name: "Test Set 11: Agriculture & Food",
      description: "Sustainable farming, food security, and agricultural technology",
      category: "Academic",
      topics: ["Vertical Farming", "Food Security", "Agricultural Innovation"],
      year: "2025",
      totalTime: 60,
      totalQuestions: 40,
      passages: [] // Would contain 3 full passages with questions
    },
    {
      id: 12,
      name: "Test Set 12: Transportation & Infrastructure",
      description: "Future mobility, smart cities, and infrastructure development",
      category: "General Training",
      topics: ["Electric Vehicles", "Smart Infrastructure", "Urban Mobility"],
      year: "2025",
      totalTime: 60,
      totalQuestions: 40,
      passages: [] // Would contain 3 full passages with questions
    }
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmitTest();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeRemaining]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = (testId: number) => {
    setSelectedTest(testId);
    setCurrentPassage(0);
    setUserAnswers({});
    setShowResults(false);
    setTimeRemaining(3600);
    setIsTimerActive(true);
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitTest = () => {
    setIsTimerActive(false);
    setShowResults(true);
    // Calculate score
    const test = testSets.find(t => t.id === selectedTest);
    if (!test) return;
    
    let correctAnswers = 0;
    test.passages.forEach(passage => {
      passage.questions.forEach(question => {
        const userAnswer = userAnswers[`${passage.id}-${question.id}`];
        if (Array.isArray(question.answer)) {
          if (JSON.stringify(userAnswer) === JSON.stringify(question.answer)) {
            correctAnswers++;
          }
        } else if (userAnswer === question.answer) {
          correctAnswers++;
        }
      });
    });
    
    // Store results or send to backend
    console.log(`Score: ${correctAnswers}/${test.totalQuestions}`);
  };

  const filteredTests = testSets.filter(test => test.category === selectedCategory);

  if (selectedTest) {
    const test = testSets.find(t => t.id === selectedTest);
    if (!test || test.passages.length === 0) {
      return (
        <div className="reading-practice-container">
          <div className="test-placeholder">
            <h2>Test Under Construction</h2>
            <p>This test set is being developed with comprehensive passages and questions.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setSelectedTest(null)}
            >
              Back to Test Selection
            </button>
          </div>
        </div>
      );
    }

    const currentPassageData = test.passages[currentPassage];

    return (
      <div className="reading-practice-container">
        {/* Test Header */}
        <div className="test-header">
          <div className="test-info">
            <h2>{test.name}</h2>
            <div className="test-meta">
              <span>Passage {currentPassage + 1} of {test.passages.length}</span>
              <span className="separator">|</span>
              <span>{currentPassageData.title}</span>
            </div>
          </div>
          
          <div className="test-controls">
            <div className="timer">
              <span className="timer-icon">⏱️</span>
              <span className={timeRemaining < 300 ? 'time-warning' : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setIsTimerActive(!isTimerActive)}
            >
              {isTimerActive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="test-content">
          {/* Passage Text */}
          <div className="passage-section">
            <div className="passage-header">
              <h3>{currentPassageData.title}</h3>
              <div className="passage-info">
                <span className="word-count">{currentPassageData.wordCount} words</span>
                <span className="difficulty-badge" data-level={currentPassageData.difficulty}>
                  {currentPassageData.difficulty}
                </span>
              </div>
            </div>
            <div className="passage-text">
              {currentPassageData.text.split('\n\n').map((paragraph, index) => (
                <p key={index} className="passage-paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Questions Section */}
          <div className="questions-section">
            <h3>Questions {currentPassageData.questions[0].id}-{currentPassageData.questions[currentPassageData.questions.length - 1].id}</h3>
            
            {currentPassageData.questions.map((question) => (
              <div key={question.id} className="question-block">
                <div className="question-header">
                  <span className="question-number">Question {question.id}</span>
                  <span className="question-type">{question.type.replace('-', ' ')}</span>
                </div>
                
                <p className="question-text">{question.question}</p>
                
                {/* Render different input types based on question type */}
                {question.type === 'multiple-choice' && question.options && (
                  <div className="options-list">
                    {question.options.map((option, idx) => (
                      <label key={idx} className="option-label">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={userAnswers[`${currentPassageData.id}-${question.id}`] === option}
                          onChange={(e) => handleAnswerChange(`${currentPassageData.id}-${question.id}`, e.target.value)}
                        />
                        <span className="option-text">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {question.type === 'true-false-not-given' && (
                  <div className="options-list">
                    {['True', 'False', 'Not Given'].map((option) => (
                      <label key={option} className="option-label">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={userAnswers[`${currentPassageData.id}-${question.id}`] === option}
                          onChange={(e) => handleAnswerChange(`${currentPassageData.id}-${question.id}`, e.target.value)}
                        />
                        <span className="option-text">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
                
                {(question.type === 'sentence-completion' || 
                  question.type === 'short-answer' ||
                  question.type === 'matching-information') && (
                  <input
                    type="text"
                    className="answer-input"
                    placeholder="Type your answer here..."
                    value={userAnswers[`${currentPassageData.id}-${question.id}`] || ''}
                    onChange={(e) => handleAnswerChange(`${currentPassageData.id}-${question.id}`, e.target.value)}
                  />
                )}
                
                {question.type === 'summary-completion' && (
                  <div className="summary-completion">
                    <textarea
                      className="answer-textarea"
                      placeholder="Complete the summary with words from the passage..."
                      value={userAnswers[`${currentPassageData.id}-${question.id}`] || ''}
                      onChange={(e) => handleAnswerChange(`${currentPassageData.id}-${question.id}`, e.target.value)}
                      rows={3}
                    />
                  </div>
                )}
                
                {/* Show answer feedback if test is completed */}
                {showResults && (
                  <div className={`answer-feedback ${userAnswers[`${currentPassageData.id}-${question.id}`] === question.answer ? 'correct' : 'incorrect'}`}>
                    <div className="feedback-header">
                      {userAnswers[`${currentPassageData.id}-${question.id}`] === question.answer ? '✓ Correct' : '✗ Incorrect'}
                    </div>
                    <div className="correct-answer">
                      Correct answer: {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}
                    </div>
                    {question.explanation && (
                      <div className="explanation">
                        Explanation: {question.explanation}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="test-navigation">
          <button 
            className="btn btn-secondary"
            onClick={() => setCurrentPassage(prev => Math.max(0, prev - 1))}
            disabled={currentPassage === 0}
          >
            Previous Passage
          </button>
          
          <div className="passage-indicators">
            {test.passages.map((_, idx) => (
              <button
                key={idx}
                className={`passage-indicator ${idx === currentPassage ? 'active' : ''} ${test.passages[idx].questions.some(q => userAnswers[`${test.passages[idx].id}-${q.id}`]) ? 'has-answers' : ''}`}
                onClick={() => setCurrentPassage(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          
          {currentPassage < test.passages.length - 1 ? (
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentPassage(prev => prev + 1)}
            >
              Next Passage
            </button>
          ) : (
            <button 
              className="btn btn-success"
              onClick={handleSubmitTest}
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="reading-practice-container">
      {/* Page Header */}
      <div className="page-header">
        <Link href="/skill-practice" className="back-link">
          ← Back to Skills
        </Link>
        <h1>{isTEF ? 'TEF Compréhension écrite Practice' : 'IELTS Reading Practice'}</h1>
        <p className="page-description">
          Comprehensive reading tests reflecting current IELTS formats and topics (2024-2025)
        </p>
      </div>

      {/* Category Selector */}
      <div className="category-selector">
        <button
          className={`category-btn ${selectedCategory === 'Academic' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('Academic')}
        >
          Academic
        </button>
        <button
          className={`category-btn ${selectedCategory === 'General Training' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('General Training')}
        >
          General Training
        </button>
      </div>

      {/* Test Sets Grid */}
      <div className="test-sets-grid">
        {filteredTests.map(test => (
          <div key={test.id} className="test-card">
            <div className="test-card-header">
              <h3>{test.name}</h3>
              <span className="test-year">{test.year}</span>
            </div>
            
            <p className="test-description">{test.description}</p>
            
            <div className="test-topics">
              {test.topics.map((topic, idx) => (
                <span key={idx} className="topic-badge">{topic}</span>
              ))}
            </div>
            
            <div className="test-stats">
              <div className="stat">
                <span className="stat-icon">📝</span>
                <span className="stat-value">{test.totalQuestions} questions</span>
              </div>
              <div className="stat">
                <span className="stat-icon">⏱️</span>
                <span className="stat-value">{test.totalTime} minutes</span>
              </div>
              <div className="stat">
                <span className="stat-icon">📊</span>
                <span className="stat-value">3 passages</span>
              </div>
            </div>
            
            <button 
              className="btn btn-primary start-test-btn"
              onClick={() => handleStartTest(test.id)}
            >
              Start Test
            </button>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="info-section">
        <h2>About IELTS Reading Test</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>Test Format</h3>
            <ul>
              <li>60 minutes duration</li>
              <li>40 questions total</li>
              <li>3 passages with increasing difficulty</li>
              <li>No extra transfer time</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>Question Types</h3>
            <ul>
              <li>Multiple choice</li>
              <li>True/False/Not Given</li>
              <li>Matching headings</li>
              <li>Sentence completion</li>
              <li>Summary completion</li>
              <li>Short-answer questions</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>Scoring</h3>
            <ul>
              <li>Band score 1-9</li>
              <li>39-40 correct = Band 9</li>
              <li>37-38 correct = Band 8.5</li>
              <li>35-36 correct = Band 8</li>
              <li>33-34 correct = Band 7.5</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}