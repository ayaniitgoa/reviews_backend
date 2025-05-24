import express from "express";
import dotenv from "dotenv";
import { getReviews, addReview } from "../models/Reviews.js";

const router = express.Router();
dotenv.config();

router.get("/", async function (req, res, next) {
  try {
    const { businessid } = req.query;

    console.log("businessid", businessid);

    const allReviews = await getReviews({ businessid });

    console.log("all", allReviews);

    res.json({
      success: true,
      reviews: allReviews,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    next(error); // Pass to error handler
  }
});
router.post("/addreview", async function (req, res, next) {
  try {
    const { review, businessid, userid } = req.body;

    const addReview = await addReview(businessid, review, userid);
    res.json({
      success: true,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    next(error); // Pass to error handler
  }
});

export default router;
