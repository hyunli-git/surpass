'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, Clock } from 'lucide-react';

interface TEFQuestion {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'matching';
  question: string;
  options?: string[];
  answer?: string;
}

interface TEFSection {
  id: number;
  title: string;
  audioUrl: string;
  duration: number;
  questions: TEFQuestion[];
  transcript: string;
}

export default function MockTEFListeningPage() {
  const t = useTranslations();
  const [currentSection, setCurrentSection] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes
  const audioRef = useRef<HTMLAudioElement>(null);

  // Mock TEF Listening sections
  const sections: TEFSection[] = [
    {
      id: 1,
      title: "Section A - Conversations courtes",
      audioUrl: "/mock-audio/tef-conversation-1.mp3",
      duration: 180,
      transcript: `Dialogue 1:
- Bonjour madame, je voudrais réserver une table pour ce soir.
- Bonsoir monsieur. Pour combien de personnes?
- Nous serons quatre personnes.
- À quelle heure souhaitez-vous dîner?
- Vers 19h30 si c'est possible.
- Parfait, j'ai une table disponible à 19h30. À quel nom?
- Monsieur Dubois.
- Très bien monsieur Dubois, votre table est réservée.`,
      questions: [
        {
          id: 1,
          type: 'multiple-choice',
          question: "Combien de personnes vont dîner au restaurant?",
          options: ["Deux", "Trois", "Quatre", "Cinq"],
          answer: "Quatre"
        },
        {
          id: 2,
          type: 'multiple-choice',
          question: "À quelle heure la réservation est-elle faite?",
          options: ["19h00", "19h30", "20h00", "20h30"],
          answer: "19h30"
        }
      ]
    },
    {
      id: 2,
      title: "Section B - Monologue informatif",
      audioUrl: "/mock-audio/tef-monologue-1.mp3",
      duration: 240,
      transcript: `Le système de transport public de Montréal comprend le métro, les autobus et les trains de banlieue. Le métro compte quatre lignes principales: verte, orange, jaune et bleue. Il fonctionne de 5h30 à 1h du matin en semaine et jusqu'à 1h30 le samedi. Le dimanche, le service se termine à 1h. Les tarifs varient selon la zone et le type de transport utilisé. Un titre mensuel coûte environ 88 dollars canadiens pour un adulte.`,
      questions: [
        {
          id: 3,
          type: 'multiple-choice',
          question: "Combien de lignes de métro y a-t-il à Montréal?",
          options: ["Trois", "Quatre", "Cinq", "Six"],
          answer: "Quatre"
        },
        {
          id: 4,
          type: 'true-false',
          question: "Le métro fonctionne jusqu'à 1h30 tous les jours de la semaine.",
          answer: "Faux"
        }
      ]
    }
  ];

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [`${currentSection}-${questionId}`]: answer
    }));
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const currentSectionData = sections[currentSection];
  const currentQuestionData = currentSectionData.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50">
      {/* TEF Header */}
      <div className="bg-red-600 text-white px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="bg-white text-red-600 px-3 py-1 rounded font-bold text-sm">
              TEF Canada
            </div>
            <h1 className="text-xl font-semibold">Test d'Évaluation de Français</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-yellow-200">
              <Clock className="w-5 h-5" />
              <span className="text-lg font-mono">{formatTime(timeRemaining)}</span>
            </div>
            <div className="text-sm">
              Section {currentSection + 1} sur {sections.length}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Left Panel - Audio and Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {currentSectionData.title}
              </h2>
              <div className="text-sm text-gray-600 mb-4">
                Durée: {Math.floor(currentSectionData.duration / 60)} minutes {currentSectionData.duration % 60} secondes
              </div>
            </div>

            {/* Audio Controls */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={toggleAudio}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Écouter'}
                </button>
                <Volume2 className="w-5 h-5 text-gray-600" />
                <div className="text-sm text-gray-600">
                  Cliquez pour écouter l'enregistrement
                </div>
              </div>
              
              <audio
                ref={audioRef}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onEnded={() => setIsPlaying(false)}
              >
                <source src={currentSectionData.audioUrl} type="audio/mpeg" />
              </audio>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / currentSectionData.duration) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Instructions</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Écoutez attentivement l'enregistrement</li>
                <li>• Vous pouvez écouter chaque section plusieurs fois</li>
                <li>• Répondez aux questions dans l'ordre</li>
                <li>• Vous pouvez modifier vos réponses</li>
              </ul>
            </div>

            {/* Transcript (hidden by default) */}
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                Afficher la transcription (à des fins de démonstration)
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                <pre className="whitespace-pre-wrap font-sans">{currentSectionData.transcript}</pre>
              </div>
            </details>
          </div>

          {/* Right Panel - Questions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                Question {currentQuestion + 1} sur {currentSectionData.questions.length}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentQuestion(Math.min(currentSectionData.questions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === currentSectionData.questions.length - 1}
                  className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-lg font-medium text-gray-800">
                {currentQuestionData.question}
              </div>

              {currentQuestionData.type === 'multiple-choice' && currentQuestionData.options && (
                <div className="space-y-2">
                  {currentQuestionData.options.map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${currentSectionData.id}-${currentQuestionData.id}`}
                        value={option}
                        checked={answers[`${currentSection}-${currentQuestionData.id}`] === option}
                        onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                        className="mr-3"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestionData.type === 'true-false' && (
                <div className="space-y-2">
                  {['Vrai', 'Faux'].map((option) => (
                    <label
                      key={option}
                      className="flex items-center p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`question-${currentSectionData.id}-${currentQuestionData.id}`}
                        value={option}
                        checked={answers[`${currentSection}-${currentQuestionData.id}`] === option}
                        onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                        className="mr-3"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Question Navigation */}
            <div className="mt-8 pt-6 border-t">
              <div className="grid grid-cols-5 gap-2">
                {currentSectionData.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`aspect-square rounded-lg text-sm font-medium transition-colors ${
                      index === currentQuestion
                        ? 'bg-red-600 text-white'
                        : answers[`${currentSection}-${currentSectionData.questions[index].id}`]
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center mt-6 p-4 bg-white rounded-lg shadow-lg">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="flex items-center gap-2 px-6 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Section précédente
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-600">Progrès du test</div>
            <div className="flex gap-2 mt-1">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index === currentSection ? 'bg-red-600' : index < currentSection ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {currentSection < sections.length - 1 ? (
            <button
              onClick={() => {
                setCurrentSection(currentSection + 1);
                setCurrentQuestion(0);
              }}
              className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Section suivante
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Terminer le test
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}