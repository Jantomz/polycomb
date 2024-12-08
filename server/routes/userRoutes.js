const express = require("express");

// Importing the function controllers to manipulate the database
const {
  addCompetition, // Controller to add a competition for a user
  getUserCompetitions, // Controller to get all competitions for a user
  setWordlistPractice, // Controller to set wordlist practice for a user
  getUsersFromCompetition, // Controller to get users from a specific competition
} = require("../controllers/userController");

const router = express.Router(); // Creating a new router object

// GET all competitions for a user by userId
router.get("/competitions/:userId", getUserCompetitions);

// POST a competition to a user
router.post("/add-competition", addCompetition);

// POST to set wordlist practice for a user
router.post("/set-wordlist-practice", setWordlistPractice);

// GET users from a specific competition by competitionCode
router.get("/competition/:competitionCode", getUsersFromCompetition);

module.exports = router; // Exporting the router to be used in other parts of the application
