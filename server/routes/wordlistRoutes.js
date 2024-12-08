const express = require("express"); // Importing the express module to create the router

// Importing the function controllers to manipulate db
const {
  getWordlists, // Controller to get all wordlists for a competition
  getWordlist, // Controller to get a specific wordlist by ID
  createWordlist, // Controller to create a new wordlist
  getWord, // Controller to get a specific word by ID
  updateWord, // Controller to update a specific word by ID
  deleteWord, // Controller to delete a specific word by ID
  deleteWordlist, // Controller to delete a specific wordlist by ID
} = require("../controllers/wordlistController");

const router = express.Router(); // Creating a new router object

// GET all wordlists for a specific competition
router.get("/competition/:competitionCode", getWordlists); // Route to get all wordlists for a given competition code

// GET a specific wordlist by ID for a competition
router.get("/competition/:competitionCode/:wordlistId", getWordlist); // Route to get a specific wordlist by its ID within a competition

// POST a new wordlist
router.post("/", createWordlist); // Route to create a new wordlist

// GET a specific word by ID
router.get("/word/:wordId", getWord); // Route to get a specific word by its ID

// PATCH (update) a specific word by ID
router.patch("/word/:wordId", updateWord); // Route to update a specific word by its ID

// DELETE a specific word by ID
router.delete("/word/:wordId", deleteWord); // Route to delete a specific word by its ID

// DELETE a specific wordlist by ID
router.delete("/wordlist/:wordlistId", deleteWordlist); // Route to delete a specific wordlist by its ID

module.exports = router; // Exporting the router to be used in other parts of the application
