const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  getWatch,
  getAllWatches,
  deleteWatch,
  postWatch,
  updateWatch,
} = require("../controllers/watches");

const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Directory for uploaded images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueSuffix); // Generate a unique filename
  },
});

// Multer Middleware for Image Upload
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and JPG files are allowed"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

// Routes with `multer` Middleware
router
  .route("/")
  .get(getAllWatches)
  .post(upload.single("watchImage"), postWatch);
router
  .route("/:id")
  .get(getWatch)
  .delete(deleteWatch)
  .patch(upload.single("watchImage"), updateWatch);

module.exports = router;
