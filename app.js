import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";

import authRoute from "./routes/authRoute.js";
import mediaRoute from "./routes/mediaRoute.js";
import indexRoute from "./routes/indexRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import registerRoute from "./routes/registerRoute.js";
import locationRoute from "./routes/locationRoute.js";
import businessRoute from "./routes/businessRoute.js";

import "./passport.js";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      httpOnly: true,
    },
  })
);
dotenv.config();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(helmet());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());
//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------

app.use("/", indexRoute);
app.use("/auth", authRoute);
app.use("/media", mediaRoute);
app.use("/reviews", reviewRoute);
app.use("/register", registerRoute);
app.use("/locations", locationRoute);
app.use("/businesses", businessRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
