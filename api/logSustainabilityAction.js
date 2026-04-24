import { getDb, verifyUser } from './_utils.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { category, actionLabel, points, idToken } = req.body;

    if (!category || !actionLabel || points === undefined) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: category, actionLabel, or points",
      });
    }

    let uid;
    try {
      uid = await verifyUser(idToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: error.message,
      });
    }

    const sql = getDb();
    if (!sql) {
      return res.json({
        success: true,
        data: {
          id: Date.now(),
          createdAt: new Date().toISOString(),
        },
        warning: "Database not configured, action not persisted",
      });
    }

    try {
      const result = await sql`
        INSERT INTO user_impact_logs (user_id, category, action_label, points, created_at)
        VALUES (${uid}, ${category}, ${actionLabel}, ${points}, NOW())
        RETURNING id, created_at
      `;

      res.json({
        success: true,
        data: {
          id: result[0].id,
          createdAt: result[0].created_at,
        },
      });
    } catch (dbError) {
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
    res.status(500).json({
      success: false,
      error: "Failed to log action",
      message: error.message,
    });
  }
}
