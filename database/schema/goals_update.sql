-- Updated Learning Goals Schema for Test Goal Setting
-- This adds fields needed for the goal setting functionality

-- Add missing columns to learning_goals table
ALTER TABLE learning_goals ADD COLUMN IF NOT EXISTS test_id VARCHAR(50);
ALTER TABLE learning_goals ADD COLUMN IF NOT EXISTS test_name VARCHAR(255);
ALTER TABLE learning_goals ADD COLUMN IF NOT EXISTS test_flag VARCHAR(10);
ALTER TABLE learning_goals ADD COLUMN IF NOT EXISTS target_score VARCHAR(50);
ALTER TABLE learning_goals ADD COLUMN IF NOT EXISTS current_score VARCHAR(50);
ALTER TABLE learning_goals ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing columns to be more flexible
ALTER TABLE learning_goals ALTER COLUMN title DROP NOT NULL;
ALTER TABLE learning_goals ALTER COLUMN description SET DEFAULT '';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_learning_goals_test_id ON learning_goals(test_id);
CREATE INDEX IF NOT EXISTS idx_learning_goals_user_status ON learning_goals(user_id, status);

-- Example of inserting a goal (for reference)
/*
INSERT INTO learning_goals (
    user_id, 
    goal_type, 
    test_id, 
    test_name, 
    test_flag,
    target_score, 
    target_date, 
    notes,
    status
) VALUES (
    1,
    'score_target',
    'ielts',
    'IELTS',
    '🇬🇧',
    '7.5',
    '2024-12-31',
    'Need this for university admission',
    'active'
);
*/