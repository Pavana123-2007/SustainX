import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const { Pool } = pg;

async function setupDatabase() {
  console.log("🔧 Setting up database...");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in .env.local");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Create the user_impact_logs table
    console.log("📝 Creating user_impact_logs table...");
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_impact_logs (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        action_label VARCHAR(255) NOT NULL,
        points INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log("✅ Table created successfully!");

    // Create indexes for better performance
    console.log("📝 Creating indexes...");
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_user_id ON user_impact_logs(user_id);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_created_at ON user_impact_logs(created_at);
    `);
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_user_created ON user_impact_logs(user_id, created_at);
    `);

    console.log("✅ Indexes created successfully!");

    // Verify the table exists
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'user_impact_logs';
    `);

    if (result.rows.length > 0) {
      console.log("✅ Database setup complete!");
      console.log("📊 Table 'user_impact_logs' is ready to use.");
    } else {
      console.error("❌ Table creation failed!");
    }

  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
