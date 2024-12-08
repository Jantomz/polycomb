// import mongoose as it is the component that allows schemas, MongoDB alone is schema-less
const mongoose = require("mongoose");

// initializing the mongoose schema object into our own object
const Schema = mongoose.Schema;

// creating the schema object to model the properties of a workout, defining the schema that must be adhered to
const userSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true, // Adding index to make it a primary key
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
    },
    competitions: [String],
    forms: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
    },
    wordlistsStudyDepth: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.index({ uid: 1 }, { unique: true }); // Ensuring uid is indexed and unique

module.exports = mongoose.model("User", userSchema);
