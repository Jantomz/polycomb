const mongoose = require("mongoose");

const Audio = require("../models/audioModel");

const { GridFSBucket } = require("mongodb");

const uploadAudio = async (req, res) => {
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
};

const getAudios = async (req, res) => {
  console.log("Getting all audios");

  const competitionCode = req.params.competitionCode;

  if (!competitionCode) {
    return res.status(400).json({ message: "Competition code is required" });
  }

  const audios = await Audio.find({ competitionCode });
  res.status(200).json(audios);
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
      return res.status(404).json({ message: "Audio not found" });
    });

    readStream.pipe(res);
  } catch (err) {
    console.error("Error fetching audio:", err);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the audio" });
  }
};

module.exports = {
  uploadAudio,
  getAudios,
  getAudioStream,
};
