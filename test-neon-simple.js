import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Client } = pg;

console.log('Testing Neon connection with Client (not Pool)...');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

console.log('Attempting to connect...');

client.connect()
  .then(() => {
    console.log('✅ Connected successfully!');
    return client.query('SELECT NOW() as time, version() as version');
  })
  .then((res) => {
    console.log('✅ Query successful!');
    console.log('Time:', res.rows[0].time);
    console.log('Version:', res.rows[0].version);
    return client.end();
  })
  .then(() => {
    console.log('✅ Connection closed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err.message);
    console.error('Code:', err.code);
    console.error('Stack:', err.stack);
    process.exit(1);
  });

// Timeout after 60 seconds
setTimeout(() => {
  console.error('❌ Connection timeout after 60 seconds');
  process.exit(1);
}, 60000);
