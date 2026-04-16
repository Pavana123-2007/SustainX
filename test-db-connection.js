import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Pool } = pg;

console.log('Testing database connection...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL (masked):', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.query('SELECT NOW() as current_time, version() as pg_version', (err, res) => {
  if (err) {
    console.error('❌ Connection failed!');
    console.error('Error code:', err.code);
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
  } else {
    console.log('✅ Connection successful!');
    console.log('Current time:', res.rows[0].current_time);
    console.log('PostgreSQL version:', res.rows[0].pg_version);
  }
  pool.end();
});
