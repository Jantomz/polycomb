// import mongoose as it is the component that allows schemas, MongoDB alone is schema-less
const mongoose = require("mongoose");

// initializing the mongoose schema object into our own object
const Schema = mongoose.Schema;

// creating the schema object to model the properties of a workout, defining the schema that must be adhered to
const competitionSchema = new Schema(
  {
    // Making the code 5 digits unique
    code: {
      type: String,
      required: true,
      unique: true,
      index: true, // Adding index to make it a primary key
      match: [/^\d{5}$/, "Code must be 5 digits"], // Regex to ensure it's 5 digits
    },
    wordlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wordlist",
      },
    ],
    participants: [String],
    // The admins of the competition
    admins: [String],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    checklist: {
      type: Array,
      default: [],
    },

    timeline: {
      type: Array,
      default: [],
    },
    schedule: {
      type: Array,
      default: [],
    },
    // The start date of the competition
    startDate: {
      type: Date,
      required: true,
    },
    // The end date of the competition
    endDate: {
      type: Date,
      required: true,
    },
    // The title of the competition
    title: {
      type: String,
      required: true,
    },
    // The description of the competition
    description: {
      type: String,
      required: true,
    },
    // The rules of the competition
    rules: {
      type: String,
    },
    // The prizes of the competition
    prizes: {
      type: String,
    },
    // The status of the competition
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    genFiles: {
      type: Array,
      default: [],
    },

    forms: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
    },
  },
  { timestamps: true }
);

competitionSchema.index({ code: 1 }, { unique: true }); // Ensuring uid is indexed and unique

module.exports = mongoose.model("Competition", competitionSchema);
