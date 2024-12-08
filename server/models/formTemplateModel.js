// Import mongoose to define schemas, as MongoDB itself is schema-less
const mongoose = require("mongoose");

// Initialize the mongoose schema object
const Schema = mongoose.Schema;

// Define the schema for form templates
const formTemplateSchema = new Schema(
  {
    title: {
      type: String, // Title of the form template
      required: true, // Title is mandatory
    },
    creatorId: {
      type: String, // ID of the user who created the form
      required: true, // Creator ID is mandatory
    },
    competitionCode: {
      type: String, // Code for the associated competition
      required: true, // Competition code is mandatory
    },
    fields: {
      type: Array, // Array to hold form fields
      default: [], // Default to an empty array if no fields are provided
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt timestamps
);

// Export the model to use it in other parts of the application
module.exports = mongoose.model("FormTemplate", formTemplateSchema);
