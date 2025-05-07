import express from "express";
import dotenv from "dotenv";
import { query } from "../db.js";

const router = express.Router();
dotenv.config();

router.get("/", function (req, res, next) {
  res.send({
    success: "true",
  });
});

export default router;
