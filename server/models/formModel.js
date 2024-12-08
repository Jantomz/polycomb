// Import mongoose to interact with MongoDB using schemas
const mongoose = require("mongoose");

// Initialize the mongoose schema object
const Schema = mongoose.Schema;

// Define the schema for the form collection
const formSchema = new Schema(
  {
    // Title of the form, required field
    title: {
      type: String,
      required: true,
    },
    // ID of the template used to create the form, required field
    templateId: {
      type: String,
      required: true,
    },
    // ID of the user who created the form, required field
    creatorId: {
      type: String,
      required: true,
    },
    // Code for the competition associated with the form, required field
    competitionCode: {
      type: String,
      required: true,
    },
    // Array of fields in the form, default is an empty array
    fields: {
      type: Array,
      default: [],
    },
    // Array of answers submitted in the form, default is an empty array
    answers: {
      type: Array,
      default: [],
    },
    // Signature of the form, default is an empty string
    signature: {
      type: String,
      default: "",
    },
  },
  // Automatically add createdAt and updatedAt timestamps
  { timestamps: true }
);

// Export the model to use it in other parts of the application
module.exports = mongoose.model("Form", formSchema);
