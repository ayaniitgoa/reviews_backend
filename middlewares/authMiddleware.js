import { verifyToken } from "../utils/jwt.js";

export const authenticate = (req, res, next) => {
  console.log("cookies", req.cookies.token);

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
