const express = require("express");

// importing the function controllers to manipulate db
const {
  uploadAudio,
  getAudios,
  getAudioStream,
  deleteAudio,
} = require("../controllers/audioController.js");

const mongoose = require("mongoose");
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

// Create storage engine

const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
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
          bucketName: "audios", // You can specify the collection name here
        };

        resolve(fileInfo); // Return file info to gridfs-storage
      });
    });
  },
});
const upload = multer({ storage });

const router = express.Router();

// GET all files for a specific wordlist
router.get("/wordlist/:wordlistId", getAudios);

router.post("/", upload.single("audio"), uploadAudio);

router.get("/:id", getAudioStream);

router.delete("/:id", deleteAudio);

module.exports = router;
