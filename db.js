import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const Pool = pg.Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "reviews",
  password: "Shruti@1994",
  port: 5432,
});

pool.query("SELECT NOW()", (err) => {
  if (err) console.error("Database connection error", err.stack);
  else console.log("Connected to PostgreSQL");
});

export const query = (text, params) => pool.query(text, params);
