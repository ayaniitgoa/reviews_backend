import { query } from "../db.js";

export const addReview = async ({ businessid, review, userid }) => {
  try {
    const result = await query(
      "INSERT into reviews (body, businessid, userid) VALUES ($1, $2, $3) RETURNING *",
      [review, businessid, userid]
    );
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error; // Re-throw to be caught by route handler
  }
};
export const getReviews = async ({ businessid }) => {
  try {
    console.log("businessidddd", businessid);
    const result = await query("SELECT * FROM reviews WHERE businessid = $1", [
      businessid,
    ]);

    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error; // Re-throw to be caught by route handler
  }
};
