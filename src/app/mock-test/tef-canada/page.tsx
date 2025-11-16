'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Clock, Check, AlertCircle } from 'lucide-react';
import '../../../app/globals.css';

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
      <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
        <div className="container container-narrow">
          <div className="test-landing-card">
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>TEF Canada - Test Complet</h1>
            
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '40px' }}>
              Le Test d&apos;évaluation de français (TEF) Canada est reconnu par Immigration, Réfugiés et Citoyenneté Canada (IRCC) pour les demandes de citoyenneté canadienne et d&apos;immigration économique.
            </p>
            
            <div className="instruction-card">
              <h3 style={{ marginBottom: '16px' }}>Structure du test:</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>• <strong style={{ color: 'var(--text-primary)' }}>Compréhension orale:</strong> 40 minutes - 60 questions</li>
                <li style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>• <strong style={{ color: 'var(--text-primary)' }}>Compréhension écrite:</strong> 60 minutes - 50 questions</li>
                <li style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>• <strong style={{ color: 'var(--text-primary)' }}>Expression écrite:</strong> 60 minutes - 2 tâches</li>
                <li style={{ color: 'var(--text-secondary)' }}>• <strong style={{ color: 'var(--text-primary)' }}>Expression orale:</strong> 15 minutes - 2 tâches</li>
              </ul>
            </div>
            
            <div className="alert-box" style={{ marginBottom: '32px' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: 'var(--accent-amber)', flexShrink: 0 }} />
              <p>
                <strong>Note importante:</strong> Ce test de pratique simule les conditions réelles de l&apos;examen TEF Canada. 
                Une fois commencé, vous aurez 3 heures pour compléter toutes les sections.
              </p>
            </div>
            
            <button 
              onClick={handleStartTest}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Commencer le test
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const { totalScore, maxScore, percentage } = calculateScore();
    const niveau = percentage >= 80 ? 'C1-C2' : percentage >= 60 ? 'B2' : percentage >= 40 ? 'B1' : 'A2';
    
    return (
      <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
        <div className="container container-narrow">
          <div className="results-card">
            <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>Résultats du Test</h1>
            
            <div className="score-display">
              <div className="score-percentage">{percentage}%</div>
              <p className="score-details">Score: {totalScore} / {maxScore} points</p>
              <p className="score-level">Niveau estimé: <strong>{niveau}</strong></p>
            </div>
            
            <div style={{ marginBottom: '32px' }}>
              {sections.map(section => {
                const sectionScore = section.questions.reduce((acc, q) => {
                  const key = `section${section.id}-q${q.id}`;
                  return acc + (answers[key] === q.answer ? q.points : 0);
                }, 0);
                const sectionMax = section.questions.reduce((acc, q) => acc + q.points, 0);
                
                return (
                  <div key={section.id} className="progress-item" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontWeight: '600' }}>{section.title}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {sectionScore} / {sectionMax} ({Math.round((sectionScore / sectionMax) * 100)}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${(sectionScore / sectionMax) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button 
                onClick={() => window.location.reload()}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Refaire le test
              </button>
              <a 
                href="/tef-practice"
                className="btn"
                style={{ flex: 1, textAlign: 'center' }}
              >
                Plus d&apos;exercices
              </a>
            </div>
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
    <div className="mock-test-container">
      {/* Header */}
      <div className="mock-test-header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '4px' }}>TEF Canada</h1>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{currentSectionData.title}</p>
            </div>
            <div className="timer-display">
              <Clock style={{ width: '18px', height: '18px' }} />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
        <div className="question-card">
          {/* Audio Player for Listening Section */}
          {currentSectionData.type === 'listening' && currentSectionData.audioUrl && (
            <div className="audio-player">
              <button
                onClick={toggleAudio}
                className="btn btn-primary"
                style={{ padding: '12px', borderRadius: '50%' }}
              >
                {isPlaying ? <Pause /> : <Play />}
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Volume2 style={{ width: '20px', height: '20px', color: 'var(--accent-blue)' }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {isPlaying ? 'Écoute en cours...' : 'Cliquez pour écouter'}
                </span>
              </div>
              <audio ref={audioRef} src={currentSectionData.audioUrl} />
            </div>
          )}

          {/* Reading Text */}
          {currentSectionData.type === 'reading' && currentSectionData.readingText && (
            <div className="reading-passage">
              {currentSectionData.readingText.split('\n\n').map((paragraph, index) => (
                <p key={index} style={{ marginBottom: '16px' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {/* Question */}
          <div className="question-content">
            <div className="question-header">
              <span className="question-badge">
                Question {currentQuestion + 1}/{currentSectionData.questions.length}
              </span>
              <span className="points-badge">
                {currentQuestionData.points} points
              </span>
            </div>
            
            <h3 className="question-text">{currentQuestionData.question}</h3>

            {/* Answer Options */}
            {currentQuestionData.type === 'multiple-choice' && currentQuestionData.options && (
              <div className="answer-options">
                {currentQuestionData.options.map((option, index) => (
                  <label 
                    key={index}
                    className={`answer-option ${answers[questionKey] === option ? 'selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name={questionKey}
                      value={option}
                      checked={answers[questionKey] === option}
                      onChange={() => handleAnswerSelect(questionKey, option)}
                      style={{ display: 'none' }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}

            {currentQuestionData.type === 'true-false' && (
              <div className="true-false-options">
                {['Vrai', 'Faux'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(questionKey, option)}
                    className={`btn ${answers[questionKey] === option ? 'btn-primary' : ''}`}
                    style={{ flex: 1 }}
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
                className="text-input"
                rows={currentSectionData.type === 'writing' ? 10 : 4}
                style={{ width: '100%', resize: 'vertical' }}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="question-navigation">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentSection === 0 && currentQuestion === 0}
              className="btn"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                opacity: currentSection === 0 && currentQuestion === 0 ? 0.5 : 1
              }}
            >
              <ChevronLeft style={{ width: '20px', height: '20px' }} />
              Précédent
            </button>

            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Section {currentSection + 1} sur {sections.length}
            </span>

            {currentSection === sections.length - 1 && 
             currentQuestion === currentSectionData.questions.length - 1 ? (
              <button
                onClick={handleSubmitTest}
                className="btn btn-success"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Terminer le test
                <Check style={{ width: '20px', height: '20px' }} />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Suivant
                <ChevronRight style={{ width: '20px', height: '20px' }} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}