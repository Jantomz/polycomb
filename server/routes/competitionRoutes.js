const express = require("express");

// importing the function controllers to manipulate db
const {
  getCompetitions,
  getCompetition,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  addParticipant,
  updateSchedule,
  updateTimeline,
  updateChecklist,
} = require("../controllers/competitionController");

const router = express.Router();

// GET all competitions
router.get("/", getCompetitions);

router.get("/:code", getCompetition);

router.post("/", createCompetition);

router.put("/:id", updateCompetition);

router.delete("/:id", deleteCompetition);

router.post("/add-participant", addParticipant);

router.post("/update-schedule", updateSchedule);

router.post("/update-timeline", updateTimeline);

router.post("/update-checklist", updateChecklist);

module.exports = router;
