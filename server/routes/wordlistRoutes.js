const express = require("express");

// importing the function controllers to manipulate db
const {
  getWordlists,
  getWordlist,
  createWordlist,
  getWord,
  updateWord,
} = require("../controllers/wordlistController");

const router = express.Router();

// GET all wordlists
router.get("/competition/:competitionCode", getWordlists);

router.get("/competition/:competitionCode/:wordlistId", getWordlist);

router.post("/", createWordlist);

router.get("/word/:wordId", getWord);

router.patch("/word/:wordId", updateWord);

module.exports = router;
