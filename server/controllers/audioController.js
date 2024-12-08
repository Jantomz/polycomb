const mongoose = require("mongoose");
const Audio = require("../models/audioModel");
const { GridFSBucket } = require("mongodb");

const uploadAudio = async (req, res) => {
  try {
    console.log("Uploading audio: ", req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No audio uploaded" });
    }

    const filename = req.body.wordId + "-" + req.body.creatorId;
    const creatorId = req.body.creatorId;
    const wordId = req.body.wordId;
    const fileId = req.file.id;
    const fileType = req.file.mimetype;

    console.log("Creating audio: ", filename, creatorId, wordId, fileId);

    const audio = new Audio({
      audioname: filename,
      audioId: fileId,
      audioType: fileType,
      creatorId,
      wordId,
    });

    await audio.save();

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
    console.log("Getting all audios");

    const competitionCode = req.params.competitionCode;

    if (!competitionCode) {
      return res.status(400).json({ message: "Competition code is required" });
    }

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
  const fileId = req.params.id;

  try {
    const files = await req.gfsAudio.files.find().toArray();
    const file = files.find((file) => file._id.toString() === fileId);

    if (!file) {
      return res.status(404).json({ message: "Audio not found" });
    }

    if (!file.contentType.startsWith("audio/")) {
      return res.status(400).json({ message: "File is not an audio file" });
    }

    console.log("Getting audio: ", file);

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "audios",
    });
    const readStream = bucket.openDownloadStreamByName(file.filename);

    console.log("Streaming audio: ", file.filename);

    res.set("Content-Type", file.contentType);

    readStream.on("error", (err) => {
      console.error("Error streaming audio:", err);
      return res
        .status(500)
        .json({ message: "An error occurred while streaming the audio" });
    });

    readStream.pipe(res);
  } catch (err) {
    console.error("Error fetching audio:", err);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the audio" });
  }
};

const deleteAudio = async (req, res) => {
  try {
    console.log("Deleting audio: ", req.params.id);
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
        const fileRes = await Audio.findOneAndDelete({
          audioId: req.params.id,
        });
        console.log("Deleted audio: ", req.params.id);
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
