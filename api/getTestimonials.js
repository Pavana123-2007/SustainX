import { getDb } from './_utils.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const sql = getDb();
    if (!sql) {
      return res.status(500).json({
        success: false,
        error: "Database not configured",
      });
    }

    const testimonials = await sql`
      SELECT 
        id,
        user_name,
        user_title,
        rating,
        comment,
        created_at
      FROM testimonials
      WHERE is_approved = true
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    res.json({
      success: true,
      data: testimonials,
      count: testimonials.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch testimonials",
      message: error.message,
    });
  }
}
