const mongoose = require("mongoose");
const File = require("../models/fileModel");
const { GridFSBucket } = require("mongodb");

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname: filename, id: fileId, mimetype: fileType } = req.file;
    const { creatorId, competitionCode } = req.body;

    if (!creatorId || !competitionCode) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const file = new File({
      filename,
      creatorId,
      competitionCode,
      fileId,
      fileType,
    });

    await file.save();

    res.status(200).json({
      message: "File uploaded successfully",
      file: req.file,
      dbFile: file,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res
      .status(500)
      .json({ message: "An error occurred while uploading the file" });
  }
};

const getFiles = async (req, res) => {
  try {
    const { competitionCode } = req.params;

    if (!competitionCode) {
      return res.status(400).json({ message: "Competition code is required" });
    }

    const files = await File.find({ competitionCode });
    res.status(200).json(files);
  } catch (error) {
    console.error("Error getting files:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving files" });
  }
};

const getFileStream = async (req, res) => {
  const { id: fileId } = req.params;

  try {
    const files = await req.gfs.files.find().toArray();
    const file = files.find((file) => file._id.toString() === fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.contentType !== "application/pdf") {
      return res.status(400).json({ message: "File is not a PDF" });
    }

    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    const readStream = bucket.openDownloadStreamByName(file.filename);

    res.set("Content-Type", file.contentType);

    readStream.on("error", (err) => {
      console.error("Error streaming file:", err);
      return res
        .status(500)
        .json({ message: "An error occurred while streaming the file" });
    });

    readStream.pipe(res);
  } catch (error) {
    console.error("Error fetching file:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the file" });
  }
};

const deleteFile = async (req, res) => {
  const { id: fileId } = req.params;

  try {
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });

    bucket.delete(new mongoose.Types.ObjectId(fileId), async (err) => {
      if (err) {
        console.error("Error deleting file from GridFS:", err);
        return res.status(500).json({
          message: "An error occurred while deleting the file from GridFS",
        });
      }

      try {
        const fileRes = await File.findOneAndDelete({ fileId });
        if (!fileRes) {
          return res
            .status(404)
            .json({ message: "File not found in database" });
        }
        res.status(200).json({ message: "File deleted successfully" });
      } catch (error) {
        console.error("Error deleting file from database:", error);
        res.status(500).json({
          message:
            "An error occurred while deleting the file from the database",
        });
      }
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the file" });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  getFileStream,
  deleteFile,
};
