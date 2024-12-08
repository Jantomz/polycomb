// this file holds functions that hold the logic for manipulating the database, as we don't want to clutter the router file

// TODO: Add authentication through JWT or something to these routes
const mongoose = require("mongoose");

const File = require("../models/fileModel");

const { GridFSBucket } = require("mongodb");

const uploadFile = async (req, res) => {
  console.log("Uploading file: ", req.file);
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // verify all these things are here
  const filename = req.file.originalname;

  const creatorId = req.body.creatorId;

  const competitionCode = req.body.competitionCode;

  const fileId = req.file.id;

  const fileType = req.file.mimetype;

  console.log("Creating file: ", filename, creatorId, competitionCode, fileId);

  const file = new File({
    filename,
    creatorId,
    competitionCode,
    fileId,
    fileType,
  });

  await file.save();

  // Assuming you need to return the file info after upload
  res.status(200).json({
    message: "File uploaded successfully",
    file: req.file, // You can access the file object here
    dbFile: file, // You can access the file object here
  });
};

const getFiles = async (req, res) => {
  console.log("Getting all files");

  const competitionCode = req.params.competitionCode;

  if (!competitionCode) {
    return res.status(400).json({ message: "Competition code is required" });
  }

  const files = await File.find({ competitionCode });
  res.status(200).json(files);
};

const getFileStream = async (req, res) => {
  const fileId = req.params.id; // The file ID from the URL

  try {
    // Assuming req.gfs is properly initialized and connected
    const files = await req.gfs.files.find().toArray();

    const file = files.find((file) => file._id.toString() === fileId);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Check if the file is a PDF
    if (file.contentType !== "application/pdf") {
      return res.status(400).json({ message: "File is not a PDF" });
    }

    console.log("Getting file: ", file);

    // Get the file stream from GridFS
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads", // replace with your bucket name
    });
    const readStream = bucket.openDownloadStreamByName(file.filename);

    console.log("Streaming file: ", file.filename);

    // Set the correct content type for the response
    res.set("Content-Type", file.contentType);

    // Handle errors on the readStream
    readStream.on("error", (err) => {
      console.error("Error streaming file:", err);
      return res.status(404).json({ message: "File not found" });
    });

    // Pipe the file stream to the response
    readStream.pipe(res);
  } catch (err) {
    console.error("Error fetching file:", err);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the file" });
  }
};

const deleteFile = async (req, res) => {
  console.log("Deleting file: ", req.params.id);
  const bucket = new GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads", // replace with your bucket name
  });

  bucket.delete(new mongoose.Types.ObjectId(req.params.id), async (err) => {
    if (err) {
      return res.status(404).json({ err: err });
    }
  });

  console.log("Deleted file 1: ", req.params.id);

  try {
    const fileRes = await File.findOneAndDelete({ fileId: req.params.id });
    console.log("Deleted file 2: ", req.params.id);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Error deleting file:", err);
    return res.status(404).json({ err: err });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  getFileStream,
  deleteFile,
};
