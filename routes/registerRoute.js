import express from "express";
import dotenv from "dotenv";
import { query } from "../db.js";

const router = express.Router();
dotenv.config();

router.post("", async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    console.log("req", req.body);

    const userExists = await query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "Email already exists" });
    }
    console.log("reached brother");

    const newUser = await query(
      `INSERT INTO users (email, password, firstname, lastname, created_at) 
            VALUES ($1, $2, $3, $4, NOW()) 
            RETURNING userid, email, firstname, lastname, created_at`,
      [email, password, firstname, lastname]
    );

    res.status(201).json({
      success: true,
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
