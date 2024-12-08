const mongoose = require("mongoose");
const Audio = require("../models/audioModel");
const { GridFSBucket } = require("mongodb");

const uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      // Check if a file was uploaded
      return res.status(400).json({ message: "No audio uploaded" });
    }

    // Construct filename using wordId and creatorId for uniqueness
    const filename = req.body.wordId + "-" + req.body.creatorId;
    const creatorId = req.body.creatorId;
    const wordId = req.body.wordId;
    const fileId = req.file.id; // MongoDB file ID
    const fileType = req.file.mimetype; // MIME type of the file

    // Create a new Audio document
    const audio = new Audio({
      audioname: filename,
      audioId: fileId,
      audioType: fileType,
      creatorId,
      wordId,
    });

    await audio.save(); // Save the audio document to the database

    res.status(200).json({
      message: "Audio uploaded successfully",
      file: req.file,
      dbAudio: audio,
    });
  } catch (err) {
    console.error("Error uploading audio:", err);
    res
      .status(500)
      .json({ message: "An error occurred while uploading the audio" });
  }
};

const getAudios = async (req, res) => {
  try {
    const competitionCode = req.params.competitionCode;

    if (!competitionCode) {
      // Ensure competition code is provided
      return res.status(400).json({ message: "Competition code is required" });
    }

    // Find all audios with the given competition code
    const audios = await Audio.find({ competitionCode });
    res.status(200).json(audios);
  } catch (err) {
    console.error("Error fetching audios:", err);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the audios" });
  }
};

const getAudioStream = async (req, res) => {
  const fileId = req.params.id; // Get file ID from request parameters

  try {
    const files = await req.gfsAudio.files.find().toArray(); // Fetch all files
    const file = files.find((file) => file._id.toString() === fileId); // Find the specific file by ID

    if (!file) {
      // Check if file exists
      return res.status(404).json({ message: "Audio not found" });
    }

    if (!file.contentType.startsWith("audio/")) {
      // Ensure the file is an audio file
      return res.status(400).json({ message: "File is not an audio file" });
    }

    // Create a GridFSBucket instance for streaming
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "audios",
    });
    const readStream = bucket.openDownloadStreamByName(file.filename); // Open a download stream

    res.set("Content-Type", file.contentType); // Set the content type for the response

    readStream.on("error", (err) => {
      console.error("Error streaming audio:", err);
      return res
        .status(500)
        .json({ message: "An error occurred while streaming the audio" });
    });

    readStream.pipe(res); // Pipe the read stream to the response
  } catch (err) {
    console.error("Error fetching audio:", err);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the audio" });
  }
};

const deleteAudio = async (req, res) => {
  try {
    // Create a GridFSBucket instance for deletion
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "audios",
    });

    bucket.delete(new mongoose.Types.ObjectId(req.params.id), async (err) => {
      if (err) {
        console.error("Error deleting audio from bucket:", err);
        return res.status(500).json({
          message: "An error occurred while deleting the audio from the bucket",
        });
      }

      try {
        // Delete the audio document from the database
        await Audio.findOneAndDelete({
          audioId: req.params.id,
        });
        res.status(200).json({ message: "Audio deleted successfully" });
      } catch (err) {
        console.error("Error deleting audio from database:", err);
        return res.status(500).json({
          message:
            "An error occurred while deleting the audio from the database",
        });
      }
    });
  } catch (err) {
    console.error("Error deleting audio:", err);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the audio" });
  }
};

module.exports = {
  uploadAudio,
  getAudios,
  getAudioStream,
  deleteAudio,
};
