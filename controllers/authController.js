import { generateToken, setTokenCookie } from "../utils/jwt.js";

export const googleCallback = (req, res) => {
  const token = generateToken({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
  });
  console.log("userrrr", req.user);

  console.log("tojeh", token);

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax", // Changed from 'strict' to 'lax' for cross-origin
    path: "/", // Important for cross-route access
    maxAge: 3600000,
  });

  res.redirect(process.env.CLIENT_URL);
};

export const getCurrentUser = (req, res) => {
  res.json(req.user);
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
