// Import mongoose to define schemas, as MongoDB itself is schema-less
const mongoose = require("mongoose");

// Initialize the mongoose schema object
const Schema = mongoose.Schema;

// Define the schema for audio documents
const audioSchema = new Schema(
  {
    audioname: {
      type: String, // The name of the audio file
      required: true, // This field is mandatory
    },
    audioId: {
      type: String, // Unique identifier for the audio
      required: true, // This field is mandatory
    },
    creatorId: {
      type: String, // ID of the user who created the audio
      required: true, // This field is mandatory
    },
    wordId: {
      type: String, // ID of the associated word
      required: true, // This field is mandatory
    },
    audioType: {
      type: String, // MIME type of the audio file
      required: true, // This field is mandatory
      default: "audio/mpeg", // Default MIME type is set to 'audio/mpeg'
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Export the model to use it in other parts of the application
module.exports = mongoose.model("Audio", audioSchema);
