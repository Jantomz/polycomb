const Competition = require("../models/competitionModel");
const mongoose = require("mongoose");

// get all competitions
const getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find({}).sort({ createdAt: -1 });
    res.status(200).json(competitions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch competitions", details: error.message });
  }
};

// get a competition by id
const getCompetition = async (req, res) => {
  try {
    const competition = await Competition.findOne({ code: req.params.code });
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }
    res.status(200).json(competition);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch competition", details: error.message });
  }
};

// create a competition
const createCompetition = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
  }

  try {
    const competition = new Competition(req.body);
    await competition.save();
    res.status(201).json(competition);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create competition", details: error.message });
  }
};

// add a participant
const addParticipant = async (req, res) => {
  const { code, userId } = req.body;

  try {
    const competition = await Competition.findOne({ code });
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    if (competition.participants.includes(userId)) {
      return res.status(400).json({ error: "User already a participant" });
    }

    competition.participants.push(userId);
    await competition.save();
    res.status(200).json(competition);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add participant", details: error.message });
  }
};

// update a competition
const updateCompetition = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
  }

  try {
    const competition = await Competition.findOneAndUpdate(
      { uid: req.params.id },
      req.body,
      { new: true }
    );
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }
    res.status(200).json(competition);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update competition", details: error.message });
  }
};

// delete a competition
const deleteCompetition = async (req, res) => {
  try {
    const competition = await Competition.findOneAndDelete({
      uid: req.params.id,
    });
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }
    res.status(200).json(competition);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete competition", details: error.message });
  }
};

// update schedule
const updateSchedule = async (req, res) => {
  const { code, schedule } = req.body;

  try {
    const competition = await Competition.findOne({ code });
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    competition.schedule = schedule;
    await competition.save();
    res.status(200).json(competition);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update schedule", details: error.message });
  }
};

// update timeline
const updateTimeline = async (req, res) => {
  const { code, timeline } = req.body;

  try {
    const competition = await Competition.findOne({ code });
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    competition.timeline = timeline;
    await competition.save();
    res.status(200).json(competition);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update timeline", details: error.message });
  }
};

// update checklist
const updateChecklist = async (req, res) => {
  const { code, checklist } = req.body;

  try {
    const competition = await Competition.findOne({ code });
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    competition.checklist = checklist;
    await competition.save();
    res.status(200).json(competition);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update checklist", details: error.message });
  }
};

// exporting all the function controllers
module.exports = {
  addParticipant,
  getCompetitions,
  getCompetition,
  createCompetition,
  updateCompetition,
  deleteCompetition,
  updateSchedule,
  updateTimeline,
  updateChecklist,
};
