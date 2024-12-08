// this file holds functions that hold the logic for manipulating the database, as we don't want to clutter the router file

// imports the workout collection model
const Competition = require("../models/competitionModel");

const mongoose = require("mongoose");

// TODO: Do lots of authenticating the inputs

// get all competitions
const getCompetitions = async (req, res) => {
  const competitions = await Competition.find({}).sort({ createdAt: -1 }); // sorting in descending order
  res.status(200).json(competitions);
};

// get a competition by id
const getCompetition = async (req, res) => {
  const competition = await Competition.findOne({ code: req.params.code });
  if (!competition) {
    return res.status(404).json({ error: "Competition not found" });
  }
  res.status(200).json(competition);
};

// create a competition
const createCompetition = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
  }

  console.log("Creating competition: ", req.body);

  const competition = new Competition(req.body);
  await competition.save();
  res.status(201).json(competition);
};

const addParticipant = async (req, res) => {
  const { code, userId } = req.body;

  console.log("Adding participant to competition: ", code, userId);

  const competition = await Competition.findOne({ code: code });

  if (!competition) {
    return res.status(404).json({ error: "Competition not found" });
  }

  if (competition.participants.includes(userId)) {
    return res.status(400).json({ error: "User already a participant" });
  }

  competition.participants.push(userId);

  await competition.save();

  res.status(200).json(competition);
};

// update a competition
const updateCompetition = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
  }

  const competition = await Competition.findOneAndUpdate(
    { uid: req.params.id },
    req.body,
    { new: true }
  );
  if (!competition) {
    return res.status(404).json({ error: "Competition not found" });
  }
  res.status(200).json(competition);
};

// delete a competition
const deleteCompetition = async (req, res) => {
  const competition = await Competition.findOneAndDelete({
    uid: req.params.id,
  });
  if (!competition) {
    return res.status(404).json({ error: "Competition not found" });
  }
  res.status(200).json(competition);
};

const updateSchedule = async (req, res) => {
  const { code, schedule } = req.body;

  console.log("Updating schedule for competition: ", code, schedule);

  const competition = await Competition.findOne({ code: code });

  if (!competition) {
    return res.status(404).json({ error: "Competition not found" });
  }

  competition.schedule = schedule;

  await competition.save();

  res.status(200).json(competition);
};

const updateTimeline = async (req, res) => {
  const { code, timeline } = req.body;

  console.log("Updating timeline for competition: ", code, timeline);

  const competition = await Competition.findOne({ code: code });

  if (!competition) {
    return res.status(404).json({ error: "Competition not found" });
  }

  competition.timeline = timeline;

  await competition.save();

  res.status(200).json(competition);
};

const updateChecklist = async (req, res) => {
  const { code, checklist } = req.body;

  console.log("Updating checklist for competition: ", code, checklist);

  const competition = await Competition.findOne({ code });

  if (!competition) {
    return res.status(404).json({ error: "Competition not found" });
  }

  competition.checklist = checklist;

  await competition.save();

  res.status(200).json(competition);
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
