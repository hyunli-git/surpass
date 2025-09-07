'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { User } from '@supabase/supabase-js';

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    targetTest: 'IELTS',
    targetScore: ''
  });

  const [editProfile, setEditProfile] = useState({ ...profile });

  useEffect(() => {
    const getProfile = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          window.location.href = '/login';
          return;
        }
        
        setUser(session.user);
        
        // Fetch user profile from database
        const { data: userProfile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', session.user.email)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching profile:', error);
          return;
        }
        
        if (userProfile) {
          setProfile({
            name: userProfile.name || '',
            email: userProfile.email || session.user.email || '',
            targetTest: userProfile.target_test_type || 'IELTS',
            targetScore: userProfile.target_score || ''
          });
        } else {
          // Create new profile if doesn't exist
          setProfile({
            name: session.user.user_metadata?.name || '',
            email: session.user.email || '',
            targetTest: 'IELTS',
            targetScore: ''
          });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, []);

  const handleEdit = () => {
    setEditProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          email: user.email,
          name: editProfile.name,
          target_test_type: editProfile.targetTest.toLowerCase(),
          target_score: editProfile.targetScore,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving profile:', error);
        alert('Error saving profile. Please try again.');
        return;
      }

      setProfile({ ...editProfile });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditProfile({ ...profile });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '18px',
        color: '#6b7280' 
      }}>
        Loading your profile...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <style jsx>{`
        .edit-button:hover {
          background-color: #2563eb !important;
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
        .save-button:hover {
          background-color: #059669 !important;
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
        .cancel-button:hover {
          background-color: #4b5563 !important;
          transform: translateY(-1px);
          transition: all 0.2s ease;
        }
        .form-input:focus {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
      `}</style>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
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
              <div style={{ flex: 1 }}>
                {!isEditing ? (
                  <>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 5px 0' }}>
                      {profile.name}
                    </h2>
                    <p style={{ color: '#6b7280', margin: '0 0 10px 0' }}>
                      {profile.email}
                    </p>
                    <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>
                      Target: {profile.targetTest} {profile.targetScore} • Joined: Jan 15, 2024
                    </p>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>Name</label>
                      <input
                        type="text"
                        value={editProfile.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="form-input"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '16px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>Email</label>
                      <input
                        type="email"
                        value={editProfile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="form-input"
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          fontSize: '16px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>Target Test</label>
                        <select
                          value={editProfile.targetTest}
                          onChange={(e) => handleInputChange('targetTest', e.target.value)}
                          className="form-input"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        >
                          <option value="IELTS">IELTS</option>
                          <option value="TEF Canada">TEF Canada</option>
                          <option value="OPIc">OPIc</option>
                          <option value="TOEFL">TOEFL</option>
                          <option value="TOEIC">TOEIC</option>
                        </select>
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>Target Score</label>
                        <input
                          type="text"
                          value={editProfile.targetScore}
                          onChange={(e) => handleInputChange('targetScore', e.target.value)}
                          placeholder="e.g., Band 7.5, 350/450, IH"
                          className="form-input"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Edit/Save/Cancel Buttons */}
            <div style={{ display: 'flex', gap: '8px', minWidth: '100px' }}>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="edit-button"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ✏️ Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="save-button"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    ✅ Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="cancel-button"
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    ❌ Cancel
                  </button>
                </>
              )}
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