import express from "express";
import dotenv from "dotenv";
import { getLocations } from "../models/Location.js";

const router = express.Router();
dotenv.config();

router.get("/", async function (req, res, next) {
  try {
    const allLocations = await getLocations();
    res.json({
      success: true,
      data: allLocations,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    next(error); // Pass to error handler
  }
});

export default router;
