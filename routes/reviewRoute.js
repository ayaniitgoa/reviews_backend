import express from "express";
import dotenv from "dotenv";
import { getReviews, addReview } from "../models/Reviews.js";
import { findUserByEmailAndName } from "../models/User.js";

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
    console.log("req.body", req);
    const { businessid, body, created_at, rating, email, name } = req.body;

    const user = await findUserByEmailAndName({ email, name });

    console.log("req.userid", user);

    const newReview = await addReview({
      businessid,
      body,
      created_at,
      rating,
      userid: user.userid,
    });
    res.json({
      success: true,
      newReview,
    });
  } catch (error) {
    console.error("Error add reviews:", error);
    next(error); // Pass to error handler
  }
});

export default router;
