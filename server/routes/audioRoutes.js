const express = require("express");

// Importing the function controllers to manipulate db
const {
  uploadAudio,
  getAudios,
  getAudioStream,
  deleteAudio,
} = require("../controllers/audioController.js");

const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// Create storage engine for GridFS
const storage = new GridFsStorage({
  url: process.env.MONGO_URI, // MongoDB connection string from environment variables
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      // Generating a random filename
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err); // Reject if there's an error generating the filename
        }

        // Create a unique filename using random bytes and original file extension
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "audios", // Specify the collection name in GridFS
        };

        resolve(fileInfo); // Return file info to gridfs-storage
      });
    });
  },
});
const upload = multer({ storage }); // Initialize multer with GridFS storage

const router = express.Router(); // Create a new router object

// GET all files for a specific wordlist
router.get("/wordlist/:wordlistId", getAudios); // Route to get all audios for a wordlist

// POST route to upload a single audio file
router.post("/", upload.single("audio"), uploadAudio); // Middleware to handle file upload

// GET route to stream a specific audio file by ID
router.get("/:id", getAudioStream); // Route to stream audio

// DELETE route to remove a specific audio file by ID
router.delete("/:id", deleteAudio); // Route to delete audio

module.exports = router; // Export the router to be used in other parts of the application
