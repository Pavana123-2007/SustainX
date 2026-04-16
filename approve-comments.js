import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function approveComments() {
  try {
    console.log('✅ Approving pending testimonials...');
    
    const result = await sql`
      UPDATE testimonials
      SET is_approved = true, updated_at = NOW()
      WHERE is_approved = false
      RETURNING id
    `;
    
    console.log(`🎉 Successfully approved ${result.length} pending testimonial(s)!`);
    
  } catch (error) {
    console.error('❌ Error approving comments:', error.message);
    process.exit(1);
  }
}

approveComments();
