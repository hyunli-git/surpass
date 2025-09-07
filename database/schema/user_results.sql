-- User Results and Progress Tracking Schema

-- User profiles table
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    target_test_type VARCHAR(20) DEFAULT 'ielts',
    target_score VARCHAR(20),
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Test attempts table - stores individual practice attempts
CREATE TABLE test_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
    test_type VARCHAR(20) NOT NULL, -- 'ielts', 'tef', 'opic'
    skill VARCHAR(20) NOT NULL, -- 'reading', 'writing', 'listening', 'speaking'
    task_type VARCHAR(50) NOT NULL, -- specific task type like 'task1-chart', 'part2-long-turn'
    task_id VARCHAR(50),
    task_title VARCHAR(255),
    prompt TEXT,
    
    -- Response data
    response_text TEXT, -- for writing tasks
    audio_url TEXT, -- for speaking tasks
    transcript TEXT, -- generated transcript for speaking
    
    -- Timing data
    time_spent INTEGER, -- seconds
    time_limit INTEGER, -- seconds
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Basic metrics
    word_count INTEGER, -- for writing
    duration INTEGER, -- for speaking (seconds)
    
    -- Scoring data (JSON for flexibility across test types)
    overall_score DECIMAL(3,1),
    band_score VARCHAR(20),
    criteria_scores JSONB, -- detailed scores for each criterion
    
    -- Feedback data
    strengths TEXT[],
    improvement_areas TEXT[],
    suggestions TEXT[],
    corrections JSONB, -- grammar/vocabulary corrections
    
    -- Status
    status VARCHAR(20) DEFAULT 'completed', -- 'completed', 'in_progress', 'abandoned'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User progress summary table - aggregated statistics
CREATE TABLE user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
    test_type VARCHAR(20) NOT NULL,
    skill VARCHAR(20) NOT NULL,
    
    -- Attempt statistics
    total_attempts INTEGER DEFAULT 0,
    completed_attempts INTEGER DEFAULT 0,
    
    -- Score tracking
    best_score DECIMAL(3,1),
    average_score DECIMAL(3,1),
    latest_score DECIMAL(3,1),
    
    -- Time tracking
    total_time_spent INTEGER DEFAULT 0, -- total seconds
    average_time_per_attempt INTEGER,
    
    -- Progress indicators
    first_attempt_date TIMESTAMP WITH TIME ZONE,
    last_attempt_date TIMESTAMP WITH TIME ZONE,
    
    -- Skill-specific metrics
    average_word_count INTEGER, -- for writing
    average_duration INTEGER, -- for speaking
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, test_type, skill)
);

-- Study sessions table - track study time and patterns
CREATE TABLE study_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    session_date DATE NOT NULL,
    total_time INTEGER NOT NULL, -- total minutes studied
    
    -- Breakdown by activity
    reading_time INTEGER DEFAULT 0,
    writing_time INTEGER DEFAULT 0,
    listening_time INTEGER DEFAULT 0,
    speaking_time INTEGER DEFAULT 0,
    
    -- Breakdown by test type
    ielts_time INTEGER DEFAULT 0,
    tef_time INTEGER DEFAULT 0,
    opic_time INTEGER DEFAULT 0,
    
    tasks_completed INTEGER DEFAULT 0,
    average_score DECIMAL(3,1),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, session_date)
);

-- Learning goals table - user-set targets and milestones
CREATE TABLE learning_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    goal_type VARCHAR(20) NOT NULL, -- 'score_target', 'practice_frequency', 'skill_improvement'
    test_type VARCHAR(20),
    skill VARCHAR(20),
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(5,2), -- flexible for different goal types
    current_value DECIMAL(5,2) DEFAULT 0,
    
    target_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Achievements and milestones table
CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    achievement_type VARCHAR(50) NOT NULL, -- 'first_attempt', 'score_milestone', 'streak', etc.
    achievement_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    test_type VARCHAR(20),
    skill VARCHAR(20),
    
    value_achieved DECIMAL(5,2), -- score, streak count, etc.
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Badge/icon info
    badge_icon VARCHAR(50),
    badge_color VARCHAR(20)
);

-- Bookmarked tasks table - user's saved/favorite practice tasks
CREATE TABLE bookmarked_tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
    
    test_type VARCHAR(20) NOT NULL,
    skill VARCHAR(20) NOT NULL,
    task_id VARCHAR(50) NOT NULL,
    task_title VARCHAR(255),
    
    notes TEXT, -- user's personal notes about the task
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, task_id)
);

-- Indexes for performance
CREATE INDEX idx_test_attempts_user_id ON test_attempts(user_id);
CREATE INDEX idx_test_attempts_completed_at ON test_attempts(completed_at);
CREATE INDEX idx_test_attempts_test_type_skill ON test_attempts(test_type, skill);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_study_sessions_user_date ON study_sessions(user_id, session_date);
CREATE INDEX idx_learning_goals_user_status ON learning_goals(user_id, status);
CREATE INDEX idx_achievements_user_earned ON user_achievements(user_id, earned_at);

-- Functions to update progress automatically
CREATE OR REPLACE FUNCTION update_user_progress()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or insert user progress when a test attempt is completed
    INSERT INTO user_progress (
        user_id, test_type, skill, 
        total_attempts, completed_attempts,
        best_score, average_score, latest_score,
        total_time_spent, average_time_per_attempt,
        first_attempt_date, last_attempt_date,
        average_word_count, average_duration
    )
    SELECT 
        NEW.user_id,
        NEW.test_type,
        NEW.skill,
        COUNT(*) as total_attempts,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_attempts,
        MAX(overall_score) as best_score,
        AVG(overall_score) as average_score,
        (SELECT overall_score FROM test_attempts 
         WHERE user_id = NEW.user_id AND test_type = NEW.test_type AND skill = NEW.skill 
         ORDER BY completed_at DESC LIMIT 1) as latest_score,
        SUM(time_spent) as total_time_spent,
        AVG(time_spent) as average_time_per_attempt,
        MIN(completed_at) as first_attempt_date,
        MAX(completed_at) as last_attempt_date,
        AVG(word_count) as average_word_count,
        AVG(duration) as average_duration
    FROM test_attempts 
    WHERE user_id = NEW.user_id AND test_type = NEW.test_type AND skill = NEW.skill
    GROUP BY user_id, test_type, skill
    
    ON CONFLICT (user_id, test_type, skill) 
    DO UPDATE SET
        total_attempts = EXCLUDED.total_attempts,
        completed_attempts = EXCLUDED.completed_attempts,
        best_score = EXCLUDED.best_score,
        average_score = EXCLUDED.average_score,
        latest_score = EXCLUDED.latest_score,
        total_time_spent = EXCLUDED.total_time_spent,
        average_time_per_attempt = EXCLUDED.average_time_per_attempt,
        last_attempt_date = EXCLUDED.last_attempt_date,
        average_word_count = EXCLUDED.average_word_count,
        average_duration = EXCLUDED.average_duration,
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update progress
CREATE TRIGGER trigger_update_user_progress
    AFTER INSERT OR UPDATE ON test_attempts
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION update_user_progress();

-- Function to update daily study session
CREATE OR REPLACE FUNCTION update_study_session(
    p_user_id INTEGER,
    p_session_date DATE,
    p_skill VARCHAR(20),
    p_test_type VARCHAR(20),
    p_time_spent INTEGER,
    p_score DECIMAL(3,1)
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO study_sessions (
        user_id, session_date, total_time, tasks_completed,
        reading_time, writing_time, listening_time, speaking_time,
        ielts_time, tef_time, opic_time,
        average_score
    )
    VALUES (
        p_user_id, p_session_date, p_time_spent, 1,
        CASE WHEN p_skill = 'reading' THEN p_time_spent ELSE 0 END,
        CASE WHEN p_skill = 'writing' THEN p_time_spent ELSE 0 END,
        CASE WHEN p_skill = 'listening' THEN p_time_spent ELSE 0 END,
        CASE WHEN p_skill = 'speaking' THEN p_time_spent ELSE 0 END,
        CASE WHEN p_test_type = 'ielts' THEN p_time_spent ELSE 0 END,
        CASE WHEN p_test_type = 'tef' THEN p_time_spent ELSE 0 END,
        CASE WHEN p_test_type = 'opic' THEN p_time_spent ELSE 0 END,
        p_score
    )
    ON CONFLICT (user_id, session_date)
    DO UPDATE SET
        total_time = study_sessions.total_time + p_time_spent,
        tasks_completed = study_sessions.tasks_completed + 1,
        reading_time = study_sessions.reading_time + 
            (CASE WHEN p_skill = 'reading' THEN p_time_spent ELSE 0 END),
        writing_time = study_sessions.writing_time + 
            (CASE WHEN p_skill = 'writing' THEN p_time_spent ELSE 0 END),
        listening_time = study_sessions.listening_time + 
            (CASE WHEN p_skill = 'listening' THEN p_time_spent ELSE 0 END),
        speaking_time = study_sessions.speaking_time + 
            (CASE WHEN p_skill = 'speaking' THEN p_time_spent ELSE 0 END),
        ielts_time = study_sessions.ielts_time + 
            (CASE WHEN p_test_type = 'ielts' THEN p_time_spent ELSE 0 END),
        tef_time = study_sessions.tef_time + 
            (CASE WHEN p_test_type = 'tef' THEN p_time_spent ELSE 0 END),
        opic_time = study_sessions.opic_time + 
            (CASE WHEN p_test_type = 'opic' THEN p_time_spent ELSE 0 END),
        average_score = (study_sessions.average_score * study_sessions.tasks_completed + p_score) / 
                       (study_sessions.tasks_completed + 1);
END;
$$ LANGUAGE plpgsql;

-- Row Level Security policies (example for user_profiles)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarked_tasks ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (users can only see their own data)
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR ALL USING (email = current_user);

CREATE POLICY "Users can view their own test attempts" ON test_attempts
    FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can view their own progress" ON user_progress
    FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can view their own study sessions" ON study_sessions
    FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can view their own goals" ON learning_goals
    FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can view their own achievements" ON user_achievements
    FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can view their own bookmarks" ON bookmarked_tasks
    FOR ALL USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));