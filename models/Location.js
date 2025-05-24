import { query } from "../db.js";

export const getLocations = async () => {
  try {
    const result = await query("SELECT * FROM locations");
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error; // Re-throw to be caught by route handler
  }
};
export const getLocationData = async (city) => {
  try {
    const result = await query("SELECT * FROM locations where city = $1", [
      city,
    ]);
    return result.rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error; // Re-throw to be caught by route handler
  }
};
