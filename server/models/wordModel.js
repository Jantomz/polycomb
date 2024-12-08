// Import mongoose to use its schema capabilities, as MongoDB alone is schema-less
const mongoose = require("mongoose");

// Initialize the mongoose schema object into our own object
const Schema = mongoose.Schema;

// Create the schema object to model the properties of a word
const wordSchema = new Schema(
  {
    word: {
      type: String, // Define the type of the word property as String
      required: true, // Make the word property mandatory
    },
    pronunciation: {
      type: String, // Define the type of the pronunciation property as String
      required: true, // Make the pronunciation property mandatory
    },
    audioId: {
      type: String, // Define the type of the audioId property as String
      required: false, // Make the audioId property optional
    },
    partOfSpeech: {
      type: String, // Define the type of the partOfSpeech property as String
      required: true, // Make the partOfSpeech property mandatory
    },
    definition: {
      type: String, // Define the type of the definition property as String
      required: true, // Make the definition property mandatory
    },
    etymology: {
      type: String, // Define the type of the etymology property as String
      required: true, // Make the etymology property mandatory
    },
    sentence: {
      type: String, // Define the type of the sentence property as String
      required: true, // Make the sentence property mandatory
    },
    notes: {
      type: String, // Define the type of the notes property as String
      required: false, // Make the notes property optional
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Export the model to use it in other parts of the application
module.exports = mongoose.model("Word", wordSchema);
