import express from "express";
import passport from "passport";
import {
  googleCallback,
  getCurrentUser,
  logout,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
    session: false,
  }),
  googleCallback
);

router.get("/current_user", authenticate, getCurrentUser);

router.get("/logout", logout);

export default router;
