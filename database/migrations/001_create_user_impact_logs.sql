-- Create user_impact_logs table for storing sustainability actions
CREATE TABLE IF NOT EXISTS user_impact_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  action_label VARCHAR(255) NOT NULL,
  points INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for better query performance
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  INDEX idx_user_created (user_id, created_at)
);

-- Add comment to table
COMMENT ON TABLE user_impact_logs IS 'Stores user sustainability actions and their impact points';
COMMENT ON COLUMN user_impact_logs.user_id IS 'Firebase UID of the user';
COMMENT ON COLUMN user_impact_logs.category IS 'Action category (e.g., travel, food, electricity)';
COMMENT ON COLUMN user_impact_logs.action_label IS 'Specific action taken (e.g., Walk, Vegan, Solar)';
COMMENT ON COLUMN user_impact_logs.points IS 'Impact points earned/lost for this action';
