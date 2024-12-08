// Import mongoose to interact with MongoDB using schemas
const mongoose = require("mongoose");

// Initialize the mongoose schema object
const Schema = mongoose.Schema;

// Define the schema for the file collection
const fileSchema = new Schema(
  {
    // Name of the file, required for identification
    filename: {
      type: String,
      required: true,
    },
    // Unique identifier for the file, required for referencing
    fileId: {
      type: String,
      required: true,
    },
    // ID of the user who created the file, required for ownership tracking
    creatorId: {
      type: String,
      required: true,
    },
    // Code of the competition the file is associated with, required for categorization
    competitionCode: {
      type: String,
      required: true,
    },
    // Type of the file, defaults to 'application/pdf' if not specified
    fileType: {
      type: String,
      required: true,
      default: "application/pdf",
    },
  },
  // Automatically add createdAt and updatedAt timestamps
  { timestamps: true }
);

// Export the model to use it in other parts of the application
module.exports = mongoose.model("File", fileSchema);
