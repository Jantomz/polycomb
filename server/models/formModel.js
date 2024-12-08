// import mongoose as it is the component that allows schemas, MongoDB alone is schema-less
const mongoose = require("mongoose");

// initializing the mongoose schema object into our own object
const Schema = mongoose.Schema;

const formSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    templateId: {
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
    fields: {
      type: Array,
      default: [],
    },
    answers: {
      type: Array,
      default: [],
    },
    signature: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Form", formSchema);
