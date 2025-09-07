'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import type { User } from '@supabase/supabase-js';
import GoalSetting from './GoalSetting';

interface Goal {
  id: string;
  user_id: string;
  test_id: string;
  test_name: string;
  test_flag: string;
  target_score: string;
  target_date: string;
  current_score?: string;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  notes?: string;
}

export default function MyGoals() {
  const [user, setUser] = useState<User | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string>('');

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      setUser(session.user);
      
      const { data: goalsData, error } = await supabase
        .from('learning_goals')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .order('target_date', { ascending: true });
        
      if (error) {
        console.error('Error loading goals:', error);
      } else {
        setGoals(goalsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (daysLeft: number) => {
    if (daysLeft < 30) return '#ef4444'; // Red
    if (daysLeft < 90) return '#f59e0b'; // Yellow
    return '#10b981'; // Green
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      const { error } = await supabase
        .from('learning_goals')
        .delete()
        .eq('id', goalId);
        
      if (error) {
        console.error('Error deleting goal:', error);
        alert('Error deleting goal. Please try again.');
      } else {
        loadGoals(); // Refresh the list
        alert('Goal deleted successfully!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting goal. Please try again.');
    }
  };

  const handleEditGoal = (goalId: string, testId: string) => {
    setEditingGoalId(testId);
    setGoalModalOpen(true);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
        Loading your goals...
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '30px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          🎯 My Test Goals
        </h3>
        <button
          onClick={() => setGoalModalOpen(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          + Add Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          border: '2px dashed #e5e7eb'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <h4 style={{ fontSize: '18px', color: '#1f2937', marginBottom: '8px' }}>
            No goals set yet
          </h4>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            Set your first test goal to start tracking your progress!
          </p>
          <button
            onClick={() => setGoalModalOpen(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Set Your First Goal 🚀
          </button>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '16px' 
        }}>
          {goals.map((goal) => {
            const daysLeft = getDaysUntilTarget(goal.target_date);
            const progressColor = getProgressColor(daysLeft);
            const isOverdue = daysLeft < 0;
            
            return (
              <div key={goal.id} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: isOverdue ? '2px solid #ef4444' : '1px solid #e5e7eb',
                position: 'relative'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{goal.test_flag}</span>
                    <div>
                      <h4 style={{ 
                        fontSize: '16px', 
                        fontWeight: 'bold', 
                        color: '#1f2937', 
                        margin: '0 0 4px 0' 
                      }}>
                        {goal.test_name}
                      </h4>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        Target: {goal.target_score}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => handleEditGoal(goal.id, goal.test_id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '4px'
                      }}
                      title="Edit goal"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        padding: '4px'
                      }}
                      title="Delete goal"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    marginBottom: '4px' 
                  }}>
                    Target Date: {new Date(goal.target_date).toLocaleDateString()}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: progressColor, 
                    fontWeight: '500' 
                  }}>
                    {isOverdue ? 
                      `⚠️ Overdue by ${Math.abs(daysLeft)} days` : 
                      `⏰ ${daysLeft} days left`
                    }
                  </div>
                </div>

                {goal.notes && (
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '6px',
                    padding: '8px',
                    fontSize: '14px',
                    color: '#6b7280',
                    marginBottom: '12px'
                  }}>
                    💭 {goal.notes}
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '12px',
                  color: '#9ca3af'
                }}>
                  <span>Created: {new Date(goal.created_at).toLocaleDateString()}</span>
                  <span style={{
                    backgroundColor: progressColor,
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '500'
                  }}>
                    {goal.status.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Goal Setting Modal */}
      <GoalSetting
        isOpen={goalModalOpen}
        onClose={() => {
          setGoalModalOpen(false);
          setEditingGoalId('');
          loadGoals(); // Refresh goals after modal closes
        }}
        preselectedTestId={editingGoalId}
      />
    </div>
  );
}