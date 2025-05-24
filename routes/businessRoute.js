import express from "express";
import dotenv from "dotenv";
import { getBusinesses, getBusiness } from "../models/Business.js";

const router = express.Router();
dotenv.config();

router.get("/", async function (req, res, next) {
  try {
    const { locationid } = req.query;

    const allBusinesses = await getBusinesses(locationid);
    res.json({
      success: true,
      groups: allBusinesses,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    next(error); // Pass to error handler
  }
});
router.get("/business", async function (req, res, next) {
  try {
    const { businessid } = req.query;

    const business = await getBusiness(businessid);
    res.json({
      success: true,
      business,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    next(error); // Pass to error handler
  }
});

export default router;
