// Import mongoose to interact with MongoDB using schemas
const mongoose = require("mongoose");

// Initialize the mongoose schema object
const Schema = mongoose.Schema;

// Define the schema for a post
const postSchema = new Schema(
  {
    // Title of the post, required field
    title: {
      type: String,
      required: true,
    },
    // Unique code for the competition, required field
    competitionCode: {
      type: String,
      required: true,
    },
    // Description of the post, required field
    description: {
      type: String,
      required: true,
    },
    // Tags associated with the post, defaults to an empty array
    tags: {
      type: [String],
      default: [],
    },
    // ID of the creator, required field
    creatorId: {
      type: String,
      required: true,
    },
    // Content of the post, required field, stored as an array of strings
    content: {
      type: [String],
      required: true,
    },
    // Images associated with the post, required field, stored as an array of strings
    images: {
      type: [String],
      required: true,
    },
  },
  // Automatically add createdAt and updatedAt timestamps
  { timestamps: true }
);

// Export the model to use it in other parts of the application
module.exports = mongoose.model("Post", postSchema);
