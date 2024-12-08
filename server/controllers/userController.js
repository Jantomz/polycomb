const User = require("../models/userModel");
const Competition = require("../models/competitionModel");
const Wordlist = require("../models/wordlistModel");

const getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find({}).sort({ createdAt: -1 });
    res.status(200).json(competitions);
  } catch (error) {
    console.error("Error fetching competitions:", error);
    res.status(500).json({ error: "Failed to fetch competitions" });
  }
};

const getUserCompetitions = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ uid: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const competitions = await Competition.find({
      code: { $in: user.competitions },
    });

    res.status(200).json(competitions);
  } catch (error) {
    console.error("Error fetching user competitions:", error);
    res.status(500).json({ error: "Failed to fetch user competitions" });
  }
};

const addCompetition = async (req, res) => {
  const { code, userId } = req.body;

  try {
    const user = await User.findOne({ uid: userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.competitions.includes(code)) {
      return res
        .status(400)
        .json({ error: "User already has this competition" });
    }

    const competition = await Competition.findOne({ code: code });

    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    user.competitions.push(code);
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error adding competition to user:", error);
    res.status(500).json({ error: "Failed to add competition to user" });
  }
};

const setWordlistPractice = async (req, res) => {
  const { userId, wordlistId, order, currentIndex } = req.body;

  try {
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

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error setting wordlist practice:", error);
    res.status(500).json({ error: "Failed to set wordlist practice" });
  }
};

const getUsersFromCompetition = async (req, res) => {
  const { competitionCode } = req.params;

  try {
    const competition = await Competition.findOne({ code: competitionCode });

    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }

    const users = await User.find({ uid: { $in: competition.participants } });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users from competition:", error);
    res.status(500).json({ error: "Failed to fetch users from competition" });
  }
};

module.exports = {
  addCompetition,
  getUserCompetitions,
  setWordlistPractice,
  getUsersFromCompetition,
  getCompetitions,
};
