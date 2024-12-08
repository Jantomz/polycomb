const User = require("../models/userModel"); // Import User model
const Competition = require("../models/competitionModel"); // Import Competition model
const Wordlist = require("../models/wordlistModel"); // Import Wordlist model

const getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find({}).sort({ createdAt: -1 }); // Fetch all competitions sorted by creation date
    res.status(200).json(competitions); // Respond with the competitions
  } catch (error) {
    console.error("Error fetching competitions:", error); // Log error for debugging
    res.status(500).json({ error: "Failed to fetch competitions" }); // Respond with error message
  }
};

const getUserCompetitions = async (req, res) => {
  const { userId } = req.params; // Extract userId from request parameters

  try {
    const user = await User.findOne({ uid: userId }); // Find user by uid

    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Respond with 404 if user not found
    }

    const competitions = await Competition.find({
      code: { $in: user.competitions }, // Find competitions where code is in user's competitions array
    });

    res.status(200).json(competitions); // Respond with user's competitions
  } catch (error) {
    console.error("Error fetching user competitions:", error); // Log error for debugging
    res.status(500).json({ error: "Failed to fetch user competitions" }); // Respond with error message
  }
};

const addCompetition = async (req, res) => {
  const { code, userId } = req.body; // Extract code and userId from request body

  try {
    const user = await User.findOne({ uid: userId }); // Find user by uid

    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Respond with 404 if user not found
    }

    if (user.competitions.includes(code)) {
      return res
        .status(400)
        .json({ error: "User already has this competition" }); // Respond with 400 if user already has the competition
    }

    const competition = await Competition.findOne({ code: code }); // Find competition by code

    if (!competition) {
      return res.status(404).json({ error: "Competition not found" }); // Respond with 404 if competition not found
    }

    user.competitions.push(code); // Add competition code to user's competitions array
    await user.save(); // Save updated user

    res.status(200).json(user); // Respond with updated user
  } catch (error) {
    console.error("Error adding competition to user:", error); // Log error for debugging
    res.status(500).json({ error: "Failed to add competition to user" }); // Respond with error message
  }
};

const setWordlistPractice = async (req, res) => {
  const { userId, wordlistId, order, currentIndex } = req.body; // Extract data from request body

  try {
    const user = await User.findOne({ uid: userId }); // Find user by uid

    if (!user) {
      return res.status(404).json({ error: "User not found" }); // Respond with 404 if user not found
    }

    const wordlist = user.wordlistsStudyDepth.find(
      (item) => item.wordlistId === wordlistId // Find wordlist in user's wordlistsStudyDepth array
    );

    if (wordlist) {
      wordlist.order = order; // Update order if wordlist exists
      wordlist.currentIndex = currentIndex; // Update currentIndex if wordlist exists
    } else {
      user.wordlistsStudyDepth.push({
        wordlistId,
        order,
        currentIndex: currentIndex, // Add new wordlist if it doesn't exist
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { uid: userId }, // Find user by uid
      { $set: { wordlistsStudyDepth: user.wordlistsStudyDepth } }, // Update user's wordlistsStudyDepth
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedUser); // Respond with updated user
  } catch (error) {
    console.error("Error setting wordlist practice:", error); // Log error for debugging
    res.status(500).json({ error: "Failed to set wordlist practice" }); // Respond with error message
  }
};

const getUsersFromCompetition = async (req, res) => {
  const { competitionCode } = req.params; // Extract competitionCode from request parameters

  try {
    const competition = await Competition.findOne({ code: competitionCode }); // Find competition by code

    if (!competition) {
      return res.status(404).json({ error: "Competition not found" }); // Respond with 404 if competition not found
    }

    const users = await User.find({ uid: { $in: competition.participants } }); // Find users whose uid is in competition's participants array

    res.status(200).json(users); // Respond with users
  } catch (error) {
    console.error("Error fetching users from competition:", error); // Log error for debugging
    res.status(500).json({ error: "Failed to fetch users from competition" }); // Respond with error message
  }
};

module.exports = {
  addCompetition,
  getUserCompetitions,
  setWordlistPractice,
  getUsersFromCompetition,
  getCompetitions,
};
