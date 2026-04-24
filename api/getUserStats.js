import { getDb, verifyUser } from './_utils.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: idToken",
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
          today: { totalPoints: 0, goodActionsCount: 0, badActionsCount: 0 },
          allTime: { totalPoints: 0 },
        },
        warning: "Database not configured",
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayResult = await sql`
      SELECT 
        COALESCE(SUM(points), 0) as total_points,
        COUNT(CASE WHEN points > 0 THEN 1 END) as good_actions,
        COUNT(CASE WHEN points < 0 THEN 1 END) as bad_actions
      FROM user_impact_logs
      WHERE user_id = ${uid}
        AND created_at >= ${today}
        AND created_at < ${tomorrow}
    `;

    const allTimeResult = await sql`
      SELECT 
        COALESCE(SUM(points), 0) as total_points
      FROM user_impact_logs
      WHERE user_id = ${uid}
    `;

    res.json({
      success: true,
      data: {
        today: {
          totalPoints: parseInt(todayResult[0].total_points),
          goodActionsCount: parseInt(todayResult[0].good_actions),
          badActionsCount: parseInt(todayResult[0].bad_actions),
        },
        allTime: {
          totalPoints: parseInt(allTimeResult[0].total_points),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch stats",
      message: error.message,
    });
  }
}
