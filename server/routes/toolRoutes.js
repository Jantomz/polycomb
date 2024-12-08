const express = require("express");

// importing the function controllers to manipulate db
const {
  generateWordlist,
  generateDifficultyRating,
} = require("../controllers/toolController.js");

const router = express.Router();

router.get("/generate-wordlist/:size", generateWordlist);

router.get("/generate-difficulty-rating/:word", generateDifficultyRating);

module.exports = router;
