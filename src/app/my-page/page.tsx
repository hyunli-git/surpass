'use client';

export default function MyPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
            My Dashboard
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            Track your progress and improve your test performance
          </p>
        </div>

        {/* Profile Card */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
          padding: '24px', 
          marginBottom: '24px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              backgroundColor: '#dbeafe', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              👤
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 5px 0' }}>
                Sarah Johnson
              </h2>
              <p style={{ color: '#6b7280', margin: '0 0 10px 0' }}>
                sarah.johnson@email.com
              </p>
              <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                Target: IELTS Band 7.5 • Joined: Jan 15, 2024
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginBottom: '30px' 
        }}>
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
            padding: '20px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#dcfce7', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🎯
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>48</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Attempts</div>
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
            padding: '20px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#dbeafe', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                📊
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>6.8</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Average Score</div>
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
            padding: '20px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#fef3c7', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🏆
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>8.0</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Best Score</div>
              </div>
            </div>
          </div>

          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
            padding: '20px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#e9d5ff', 
                borderRadius: '8px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                ⏱️
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>72h</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Study Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Language Test Results */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
          padding: '24px' 
        }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
            🏴 Language Test Results
          </h3>
          
          {/* English IELTS */}
          <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '16px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 5px 0' }}>
                  🇺🇸 English - IELTS
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Latest test: Sep 1, 2024
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>7.5</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Band 7.5</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Reading</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>8.0</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Listening</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>7.5</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Writing</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>7.0</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Speaking</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>7.5</div>
              </div>
            </div>
          </div>

          {/* French TEF */}
          <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '20px', 
            marginBottom: '16px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 5px 0' }}>
                  🇫🇷 French - TEF Canada
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Latest test: Aug 30, 2024
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>315</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>B2 Level</div>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Reading</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>280</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Listening</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>305</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Writing</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>325</div>
              </div>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Speaking</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>350</div>
              </div>
            </div>
          </div>

          {/* Korean OPIc */}
          <div style={{ 
            border: '1px solid #e5e7eb', 
            borderRadius: '8px', 
            padding: '20px' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 5px 0' }}>
                  🇰🇷 Korean - OPIc
                </h4>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Latest test: Aug 10, 2024
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>IH</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Intermediate High</div>
              </div>
            </div>
            
            <div style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Speaking</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>Intermediate High</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}