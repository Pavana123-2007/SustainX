import { getDb } from './_utils.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { testimonialId, idToken } = req.body;

    if (!testimonialId) {
      return res.status(400).json({
        success: false,
        error: "Missing required field: testimonialId",
      });
    }

    // TODO: Add admin verification here

    const sql = getDb();
    if (!sql) {
      return res.status(500).json({
        success: false,
        error: "Database not configured",
      });
    }

    const result = await sql`
      UPDATE testimonials
      SET is_approved = true, updated_at = NOW()
      WHERE id = ${testimonialId}
      RETURNING id, is_approved
    `;

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Testimonial not found",
      });
    }

    res.json({
      success: true,
      data: result[0],
      message: "Testimonial approved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to approve testimonial",
      message: error.message,
    });
  }
}
