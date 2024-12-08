// Import mongoose to define schemas, as MongoDB alone is schema-less
const mongoose = require("mongoose");

// Initialize the mongoose schema object
const Schema = mongoose.Schema;

// Define the schema for the User model
const userSchema = new Schema(
  {
    uid: {
      type: String,
      required: true, // UID is required for each user
      unique: true, // UID must be unique across all users
      index: true, // Indexing UID for faster query performance
    },
    role: {
      type: String,
      enum: ["admin", "user"], // Role can only be 'admin' or 'user'
      required: true, // Role is required to determine user permissions
    },
    competitions: [String], // Array of competition IDs the user is part of
    forms: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form", // Reference to the Form model
    },
    wordlistsStudyDepth: {
      type: Array,
      default: [], // Default to an empty array if not provided
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Ensure UID is indexed and unique for efficient querying and data integrity
userSchema.index({ uid: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema); // Export the User model
