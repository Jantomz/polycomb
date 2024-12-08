const Competition = require("../models/competitionModel"); // Import the Competition model
const mongoose = require("mongoose");

// get all competitions
const getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find({}).sort({ createdAt: -1 }); // Fetch all competitions sorted by creation date in descending order
    res.status(200).json(competitions); // Send the competitions as a JSON response with status 200
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch competitions", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

// get a competition by id
const getCompetition = async (req, res) => {
  try {
    const competition = await Competition.findOne({ code: req.params.code }); // Find a competition by its unique code
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" }); // Return 404 if competition is not found
    }
    res.status(200).json(competition); // Send the found competition as a JSON response
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch competition", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

// create a competition
const createCompetition = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" }); // Validate request body
  }

  try {
    const competition = new Competition(req.body); // Create a new competition instance with request body data
    await competition.save(); // Save the new competition to the database
    res.status(201).json(competition); // Send the created competition as a JSON response with status 201
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create competition", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

// add a participant
const addParticipant = async (req, res) => {
  const { code, userId } = req.body; // Destructure code and userId from request body

  try {
    const competition = await Competition.findOne({ code }); // Find the competition by its code
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" }); // Return 404 if competition is not found
    }

    if (competition.participants.includes(userId)) {
      return res.status(400).json({ error: "User already a participant" }); // Check if user is already a participant
    }

    competition.participants.push(userId); // Add userId to participants array
    await competition.save(); // Save the updated competition
    res.status(200).json(competition); // Send the updated competition as a JSON response
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to add participant", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

// update a competition
const updateCompetition = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" }); // Validate request body
  }

  try {
    const competition = await Competition.findOneAndUpdate(
      { uid: req.params.id }, // Find competition by unique id
      req.body, // Update competition with request body data
      { new: true } // Return the updated document
    );
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" }); // Return 404 if competition is not found
    }
    res.status(200).json(competition); // Send the updated competition as a JSON response
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update competition", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

// delete a competition
const deleteCompetition = async (req, res) => {
  try {
    const competition = await Competition.findOneAndDelete({
      uid: req.params.id, // Find competition by unique id and delete it
    });
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" }); // Return 404 if competition is not found
    }
    res.status(200).json(competition); // Send the deleted competition as a JSON response
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete competition", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

// update schedule
const updateSchedule = async (req, res) => {
  const { code, schedule } = req.body; // Destructure code and schedule from request body

  try {
    const competition = await Competition.findOne({ code }); // Find the competition by its code
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" }); // Return 404 if competition is not found
    }

    competition.schedule = schedule; // Update competition schedule
    await competition.save(); // Save the updated competition
    res.status(200).json(competition); // Send the updated competition as a JSON response
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update schedule", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

// update timeline
const updateTimeline = async (req, res) => {
  const { code, timeline } = req.body; // Destructure code and timeline from request body

  try {
    const competition = await Competition.findOne({ code }); // Find the competition by its code
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" }); // Return 404 if competition is not found
    }

    competition.timeline = timeline; // Update competition timeline
    await competition.save(); // Save the updated competition
    res.status(200).json(competition); // Send the updated competition as a JSON response
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update timeline", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

// update checklist
const updateChecklist = async (req, res) => {
  const { code, checklist } = req.body; // Destructure code and checklist from request body

  try {
    const competition = await Competition.findOne({ code }); // Find the competition by its code
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" }); // Return 404 if competition is not found
    }

    competition.checklist = checklist; // Update competition checklist
    await competition.save(); // Save the updated competition
    res.status(200).json(competition); // Send the updated competition as a JSON response
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update checklist", details: error.message }); // Handle errors and send a 500 status with error details
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
