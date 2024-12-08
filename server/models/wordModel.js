// import mongoose as it is the component that allows schemas, MongoDB alone is schema-less
const mongoose = require("mongoose");

// initializing the mongoose schema object into our own object
const Schema = mongoose.Schema;

// creating the schema object to model the properties of a word, defining the schema that must be adhered to
const wordSchema = new Schema(
  {
    word: {
      type: String,
      required: true,
    },
    pronunciation: {
      type: String,
      required: true,
    },
    // The audio file id of the word
    audioId: {
      type: String,
      required: false,
    },
    partOfSpeech: {
      type: String,
      required: true,
    },
    definition: {
      type: String,
      required: true,
    },
    etymology: {
      type: String,
      required: true,
    },
    sentence: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Word", wordSchema);
