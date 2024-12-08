// import mongoose as it is the component that allows schemas, MongoDB alone is schema-less
const mongoose = require("mongoose");

// initializing the mongoose schema object into our own object
const Schema = mongoose.Schema;

const audioSchema = new Schema(
  {
    audioname: {
      type: String,
      required: true,
    },
    audioId: {
      type: String,
      required: true,
    },
    creatorId: {
      type: String,
      required: true,
    },
    wordId: {
      type: String,
      required: true,
    },
    audioType: {
      type: String,
      required: true,
      default: "audio/mpeg",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Audio", audioSchema);
