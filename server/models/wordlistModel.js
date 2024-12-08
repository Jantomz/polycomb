// Import mongoose to use its schema capabilities
const mongoose = require("mongoose");

// Initialize the mongoose schema object
const Schema = mongoose.Schema;

// Define the schema for a wordlist
const wordlistSchema = new Schema(
  {
    // Title of the wordlist, must be a string and is required
    title: {
      type: String,
      required: true,
    },
    // Description of the wordlist, must be a string and is required
    description: {
      type: String,
      required: true,
    },
    // Unique code for competition, must be a string and is required
    competitionCode: {
      type: String,
      required: true,
    },
    // ID of the creator, must be a string and is required
    creatorId: {
      type: String,
      required: true,
    },
    // Array of word references, each must be an ObjectId referring to a Word document
    words: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Word", // Reference to the Word model
      },
    ],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Export the model to use it in other parts of the application
module.exports = mongoose.model("Wordlist", wordlistSchema);
