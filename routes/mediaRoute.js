import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
import { query } from "../db.js";

const router = express.Router();
dotenv.config();

// --------------------------
// Cloudinary Configuration
// --------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --------------------------
// Multer Setup (In-Memory Storage)
// --------------------------
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

router.get("", (req, res) => {
  res.status(200).send({ success: "Media Route Success" });
});

router.post("/upload", upload.single("image"), async (req, res) => {
  const fileType = "img";
  try {
    if (!req.file) {
      console.log("no image");
      console.log(req);
      return res.status(400).json({ error: "No image provided" });
    }

    console.log("req data", req.body.userid);

    // Create a Promise-based upload stream
    var fileSizeInMb;
    var userid;
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "optimized_uploads",
          format: "webp", // Automatically convert to WebP for better compression
          quality: "auto:best", // Cloudinary's smart quality adjustment
          transformation: [
            { width: 1920, crop: "scale" }, // Limit maximum width
            { fetch_format: "auto" }, // Auto-optimize format
          ],
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );

      // Stream the buffer directly to Cloudinary
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      console.log("reached heree" + req.file.size);
      const BYTES_PER_MB = 1024 ** 2;
      fileSizeInMb = Math.ceil(req.file.size / BYTES_PER_MB);
      userid = req.body.userid;
    });

    if (fileSizeInMb) {
      const newMedia = await query(
        `INSERT INTO media (type, size, uri, userid, created_at) 
              VALUES ($1, $2, $3, $4, NOW()) 
              RETURNING type, size, uri, userid, created_at`,
        [fileType, fileSizeInMb, result.secure_url, userid]
      );
    }

    console.log("url" + result.secure_url);

    res.status(200).send({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: error.message || "Image upload failed",
    });
  }
});

// --------------------------
// Error Handling Middleware
// --------------------------
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: err.message });
});

export default router;
