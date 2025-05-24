import { query } from "../db.js";

export const findUserByGoogleId = async (googleId) => {
  const result = await query("SELECT * FROM users WHERE google_id = $1", [
    googleId,
  ]);
  return result.rows[0];
};

export const createUser = async (userData) => {
  const result = await query(
    "INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *",
    [userData.googleId, userData.email, userData.name]
  );
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

export const findUserByEmailAndName = async ({ email, name }) => {
  const result = await query(
    "SELECT * from users where email = $1 and name = $2",
    [email, name]
  );
  return result.rows[0];
};
