// Import mongoose to define schemas, as MongoDB alone is schema-less
const mongoose = require("mongoose");

// Initialize the mongoose schema object
const Schema = mongoose.Schema;

// Define the schema for a competition
const competitionSchema = new Schema(
  {
    // Code must be a unique 5-digit string
    code: {
      type: String,
      required: true, // Code is mandatory
      unique: true, // Code must be unique
      index: true, // Indexing for faster queries
      match: [/^\d{5}$/, "Code must be 5 digits"], // Regex to ensure it's 5 digits
    },
    // List of participant IDs
    participants: [String],
    // List of admin IDs
    admins: [String],
    // Checklist items, default to an empty array
    checklist: {
      type: Array,
      default: [],
    },
    // Timeline events, default to an empty array
    timeline: {
      type: Array,
      default: [],
    },
    // Schedule items, default to an empty array
    schedule: {
      type: Array,
      default: [],
    },
    // Start date of the competition
    startDate: {
      type: Date,
      required: true, // Start date is mandatory
    },
    // End date of the competition
    endDate: {
      type: Date,
      required: true, // End date is mandatory
    },
    // Title of the competition
    title: {
      type: String,
      required: true, // Title is mandatory
    },
    // Description of the competition
    description: {
      type: String,
      required: true, // Description is mandatory
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Ensure the code field is indexed and unique
competitionSchema.index({ code: 1 }, { unique: true });

module.exports = mongoose.model("Competition", competitionSchema);
