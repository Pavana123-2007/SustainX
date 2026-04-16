-- Create testimonials table for user reviews
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  user_title VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for better query performance
  INDEX idx_testimonials_user_id (user_id),
  INDEX idx_testimonials_approved (is_approved),
  INDEX idx_testimonials_created (created_at)
);

-- Add comment to table
COMMENT ON TABLE testimonials IS 'Stores user testimonials and reviews';
COMMENT ON COLUMN testimonials.user_id IS 'Firebase UID of the user';
COMMENT ON COLUMN testimonials.user_name IS 'Display name of the user';
COMMENT ON COLUMN testimonials.user_title IS 'Optional title/role (e.g., Environmental Scientist)';
COMMENT ON COLUMN testimonials.rating IS 'Star rating from 1 to 5';
COMMENT ON COLUMN testimonials.comment IS 'User review text';
COMMENT ON COLUMN testimonials.is_approved IS 'Whether the testimonial is approved for display';
