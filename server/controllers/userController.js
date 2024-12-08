// this file holds functions that hold the logic for manipulating the database, as we don't want to clutter the router file

// imports the workout collection model
const User = require("../models/userModel");

const Competition = require("../models/competitionModel");

const Wordlist = require("../models/wordlistModel");

const mongoose = require("mongoose");

const getCompetitions = async (req, res) => {
  const competitions = await Competition.find({}).sort({ createdAt: -1 }); // sorting in descending order
  res.status(200).json(competitions);
};

const getUserCompetitions = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOne({ uid: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const competitions = await Competition.find({
    code: { $in: user.competitions },
  });

  res.status(200).json(competitions);
};

// add competition to user
const addCompetition = async (req, res) => {
  const { code, userId } = req.body;

  console.log("Adding competition to user: ", code, userId);

  const user = await User.findOne({ uid: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.competitions.includes(code)) {
    return res.status(400).json({ error: "User already has this competition" });
  }

  const competition = await Competition.findOne({ code: code });

  if (!competition) {
    return res.status(404).json({ error: "Competition not found" });
  }

  user.competitions.push(code);

  await user.save();

  res.status(200).json(user);
};

const setWordlistPractice = async (req, res) => {
  const { userId, wordlistId, order, currentIndex } = req.body;

  console.log(
    "Setting practice for user: ",
    userId,
    wordlistId,
    order,
    currentIndex
  );

  const user = await User.findOne({ uid: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const wordlist = user.wordlistsStudyDepth.find(
    (item) => item.wordlistId === wordlistId
  );

  if (wordlist) {
    wordlist.order = order;
    wordlist.currentIndex = currentIndex;
    console.log("Updating wordlist practice", wordlist);
    console.log("User", user);
  } else {
    user.wordlistsStudyDepth.push({
      wordlistId,
      order,
      currentIndex: currentIndex,
    });
  }

  const updatedUser = await User.findOneAndUpdate(
    { uid: userId },
    { $set: { wordlistsStudyDepth: user.wordlistsStudyDepth } },
    { new: true }
  );

  console.log("Updated user", updatedUser);

  res.status(200).json(updatedUser);
};

// get all users from a competition
const getUsersFromCompetition = async (req, res) => {
  const { competitionCode } = req.params;

  const competition = await Competition.findOne({
    code: competitionCode,
  });

  if (!competition) {
    return res.status(404).json({ error: "Competition not found" });
  }

  const users = await User.find({ uid: { $in: competition.participants } });

  res.status(200).json(users);

  console.log("Users from competition", users);
};

// exporting all the function controllers
module.exports = {
  addCompetition,
  getUserCompetitions,
  setWordlistPractice,
  getUsersFromCompetition,
};
