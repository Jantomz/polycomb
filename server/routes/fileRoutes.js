const express = require("express");

// Importing the function controllers to manipulate db
const {
  uploadFile,
  getFiles,
  getFileStream,
  deleteFile,
} = require("../controllers/fileController.js");

const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.MONGO_URI, // MongoDB connection string from environment variables
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Generating a random filename
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err); // Reject if there's an error generating the filename
        }

        const filename = buf.toString("hex") + path.extname(file.originalname); // Use a unique filename
        const fileInfo = {
          filename: filename,
          bucketName: "uploads", // Specify the collection name in GridFS
        };

        resolve(fileInfo); // Return file info to gridfs-storage
      });
    });
  },
});
const upload = multer({ storage }); // Initialize multer with GridFS storage

const router = express.Router(); // Create a new router object

// GET all files for a specific competition code
router.get("/competition/:competitionCode", getFiles); // Route to get files by competition code

router.post("/", upload.single("file"), uploadFile); // Route to upload a single file

router.get("/:id", getFileStream); // Route to get a file stream by ID

router.delete("/:id", deleteFile); // Route to delete a file by ID

module.exports = router; // Export the router
