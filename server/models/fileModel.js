// import mongoose as it is the component that allows schemas, MongoDB alone is schema-less
const mongoose = require("mongoose");

// initializing the mongoose schema object into our own object
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    fileId: {
      type: String,
      required: true,
    },
    creatorId: {
      type: String,
      required: true,
    },
    competitionCode: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      default: "application/pdf",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("File", fileSchema);
