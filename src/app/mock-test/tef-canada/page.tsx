'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Clock, Check, X, AlertCircle } from 'lucide-react';

interface TEFQuestion {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  question: string;
  options?: string[];
  answer?: string;
  points: number;
}

interface TEFSection {
  id: number;
  title: string;
  type: 'listening' | 'reading' | 'writing' | 'speaking';
  instructions: string;
  duration: number;
  questions: TEFQuestion[];
  audioUrl?: string;
  readingText?: string;
}

export default function TEFCanadaMockTestPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(10800); // 3 hours total
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Complete TEF Canada Mock Test Structure
  const sections: TEFSection[] = [
    {
      id: 1,
      title: "Compréhension Orale - Section A",
      type: 'listening',
      instructions: "Écoutez les conversations et répondez aux questions.",
      duration: 2400, // 40 minutes
      audioUrl: "/audio/tef-canada-listening.mp3",
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: "Dans la conversation, où la personne souhaite-t-elle aller?",
          options: ["À la bibliothèque", "Au centre commercial", "À l'université", "Au cinéma"],
          answer: "Au centre commercial",
          points: 5
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: "Quelle est la profession du locuteur principal?",
          options: ["Médecin", "Enseignant", "Ingénieur", "Avocat"],
          answer: "Enseignant",
          points: 5
        },
        {
          id: 3,
          type: 'true-false',
          question: "Le rendez-vous est prévu pour 14h30.",
          answer: "Vrai",
          points: 3
        },
        {
          id: 4,
          type: 'multiple-choice',
          question: "Combien coûte le billet d'entrée?",
          options: ["15$", "20$", "25$", "30$"],
          answer: "20$",
          points: 5
        },
        {
          id: 5,
          type: 'multiple-choice',
          question: "Quelle est la durée du trajet en métro?",
          options: ["10 minutes", "15 minutes", "20 minutes", "25 minutes"],
          answer: "15 minutes",
          points: 5
        }
      ]
    },
    {
      id: 2,
      title: "Compréhension Écrite - Section B",
      type: 'reading',
      instructions: "Lisez les textes et répondez aux questions.",
      duration: 3600, // 60 minutes
      readingText: `Les changements climatiques au Canada

Le Canada fait face à des défis importants liés aux changements climatiques. Les températures moyennes augmentent deux fois plus vite que la moyenne mondiale, particulièrement dans les régions nordiques. Cette situation affecte directement les communautés autochtones qui dépendent des écosystèmes arctiques pour leur mode de vie traditionnel.

Les provinces maritimes connaissent une augmentation de la fréquence et de l'intensité des tempêtes. Les infrastructures côtières sont menacées par l'érosion et la montée du niveau de la mer. Le gouvernement fédéral a mis en place un plan d'adaptation de 2 milliards de dollars pour aider les municipalités à faire face à ces défis.

Dans l'Ouest canadien, les feux de forêt deviennent plus fréquents et plus intenses. La saison des incendies s'allonge, mettant en péril les communautés forestières et affectant la qualité de l'air dans les grandes villes. La Colombie-Britannique a connu ses pires saisons de feux en 2017, 2018 et 2021.

L'agriculture canadienne doit aussi s'adapter. Si certaines régions bénéficient de saisons de croissance plus longues, d'autres font face à des sécheresses plus fréquentes. Les agriculteurs adoptent de nouvelles pratiques pour conserver l'eau et protéger les sols.`,
      questions: [
        {
          id: 6,
          type: 'multiple-choice',
          question: "Selon le texte, quelle région du Canada est la plus affectée par l'augmentation des températures?",
          options: ["Les provinces maritimes", "L'Ouest canadien", "Les régions nordiques", "Le centre du Canada"],
          answer: "Les régions nordiques",
          points: 6
        },
        {
          id: 7,
          type: 'multiple-choice',
          question: "Quel est le montant du plan d'adaptation du gouvernement fédéral?",
          options: ["1 milliard de dollars", "2 milliards de dollars", "3 milliards de dollars", "4 milliards de dollars"],
          answer: "2 milliards de dollars",
          points: 6
        },
        {
          id: 8,
          type: 'true-false',
          question: "Les agriculteurs canadiens ne voient que des aspects négatifs des changements climatiques.",
          answer: "Faux",
          points: 4
        },
        {
          id: 9,
          type: 'multiple-choice',
          question: "Quelles années la Colombie-Britannique a-t-elle connu ses pires saisons de feux?",
          options: [
            "2015, 2016 et 2019",
            "2016, 2017 et 2020",
            "2017, 2018 et 2021",
            "2018, 2019 et 2022"
          ],
          answer: "2017, 2018 et 2021",
          points: 6
        },
        {
          id: 10,
          type: 'multiple-choice',
          question: "Quel problème menace les infrastructures côtières?",
          options: [
            "Les tremblements de terre",
            "L'érosion et la montée du niveau de la mer",
            "La pollution maritime",
            "Le gel des ports"
          ],
          answer: "L'érosion et la montée du niveau de la mer",
          points: 6
        }
      ]
    },
    {
      id: 3,
      title: "Expression Écrite - Section C",
      type: 'writing',
      instructions: "Rédigez deux textes selon les consignes données.",
      duration: 3600, // 60 minutes
      questions: [
        {
          id: 11,
          type: 'fill-blank',
          question: "Tâche 1: Écrivez une lettre formelle (150-200 mots) à votre député pour exprimer votre préoccupation concernant l'environnement dans votre communauté.",
          points: 30
        },
        {
          id: 12,
          type: 'fill-blank',
          question: "Tâche 2: Rédigez un essai argumentatif (250-300 mots) sur le thème suivant: 'Le télétravail devrait-il devenir la norme dans le monde professionnel moderne?'",
          points: 40
        }
      ]
    },
    {
      id: 4,
      title: "Expression Orale - Section D",
      type: 'speaking',
      instructions: "Préparez et présentez vos réponses orales.",
      duration: 900, // 15 minutes
      questions: [
        {
          id: 13,
          type: 'fill-blank',
          question: "Partie A: Présentez-vous et parlez de vos objectifs professionnels (2 minutes)",
          points: 15
        },
        {
          id: 14,
          type: 'fill-blank',
          question: "Partie B: Décrivez une situation où vous avez dû résoudre un problème complexe (3 minutes)",
          points: 20
        }
      ]
    }
  ];

  // Timer effect
  useEffect(() => {
    if (!testStarted || testCompleted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testCompleted]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleAnswerSelect = (questionKey: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionKey]: answer
    }));
  };

  const handleNextQuestion = () => {
    const currentSectionData = sections[currentSection];
    if (currentQuestion < currentSectionData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestion(0);
    } else {
      handleSubmitTest();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (currentSection > 0) {
      const prevSection = sections[currentSection - 1];
      setCurrentSection(currentSection - 1);
      setCurrentQuestion(prevSection.questions.length - 1);
    }
  };

  const handleSubmitTest = () => {
    setTestCompleted(true);
    setShowResults(true);
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxScore = 0;
    
    sections.forEach(section => {
      section.questions.forEach(question => {
        maxScore += question.points;
        const questionKey = `section${section.id}-q${question.id}`;
        if (answers[questionKey] === question.answer) {
          totalScore += question.points;
        }
      });
    });
    
    return { totalScore, maxScore, percentage: Math.round((totalScore / maxScore) * 100) };
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">TEF Canada - Test Complet</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">À propos du test</h2>
            <p className="text-gray-600 mb-4">
              Le Test d'évaluation de français (TEF) Canada est reconnu par Immigration, Réfugiés et Citoyenneté Canada (IRCC) pour les demandes de citoyenneté canadienne et d'immigration économique.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Structure du test:</h3>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Compréhension orale:</strong> 40 minutes - 60 questions</li>
                <li>• <strong>Compréhension écrite:</strong> 60 minutes - 50 questions</li>
                <li>• <strong>Expression écrite:</strong> 60 minutes - 2 tâches</li>
                <li>• <strong>Expression orale:</strong> 15 minutes - 2 tâches</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>Note importante:</strong> Ce test de pratique simule les conditions réelles de l'examen TEF Canada. 
                    Une fois commencé, vous aurez 3 heures pour compléter toutes les sections.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleStartTest}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Commencer le test
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const { totalScore, maxScore, percentage } = calculateScore();
    const niveau = percentage >= 80 ? 'C1-C2' : percentage >= 60 ? 'B2' : percentage >= 40 ? 'B1' : 'A2';
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">Résultats du Test</h1>
          
          <div className="mb-6 text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">{percentage}%</div>
            <p className="text-gray-600">Score: {totalScore} / {maxScore} points</p>
            <p className="text-lg mt-2">Niveau estimé: <strong>{niveau}</strong></p>
          </div>
          
          <div className="space-y-4 mb-8">
            {sections.map(section => {
              const sectionScore = section.questions.reduce((acc, q) => {
                const key = `section${section.id}-q${q.id}`;
                return acc + (answers[key] === q.answer ? q.points : 0);
              }, 0);
              const sectionMax = section.questions.reduce((acc, q) => acc + q.points, 0);
              
              return (
                <div key={section.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{section.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {sectionScore} / {sectionMax} points
                    </span>
                    <span className="text-sm font-medium">
                      {Math.round((sectionScore / sectionMax) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(sectionScore / sectionMax) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Refaire le test
            </button>
            <a 
              href="/tef-practice"
              className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition text-center"
            >
              Plus d'exercices
            </a>
          </div>
        </div>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];
  const currentQuestionData = currentSectionData.questions[currentQuestion];
  const questionKey = `section${currentSectionData.id}-q${currentQuestionData.id}`;
  const progress = ((currentSection * 10 + currentQuestion + 1) / (sections.length * 10)) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold">TEF Canada</h1>
              <span className="text-sm text-gray-600">
                {currentSectionData.title}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-orange-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono font-semibold">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Section Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{currentSectionData.title}</h2>
            <p className="text-gray-600">{currentSectionData.instructions}</p>
          </div>

          {/* Audio Player for Listening Section */}
          {currentSectionData.type === 'listening' && currentSectionData.audioUrl && (
            <div className="mb-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleAudio}
                  className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    {isPlaying ? 'Écoute en cours...' : 'Cliquez pour écouter'}
                  </span>
                </div>
              </div>
              <audio ref={audioRef} src={currentSectionData.audioUrl} />
            </div>
          )}

          {/* Reading Text */}
          {currentSectionData.type === 'reading' && currentSectionData.readingText && (
            <div className="mb-6 bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto">
              <div className="prose max-w-none">
                {currentSectionData.readingText.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Question */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                Question {currentQuestion + 1}/{currentSectionData.questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {currentQuestionData.points} points
              </span>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">{currentQuestionData.question}</h3>

            {/* Answer Options */}
            {currentQuestionData.type === 'multiple-choice' && currentQuestionData.options && (
              <div className="space-y-3">
                {currentQuestionData.options.map((option, index) => (
                  <label 
                    key={index}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                      answers[questionKey] === option 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={questionKey}
                      value={option}
                      checked={answers[questionKey] === option}
                      onChange={() => handleAnswerSelect(questionKey, option)}
                      className="sr-only"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestionData.type === 'true-false' && (
              <div className="flex gap-4">
                {['Vrai', 'Faux'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(questionKey, option)}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                      answers[questionKey] === option
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {currentQuestionData.type === 'fill-blank' && (
              <textarea
                value={answers[questionKey] || ''}
                onChange={(e) => handleAnswerSelect(questionKey, e.target.value)}
                placeholder="Écrivez votre réponse ici..."
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                rows={currentSectionData.type === 'writing' ? 10 : 4}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentSection === 0 && currentQuestion === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                currentSection === 0 && currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Précédent
            </button>

            <div className="text-sm text-gray-600">
              Section {currentSection + 1} sur {sections.length}
            </div>

            {currentSection === sections.length - 1 && 
             currentQuestion === currentSectionData.questions.length - 1 ? (
              <button
                onClick={handleSubmitTest}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Terminer le test
                <Check className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Suivant
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}