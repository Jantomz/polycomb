const express = require("express");

// Importing the function controllers to manipulate the database
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

const router = express.Router(); // Creating a new router object

// Route to get all competitions
router.get("/", getCompetitions); // Calls getCompetitions controller

// Route to get a specific competition by code
router.get("/:code", getCompetition); // Uses a URL parameter to identify the competition

// Route to create a new competition
router.post("/", createCompetition); // Calls createCompetition controller

// Route to update a competition by ID
router.put("/:id", updateCompetition); // Uses a URL parameter to identify the competition

// Route to delete a competition by ID
router.delete("/:id", deleteCompetition); // Uses a URL parameter to identify the competition

// Route to add a participant to a competition
router.post("/add-participant", addParticipant); // Calls addParticipant controller

// Route to update the schedule of a competition
router.post("/update-schedule", updateSchedule); // Calls updateSchedule controller

// Route to update the timeline of a competition
router.post("/update-timeline", updateTimeline); // Calls updateTimeline controller

// Route to update the checklist of a competition
router.post("/update-checklist", updateChecklist); // Calls updateChecklist controller

module.exports = router; // Exporting the router object to be used in other parts of the application
