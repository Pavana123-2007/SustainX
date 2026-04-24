import { getDb, verifyUser } from './_utils.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userName, userTitle, rating, comment, idToken } = req.body;

    if (!userName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: userName, rating, or comment",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    let uid;
    try {
      uid = await verifyUser(idToken, true);
    } catch (error) {
      uid = "anonymous";
    }

    const sql = getDb();
    if (!sql) {
      return res.status(500).json({
        success: false,
        error: "Database not configured",
      });
    }

    const result = await sql`
      INSERT INTO testimonials (user_id, user_name, user_title, rating, comment, is_approved, created_at)
      VALUES (${uid}, ${userName}, ${userTitle || null}, ${rating}, ${comment}, false, NOW())
      RETURNING id, created_at
    `;

    res.json({
      success: true,
      data: {
        id: result[0].id,
        createdAt: result[0].created_at,
      },
      message: "Thank you for your feedback! Your testimonial will be reviewed and published soon.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to submit testimonial",
      message: error.message,
    });
  }
}
