import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function setupTestimonials() {
  try {
    console.log('🔧 Setting up testimonials table...');
    
    // Create the table using individual SQL statements
    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        user_title VARCHAR(255),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;
    
    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_testimonials_user_id ON testimonials(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_testimonials_created ON testimonials(created_at)`;
    
    console.log('✅ Testimonials table created successfully!');
    
    // Insert some sample testimonials for testing
    console.log('📝 Adding sample testimonials...');
    
    await sql`
      INSERT INTO testimonials (user_id, user_name, user_title, rating, comment, is_approved, created_at)
      VALUES 
        ('sample-user-1', 'Sarah Chen', 'Environmental Scientist', 5, 'SustainX made tracking my carbon footprint effortless. The camera scan feature is genuinely innovative.', true, NOW()),
        ('sample-user-2', 'Marcus Rivera', 'Urban Planner', 5, 'The future simulator gave me chills. Seeing the impact visually changed how my entire team approaches sustainability.', true, NOW()),
        ('sample-user-3', 'Priya Sharma', 'Student Activist', 5, 'Finally an app that doesn''t lecture you — it just makes being eco-friendly feel natural and rewarding.', true, NOW())
      ON CONFLICT DO NOTHING
    `;
    
    console.log('✅ Sample testimonials added!');
    console.log('');
    console.log('🎉 Setup complete! You can now:');
    console.log('   1. View testimonials on the website');
    console.log('   2. Submit new testimonials via the form');
    console.log('   3. Approve testimonials using the API');
    console.log('');
    
  } catch (error) {
    console.error('❌ Error setting up testimonials:', error.message);
    console.error(error);
    process.exit(1);
  }
}

setupTestimonials();
