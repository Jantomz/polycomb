const express = require("express");

// importing the function controllers to manipulate db
const {
  addCompetition,
  getUserCompetitions,
  setWordlistPractice,
  getUsersFromCompetition,
} = require("../controllers/userController");

const router = express.Router();

// GET all competitions for a user
router.get("/competitions/:userId", getUserCompetitions);

// POST a competition to a user
router.post("/add-competition", addCompetition);

router.post("/set-wordlist-practice", setWordlistPractice);

router.get("/competition/:competitionCode", getUsersFromCompetition);

module.exports = router;
