import { query } from "../db.js";

export const addReview = async ({
  businessid,
  body,
  created_at,
  rating,
  userid,
}) => {
  try {
    const result = await query(
      "INSERT into reviews (body, businessid, userid, created_at, rating) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [body, businessid, userid, created_at, rating]
    );

    console.log("result", result);

    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error; // Re-throw to be caught by route handler
  }
};
export const getReviews = async ({ businessid }) => {
  try {
    console.log("businessidddd", businessid);
    const result = await query(
      "SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.userid = u.userid WHERE businessid = $1",
      [businessid]
    );

    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error; // Re-throw to be caught by route handler
  }
};
