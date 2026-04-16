import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function removeStaticComments() {
  try {
    console.log('🗑️ Removing static comments...');
    
    await sql`
      DELETE FROM testimonials
      WHERE user_id IN ('sample-user-1', 'sample-user-2', 'sample-user-3')
    `;
    
    console.log('✅ Static comments removed successfully!');
    
  } catch (error) {
    console.error('❌ Error removing comments:', error.message);
    process.exit(1);
  }
}

removeStaticComments();
