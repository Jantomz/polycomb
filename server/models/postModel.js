// import mongoose as it is the component that allows schemas, MongoDB alone is schema-less
const mongoose = require("mongoose");

// initializing the mongoose schema object into our own object
const Schema = mongoose.Schema;

// creating the schema object to model the properties of a workout, defining the schema that must be adhered to
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    competitionCode: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    creatorId: {
      type: String,
      required: true,
    },
    content: {
      type: [String],
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
