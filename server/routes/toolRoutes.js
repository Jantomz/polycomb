const express = require("express"); // Importing the express module to create a router

// Importing the function controllers to manipulate db
const {
  generateWordlist, // Function to generate a word list of a given size
  generateDifficultyRating, // Function to generate a difficulty rating for a given word
} = require("../controllers/toolController.js");

const router = express.Router(); // Creating a new router object

// Route to generate a word list of a specified size
router.get("/generate-wordlist/:size", generateWordlist);

// Route to generate a difficulty rating for a specified word
router.get("/generate-difficulty-rating/:word", generateDifficultyRating);

module.exports = router; // Exporting the router to be used in other parts of the application
