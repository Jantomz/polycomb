const express = require("express");

// importing the function controllers to manipulate db
const {
  uploadFile,
  getFiles,
  getFileStream,
  deleteFile,
} = require("../controllers/fileController.js");

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
          bucketName: "uploads", // You can specify the collection name here
        };

        resolve(fileInfo); // Return file info to gridfs-storage
      });
    });
  },
});
const upload = multer({ storage });

const router = express.Router();

// GET all files for a specific competitioncode
router.get("/competition/:competitionCode", getFiles);

router.post("/", upload.single("file"), uploadFile);

router.get("/:id", getFileStream);

router.delete("/:id", deleteFile);

module.exports = router;
