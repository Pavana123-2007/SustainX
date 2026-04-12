import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";
import pg from "pg";
import admin from "firebase-admin";

dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors());
app.use(express.json());

// Development mode flag
const DEV_MODE = process.env.NODE_ENV !== 'production';

// Initialize Firebase Admin (only if not already initialized)
if (!admin.apps.length && !DEV_MODE) {
  try {
    // Try to initialize with service account if available
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      console.log("[Firebase Admin] Initialized with service account");
    } else {
      console.log("[Firebase Admin] Skipping initialization - no credentials found");
      console.log("[Server] Running in DEVELOPMENT MODE - Firebase Admin verification disabled");
    }
  } catch (error) {
    console.error("[Firebase Admin] Initialization error:", error.message);
  }
} else if (DEV_MODE) {
  console.log("[Server] Running in DEVELOPMENT MODE - Firebase Admin verification disabled");
}

// Initialize Postgres client
const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Handle pool errors to prevent crashes
pool.on('error', (err) => {
  console.error('[Database Pool] Unexpected error:', err.message);
  // Don't exit the process, just log the error
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('[Database] Connection test failed:', err.message);
    console.log('[Server] Continuing without database connection');
  } else {
    console.log('[Database] Connected successfully');
  }
});

app.post("/ai", async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.json({ insights: "You're doing great! Keep improving your habits 🌱" });
  }
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const { score, co2, goodActions, badActions } = req.body;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a sustainability AI assistant.",
        },
        {
          role: "user",
          content: `
User data:
Score: ${score}
CO2: ${co2}
Good Actions: ${goodActions}
Bad Actions: ${badActions}

Generate 3 short sustainability insights.
          `,
        },
      ],
    });

    res.json({
      insights: completion.choices[0].message.content,
    });
  } catch (err) {
    res.json({
      insights: "You're doing great! Keep improving your habits 🌱",
    });
  }
});

// API route to log sustainability actions
app.post("/api/logSustainabilityAction", async (req, res) => {
  try {
    const { category, actionLabel, points, idToken } = req.body;

    // Validate required fields
    if (!category || !actionLabel || points === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: category, actionLabel, or points",
      });
    }

    let uid = "dev-user"; // Default for development

    // Verify Firebase ID token and get uid (skip in dev mode)
    if (!DEV_MODE && idToken) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        uid = decodedToken.uid;
      } catch (error) {
        console.error("[Auth Error]", error.message);
        return res.status(401).json({
          success: false,
          error: "Invalid or expired authentication token",
          details: error.message,
        });
      }
    } else if (DEV_MODE) {
      console.log("[Dev Mode] Skipping Firebase token verification");
      // In dev mode, try to extract uid from token payload without verification
      if (idToken) {
        try {
          const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
          uid = payload.user_id || payload.sub || "dev-user";
        } catch (e) {
          uid = "dev-user";
        }
      }
    }

    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.warn("[Database] DATABASE_URL not configured, skipping database save");
      return res.json({
        success: true,
        data: {
          id: Date.now(),
          createdAt: new Date().toISOString(),
        },
        warning: "Database not configured, action not persisted",
      });
    }

    // Insert into database
    try {
      const query = `
        INSERT INTO user_impact_logs (user_id, category, action_label, points, created_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id, created_at
      `;

      const result = await pool.query(query, [uid, category, actionLabel, points]);

      res.json({
        success: true,
        data: {
          id: result.rows[0].id,
          createdAt: result.rows[0].created_at,
        },
      });
    } catch (dbError) {
      console.error("[Database Error]", dbError.message);
      // Return success anyway for development (data not persisted)
      return res.json({
        success: true,
        data: {
          id: Date.now(),
          createdAt: new Date().toISOString(),
        },
        warning: "Database error, action not persisted: " + dbError.message,
      });
    }
  } catch (error) {
    console.error("Error logging sustainability action:", error);
    res.status(500).json({
      success: false,
      error: "Failed to log action",
      message: error.message,
    });
  }
});

// API route to get user stats
app.post("/api/getUserStats", async (req, res) => {
  console.log('[getUserStats] Request received');
  try {
    const { idToken } = req.body;

    // Validate required fields
    if (!idToken) {
      console.log('[getUserStats] Missing idToken');
      return res.status(400).json({
        success: false,
        error: "Missing required field: idToken",
      });
    }

    let uid = "dev-user"; // Default for development

    // Verify Firebase ID token and get uid (skip in dev mode)
    if (!DEV_MODE && idToken) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        uid = decodedToken.uid;
        console.log('[getUserStats] Authenticated user:', uid);
      } catch (error) {
        console.error("[Auth Error]", error.message);
        return res.status(401).json({
          success: false,
          error: "Invalid or expired authentication token",
          details: error.message,
        });
      }
    } else if (DEV_MODE) {
      console.log("[Dev Mode] Skipping Firebase token verification for getUserStats");
      // In dev mode, try to extract uid from token payload without verification
      if (idToken) {
        try {
          const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
          uid = payload.user_id || payload.sub || "dev-user";
          console.log('[getUserStats] Extracted uid from token:', uid);
        } catch (e) {
          uid = "dev-user";
          console.log('[getUserStats] Using default uid:', uid);
        }
      }
    }

    // Get today's date range (start and end of day in UTC)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log('[getUserStats] Querying database for uid:', uid, 'date range:', today, 'to', tomorrow);

    // Query for today's stats
    const todayQuery = `
      SELECT 
        COALESCE(SUM(points), 0) as total_points,
        COUNT(CASE WHEN points > 0 THEN 1 END) as good_actions,
        COUNT(CASE WHEN points < 0 THEN 1 END) as bad_actions
      FROM user_impact_logs
      WHERE user_id = $1 
        AND created_at >= $2 
        AND created_at < $3
    `;

    const todayResult = await pool.query(todayQuery, [uid, today, tomorrow]);
    console.log('[getUserStats] Today result:', todayResult.rows[0]);

    // Query for all-time stats
    const allTimeQuery = `
      SELECT 
        COALESCE(SUM(points), 0) as total_points
      FROM user_impact_logs
      WHERE user_id = $1
    `;

    const allTimeResult = await pool.query(allTimeQuery, [uid]);
    console.log('[getUserStats] All-time result:', allTimeResult.rows[0]);

    const responseData = {
      success: true,
      data: {
        today: {
          totalPoints: parseInt(todayResult.rows[0].total_points),
          goodActionsCount: parseInt(todayResult.rows[0].good_actions),
          badActionsCount: parseInt(todayResult.rows[0].bad_actions),
        },
        allTime: {
          totalPoints: parseInt(allTimeResult.rows[0].total_points),
        },
      },
    };

    console.log('[getUserStats] Sending response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch stats",
      message: error.message,
    });
  }
});

// API route to get global impact stats
app.get("/api/getGlobalStats", async (req, res) => {
  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      // Return mock data if database not configured
      return res.json({
        success: true,
        data: {
          activeUsers: 12400,
          treesEquivalent: 8650,
          ecoActionsLogged: 45200,
          co2Prevented: 1840,
        },
        warning: "Database not configured, showing mock data",
      });
    }

    // Query for global stats
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT user_id) as active_users,
        COUNT(*) as total_actions,
        COALESCE(SUM(points), 0) as total_points
      FROM user_impact_logs
    `;

    const result = await pool.query(statsQuery);
    
    const activeUsers = parseInt(result.rows[0].active_users) || 0;
    const totalActions = parseInt(result.rows[0].total_actions) || 0;
    const totalPoints = parseInt(result.rows[0].total_points) || 0;
    
    // Calculate derived metrics
    // 1 point = 0.5 kg CO2, trees equivalent = points / 10
    const treesEquivalent = Math.floor(totalPoints / 10);
    // Show CO2 in kg if less than 1000kg, otherwise in tonnes
    const co2InKg = totalPoints * 0.5;
    const co2Prevented = co2InKg >= 1000 
      ? Math.floor(co2InKg / 1000) // Show in tonnes if >= 1000kg
      : Math.floor(co2InKg); // Show in kg if < 1000kg

    res.json({
      success: true,
      data: {
        activeUsers: activeUsers,
        treesEquivalent: treesEquivalent,
        ecoActionsLogged: totalActions,
        co2Prevented: co2Prevented,
      },
    });
  } catch (error) {
    console.error("Error fetching global stats:", error);
    // Return mock data on error
    res.json({
      success: true,
      data: {
        activeUsers: 12400,
        treesEquivalent: 8650,
        ecoActionsLogged: 45200,
        co2Prevented: 1840,
      },
      warning: "Database error, showing mock data: " + error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
  console.log("Press Ctrl+C to stop the server");
});

// Handle uncaught exceptions to prevent crashes
process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught Exception:', err.message);
  console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process] Unhandled Rejection at:', promise, 'reason:', reason);
});