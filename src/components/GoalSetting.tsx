'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { LanguageTest, getTestById } from '@/data/languageTests';

interface Goal {
  id?: string;
  user_id: string;
  test_id: string;
  test_name: string;
  test_flag: string;
  target_score: string;
  target_date: string;
  current_score?: string;
  status: 'active' | 'completed' | 'paused';
  created_at?: string;
  notes?: string;
}

interface GoalSettingProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTestId?: string;
}

export default function GoalSetting({ isOpen, onClose, preselectedTestId }: GoalSettingProps) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedTestId, setSelectedTestId] = useState(preselectedTestId || '');
  const [targetScore, setTargetScore] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingGoals, setExistingGoals] = useState<Goal[]>([]);

  // Common score ranges for different tests
  const getScoreOptions = (testId: string) => {
    switch (testId) {
      case 'ielts':
        return ['4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0'];
      case 'toefl-ibt':
        return ['60', '70', '80', '90', '100', '110', '120'];
      case 'toeic':
        return ['400', '500', '600', '700', '800', '850', '900', '950', '990'];
      case 'jlpt':
        return ['N5', 'N4', 'N3', 'N2', 'N1'];
      case 'hsk':
        return ['HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6', 'HSK 7', 'HSK 8', 'HSK 9'];
      case 'topik':
        return ['1급', '2급', '3급', '4급', '5급', '6급'];
      case 'tef':
        return ['200', '250', '300', '350', '400', '450'];
      case 'opic':
        return ['NH', 'IL', 'IM1', 'IM2', 'IM3', 'IH', 'AL'];
      case 'dele':
        return ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      case 'delf-dalf':
        return ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
      default:
        return ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadUserAndGoals();
    }
    if (preselectedTestId) {
      setSelectedTestId(preselectedTestId);
    }
  }, [isOpen, preselectedTestId]);

  const loadUserAndGoals = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      setUser(session.user);
      
      // Load existing goals
      const { data: goals, error } = await supabase
        .from('learning_goals')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active');
        
      if (error) {
        console.error('Error loading goals:', error);
      } else {
        setExistingGoals(goals || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTestId || !targetScore || !targetDate) return;
    
    setLoading(true);
    try {
      const selectedTest = getTestById(selectedTestId);
      if (!selectedTest) {
        alert('Test not found');
        return;
      }

      // Check if goal already exists for this test
      const existingGoal = existingGoals.find(goal => goal.test_id === selectedTestId);
      
      if (existingGoal) {
        // Update existing goal
        const { error } = await supabase
          .from('learning_goals')
          .update({
            target_score: targetScore,
            target_date: targetDate,
            notes: notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingGoal.id);
          
        if (error) {
          console.error('Error updating goal:', error);
          alert('Error updating goal. Please try again.');
          return;
        }
        
        alert('Goal updated successfully!');
      } else {
        // Create new goal
        const { error } = await supabase
          .from('learning_goals')
          .insert({
            user_id: user.id,
            test_id: selectedTestId,
            test_name: selectedTest.name,
            test_flag: selectedTest.flag,
            target_score: targetScore,
            target_date: targetDate,
            notes: notes,
            status: 'active',
            goal_type: 'score_target'
          });
          
        if (error) {
          console.error('Error creating goal:', error);
          alert('Error creating goal. Please try again.');
          return;
        }
        
        alert('Goal created successfully!');
      }
      
      // Reset form and close modal
      setSelectedTestId('');
      setTargetScore('');
      setTargetDate('');
      setNotes('');
      onClose();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const selectedTest = selectedTestId ? getTestById(selectedTestId) : null;
  const scoreOptions = selectedTest ? getScoreOptions(selectedTestId) : [];
  const existingGoal = existingGoals.find(goal => goal.test_id === selectedTestId);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            🎯 {existingGoal ? 'Update' : 'Set'} Test Goal
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Test Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>
              Select Test
            </label>
            <select
              value={selectedTestId}
              onChange={(e) => setSelectedTestId(e.target.value)}
              required
              disabled={!!preselectedTestId}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                backgroundColor: preselectedTestId ? '#f9fafb' : 'white'
              }}
            >
              <option value="">Choose a test...</option>
              <optgroup label="🇬🇧 English Tests">
                <option value="ielts">🇬🇧 IELTS</option>
                <option value="toefl-ibt">🇬🇧 TOEFL iBT</option>
                <option value="toeic">🇬🇧 TOEIC</option>
                <option value="cambridge">🇬🇧 Cambridge English</option>
                <option value="pte">🇬🇧 PTE Academic</option>
                <option value="duolingo">🇬🇧 Duolingo English Test</option>
                <option value="opic">🇬🇧 OPIC</option>
                <option value="oet">🇬🇧 OET</option>
              </optgroup>
              <optgroup label="🇨🇳 Chinese Tests">
                <option value="hsk">🇨🇳 HSK</option>
                <option value="yct">🇨🇳 YCT</option>
                <option value="tocfl">🇹🇼 TOCFL</option>
              </optgroup>
              <optgroup label="🇯🇵 Japanese Tests">
                <option value="jlpt">🇯🇵 JLPT</option>
                <option value="j-test">🇯🇵 J-TEST</option>
              </optgroup>
              <optgroup label="🇰🇷 Korean Tests">
                <option value="topik">🇰🇷 TOPIK</option>
              </optgroup>
              <optgroup label="🇫🇷 French Tests">
                <option value="delf-dalf">🇫🇷 DELF/DALF</option>
                <option value="tcf">🇫🇷 TCF</option>
                <option value="tef">🇫🇷 TEF/TEF Canada</option>
              </optgroup>
              <optgroup label="🇪🇸 Spanish Tests">
                <option value="dele">🇪🇸 DELE</option>
                <option value="siele">🇪🇸 SIELE</option>
              </optgroup>
              <optgroup label="🇩🇪 German Tests">
                <option value="goethe">🇩🇪 Goethe-Zertifikat</option>
                <option value="testdaf">🇩🇪 TestDaF</option>
                <option value="osd">🇦🇹 ÖSD</option>
              </optgroup>
              <optgroup label="Other Languages">
                <option value="celpe-bras">🇧🇷 CELPE-Bras</option>
                <option value="cils">🇮🇹 CILS</option>
                <option value="plida">🇮🇹 PLIDA</option>
                <option value="caple">🇵🇹 CAPLE</option>
                <option value="torfl">🇷🇺 TORFL</option>
              </optgroup>
            </select>
          </div>

          {/* Target Score */}
          {selectedTest && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>
                Target Score for {selectedTest.name}
              </label>
              <select
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '16px',
                  outline: 'none'
                }}
              >
                <option value="">Select target score...</option>
                {scoreOptions.map(score => (
                  <option key={score} value={score}>{score}</option>
                ))}
              </select>
            </div>
          )}

          {/* Target Date */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>
              Target Date
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '8px' }}>
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why is this goal important to you? Any specific strategies?"
              rows={3}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Existing Goal Warning */}
          {existingGoal && (
            <div style={{
              backgroundColor: '#fef3c7',
              border: '1px solid #f59e0b',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
                ⚠️ You already have a goal for {existingGoal.test_name}: {existingGoal.target_score} by {new Date(existingGoal.target_date).toLocaleDateString()}. This will update your existing goal.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: 'white',
                color: '#374151'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedTestId || !targetScore || !targetDate}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                color: 'white',
                opacity: (!selectedTestId || !targetScore || !targetDate) ? 0.5 : 1
              }}
            >
              {loading ? 'Saving...' : existingGoal ? 'Update Goal' : 'Set Goal'} 🎯
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}