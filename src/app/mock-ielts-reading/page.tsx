"use client";

import { useState, useEffect } from 'react';

export default function IELTSReadingMockup() {
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes
  const [currentPassage, setCurrentPassage] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* IELTS Header - Exact replica */}
      <div style={{
        backgroundColor: '#0066cc',
        color: 'white',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        fontWeight: 'bold'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>IELTS Academic Reading Test</div>
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.2)', 
            padding: '4px 8px', 
            borderRadius: '4px' 
          }}>
            Passage {currentPassage} of 3
          </div>
        </div>
        <div style={{
          backgroundColor: timeRemaining < 300 ? '#ff4444' : '#28a745',
          padding: '4px 12px',
          borderRadius: '4px',
          fontSize: '16px'
        }}>
          Time: {formatTime(timeRemaining)}
        </div>
      </div>

      {/* Navigation Bar */}
      <div style={{
        backgroundColor: '#e6f2ff',
        padding: '10px 20px',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        gap: '10px',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setCurrentPassage(1)}
          style={{
            padding: '6px 12px',
            backgroundColor: currentPassage === 1 ? '#0066cc' : 'white',
            color: currentPassage === 1 ? 'white' : '#333',
            border: '1px solid #0066cc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Passage 1
        </button>
        <button
          onClick={() => setCurrentPassage(2)}
          style={{
            padding: '6px 12px',
            backgroundColor: currentPassage === 2 ? '#0066cc' : 'white',
            color: currentPassage === 2 ? 'white' : '#333',
            border: '1px solid #0066cc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Passage 2
        </button>
        <button
          onClick={() => setCurrentPassage(3)}
          style={{
            padding: '6px 12px',
            backgroundColor: currentPassage === 3 ? '#0066cc' : 'white',
            color: currentPassage === 3 ? 'white' : '#333',
            border: '1px solid #0066cc',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Passage 3
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsReviewMode(!isReviewMode)}
            style={{
              padding: '6px 12px',
              backgroundColor: isReviewMode ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Review & Submit
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
        {/* Left Panel - Reading Passage */}
        <div style={{
          flex: '1',
          backgroundColor: 'white',
          padding: '20px',
          borderRight: '1px solid #ddd',
          overflow: 'auto'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '10px',
            marginBottom: '20px',
            borderLeft: '4px solid #0066cc',
            fontSize: '12px',
            color: '#666'
          }}>
            <strong>Instructions:</strong> You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage {currentPassage} below.
          </div>

          <h2 style={{
            color: '#0066cc',
            fontSize: '18px',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>
            Reading Passage {currentPassage}
          </h2>

          <h3 style={{
            fontSize: '16px',
            marginBottom: '20px',
            color: '#333'
          }}>
            {currentPassage === 1 && "The History of Urban Transportation"}
            {currentPassage === 2 && "Renewable Energy Technologies"}
            {currentPassage === 3 && "The Impact of Social Media on Society"}
          </h3>

          <div style={{
            lineHeight: '1.6',
            fontSize: '14px',
            color: '#333'
          }}>
            {currentPassage === 1 && (
              <>
                <p><strong>A</strong> The transformation of urban transportation systems has been one of the most significant developments in modern city planning. From horse-drawn carriages to electric vehicles, the evolution of how people move within cities reflects broader technological, environmental, and social changes.</p>

                <p><strong>B</strong> In the early 19th century, most urban transport relied on walking or horse-drawn vehicles. The introduction of omnibuses in the 1820s marked the first attempt at organized public transport. These horse-drawn coaches followed fixed routes and schedules, laying the groundwork for modern public transit systems.</p>

                <p><strong>C</strong> The railway revolution of the mid-1800s transformed long-distance travel, and entrepreneurs soon recognized its potential for urban transport. The world's first underground railway, the Metropolitan Railway in London, opened in 1863. Despite initial public skepticism about traveling in underground tunnels, the system proved enormously popular.</p>

                <p><strong>D</strong> Electric trams emerged in the 1880s as a cleaner alternative to steam-powered trains. Cities like Berlin, Richmond, and Melbourne pioneered electric tram networks that could navigate city streets more flexibly than rail systems. The electric tram represented a significant technological leap in urban mobility.</p>

                <p><strong>E</strong> The 20th century brought the automobile, fundamentally reshaping urban landscapes. Initially luxury items, cars became mass-market products after Henry Ford's assembly line innovations reduced manufacturing costs. By the 1950s, many Western cities were redesigning their infrastructure around private vehicle ownership.</p>

                <p><strong>F</strong> However, the automobile's dominance created new challenges. Traffic congestion, air pollution, and urban sprawl became pressing concerns by the 1970s. Cities began reconsidering public transport investments, leading to the development of modern metro systems and bus rapid transit networks.</p>
              </>
            )}

            {currentPassage === 2 && (
              <>
                <p><strong>A</strong> Renewable energy represents the fastest-growing sector in global electricity generation. Wind and solar costs have plummeted, making them competitive with traditional fossil fuels in many regions. This transformation reflects decades of technological advancement and supportive policies.</p>

                <p><strong>B</strong> Solar photovoltaic technology has experienced dramatic improvements in efficiency and cost reduction. Modern solar panels can convert over 20% of sunlight into electricity, compared to less than 10% in early commercial systems. Manufacturing scale economies have reduced costs by over 80% since 2010.</p>

                <p><strong>C</strong> Wind energy has similarly benefited from technological innovation. Modern wind turbines are significantly larger and more efficient than their predecessors. Offshore wind farms can now operate in deeper waters, accessing stronger and more consistent wind resources.</p>

                <p><strong>D</strong> Energy storage remains a critical challenge for renewable energy expansion. Battery technology improvements have reduced lithium-ion costs substantially, yet large-scale storage solutions remain expensive. Research continues into alternative storage technologies, including compressed air and hydrogen systems.</p>

                <p><strong>E</strong> Grid integration presents additional complexities. Traditional power grids were designed for predictable, centralized fossil fuel plants, not intermittent renewable sources. Smart grid technologies must balance supply and demand in real-time, automatically switching between renewable sources and backup systems.</p>

                <p><strong>F</strong> The economic implications extend beyond energy markets. The International Renewable Energy Agency estimates that renewable energy could create millions of jobs globally while displacing positions in fossil fuel industries. This transition requires massive retraining programs for affected workers.</p>
              </>
            )}

            {currentPassage === 3 && (
              <>
                <p><strong>A</strong> Social media platforms have fundamentally altered how people communicate, consume information, and interact with society. These digital networks, connecting billions of users worldwide, represent one of the most significant communication revolutions in human history.</p>

                <p><strong>B</strong> The democratization of information sharing has empowered individuals to become content creators and news sources. Anyone with internet access can potentially reach global audiences, bypassing traditional media gatekeepers. This shift has enabled grassroots movements and provided platforms for marginalized voices.</p>

                <p><strong>C</strong> However, this democratization has also facilitated the spread of misinformation and conspiracy theories. The algorithms that determine content visibility often prioritize engagement over accuracy, potentially amplifying sensational or misleading information. Fact-checking efforts struggle to keep pace with the volume of content generated daily.</p>

                <p><strong>D</strong> Social media's impact on mental health, particularly among young people, has become a growing concern. Studies suggest correlations between heavy social media use and increased rates of anxiety, depression, and body image issues. The constant comparison with others' curated online personas can negatively affect self-esteem.</p>

                <p><strong>E</strong> Privacy concerns have intensified as social media companies collect vast amounts of personal data. This information is used to target advertising and can be shared with third parties, raising questions about user consent and data protection. High-profile data breaches have highlighted vulnerabilities in how personal information is stored and protected.</p>

                <p><strong>F</strong> Despite these challenges, social media continues to provide valuable benefits. It enables people to maintain connections across geographic distances, facilitates professional networking, and provides platforms for creative expression and community building around shared interests.</p>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Questions */}
        <div style={{
          width: '400px',
          backgroundColor: '#fafafa',
          padding: '20px',
          overflow: 'auto'
        }}>
          <h3 style={{
            color: '#0066cc',
            fontSize: '16px',
            marginBottom: '15px',
            borderBottom: '2px solid #0066cc',
            paddingBottom: '5px'
          }}>
            Questions {currentPassage === 1 ? '1-13' : currentPassage === 2 ? '14-26' : '27-40'}
          </h3>

          {/* Question 1-3: Multiple Choice */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{
              backgroundColor: '#e6f3ff',
              padding: '8px 12px',
              marginBottom: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#0066cc'
            }}>
              Questions {currentPassage === 1 ? '1-3' : currentPassage === 2 ? '14-16' : '27-29'}: Choose the correct letter, A, B, C or D.
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>
                {currentPassage === 1 ? '1' : currentPassage === 2 ? '14' : '27'}. According to the passage, the first underground railway
              </div>
              <div style={{ paddingLeft: '10px' }}>
                {['A', 'B', 'C', 'D'].map((option) => (
                  <label key={option} style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name={`q${currentPassage === 1 ? '1' : currentPassage === 2 ? '14' : '27'}`}
                      value={option}
                      onChange={(e) => handleAnswerChange(`q${currentPassage === 1 ? '1' : currentPassage === 2 ? '14' : '27'}`, e.target.value)}
                      style={{ marginRight: '8px' }}
                    />
                    {option}. {option === 'A' ? 'was initially unpopular with the public' : 
                         option === 'B' ? 'carried fewer passengers than expected' :
                         option === 'C' ? 'was constructed in Berlin' : 'opened in the 1880s'}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '13px' }}>
                {currentPassage === 1 ? '2' : currentPassage === 2 ? '15' : '28'}. Electric trams were introduced because they were
              </div>
              <div style={{ paddingLeft: '10px' }}>
                {['A', 'B', 'C', 'D'].map((option) => (
                  <label key={option} style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name={`q${currentPassage === 1 ? '2' : currentPassage === 2 ? '15' : '28'}`}
                      value={option}
                      onChange={(e) => handleAnswerChange(`q${currentPassage === 1 ? '2' : currentPassage === 2 ? '15' : '28'}`, e.target.value)}
                      style={{ marginRight: '8px' }}
                    />
                    {option}. {option === 'A' ? 'faster than horse-drawn transport' : 
                         option === 'B' ? 'cleaner than steam-powered trains' :
                         option === 'C' ? 'cheaper to manufacture' : 'easier to operate'}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Questions: True/False/Not Given */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{
              backgroundColor: '#e6f3ff',
              padding: '8px 12px',
              marginBottom: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#0066cc'
            }}>
              Questions {currentPassage === 1 ? '4-7' : currentPassage === 2 ? '17-20' : '30-33'}: TRUE/FALSE/NOT GIVEN
            </div>

            {[
              'Henry Ford invented the automobile',
              'The 1970s saw increased investment in public transport',
              'Modern cities prioritize private vehicle ownership',
              'Traffic congestion was a problem in the 1950s'
            ].map((statement, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '13px' }}>
                  {currentPassage === 1 ? (4 + index) : currentPassage === 2 ? (17 + index) : (30 + index)}. {statement}
                </div>
                <div style={{ paddingLeft: '10px' }}>
                  {['TRUE', 'FALSE', 'NOT GIVEN'].map((option) => (
                    <label key={option} style={{
                      display: 'inline-block',
                      marginRight: '15px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}>
                      <input
                        type="radio"
                        name={`q${currentPassage === 1 ? (4 + index) : currentPassage === 2 ? (17 + index) : (30 + index)}`}
                        value={option}
                        onChange={(e) => handleAnswerChange(`q${currentPassage === 1 ? (4 + index) : currentPassage === 2 ? (17 + index) : (30 + index)}`, e.target.value)}
                        style={{ marginRight: '5px' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Questions: Sentence Completion */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{
              backgroundColor: '#e6f3ff',
              padding: '8px 12px',
              marginBottom: '10px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#0066cc'
            }}>
              Questions {currentPassage === 1 ? '8-13' : currentPassage === 2 ? '21-26' : '34-40'}: Complete the sentences with NO MORE THAN TWO WORDS from the passage.
            </div>

            {[
              'Omnibuses were the first form of _______ public transport.',
              'The Metropolitan Railway opened in _______.',
              'Electric trams could navigate _______ more flexibly than rail systems.',
              'Ford&apos;s assembly line _______ manufacturing costs.',
              'By the 1970s, cities faced problems with _______ and air pollution.',
              'Modern transport systems now include _______ transit networks.'
            ].map((sentence, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '13px', marginBottom: '5px' }}>
                  <strong>{currentPassage === 1 ? (8 + index) : currentPassage === 2 ? (21 + index) : (34 + index)}.</strong> {sentence}
                </div>
                <input
                  type="text"
                  style={{
                    width: '150px',
                    padding: '4px 8px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                    fontSize: '12px'
                  }}
                  onChange={(e) => handleAnswerChange(`q${currentPassage === 1 ? (8 + index) : currentPassage === 2 ? (21 + index) : (34 + index)}`, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Answer Summary */}
          <div style={{
            position: 'sticky',
            bottom: '0',
            backgroundColor: 'white',
            padding: '15px',
            borderTop: '1px solid #ddd',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
              Answered: {Object.keys(answers).length}/40 questions
            </div>
            <button style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              Submit Test
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}