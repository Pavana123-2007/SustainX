import { getDb } from './_utils.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sql = getDb();
    
    if (!sql) {
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

    let result;
    const maxRetries = 3;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        result = await sql`
          SELECT 
            COUNT(DISTINCT user_id) as active_users,
            COUNT(*) as total_actions,
            COALESCE(SUM(points), 0) as total_points
          FROM user_impact_logs
        `;
        break;
      } catch (queryError) {
        if (i === maxRetries - 1) {
          throw queryError;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const activeUsers = parseInt(result[0].active_users) || 0;
    const totalActions = parseInt(result[0].total_actions) || 0;
    const totalPoints = parseInt(result[0].total_points) || 0;
    
    const treesEquivalent = Math.floor(totalPoints / 10);
    const co2InKg = totalPoints * 0.5;
    const co2Prevented = co2InKg >= 1000 
      ? Math.floor(co2InKg / 1000) 
      : Math.floor(co2InKg);

    res.json({
      success: true,
      data: {
        activeUsers,
        treesEquivalent,
        ecoActionsLogged: totalActions,
        co2Prevented,
      },
    });
  } catch (error) {
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
}
