const Wordlist = require("../models/wordlistModel");
const Word = require("../models/wordModel");
const mongoose = require("mongoose");

const getWordlists = async (req, res) => {
  try {
    const competitionCode = req.params.competitionCode;
    const wordlists = await Wordlist.find({ competitionCode }).sort({
      createdAt: -1,
    });
    res.status(200).json(wordlists);
  } catch (error) {
    console.error("Error fetching wordlists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getWordlist = async (req, res) => {
  try {
    const { competitionCode, wordlistId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(wordlistId)) {
      return res.status(400).json({ error: "Invalid wordlist ID" });
    }
    const wordlist = await Wordlist.findOne({
      competitionCode,
      _id: wordlistId,
    });
    if (!wordlist) {
      return res.status(404).json({ error: "Wordlist not found" });
    }
    res.status(200).json(wordlist);
  } catch (error) {
    console.error("Error fetching wordlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createWordlist = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: "Request body is missing or empty" });
    }
    const words = req.body.words;
    if (!words || words.length === 0) {
      return res.status(400).json({ error: "Words array is missing or empty" });
    }
    const wordIds = [];
    for (let i = 0; i < words.length; i++) {
      const word = new Word(words[i]);
      await word.save();
      wordIds.push(word._id);
    }
    req.body.words = wordIds;
    const wordlist = new Wordlist(req.body);
    await wordlist.save();
    res.status(201).json(wordlist);
  } catch (error) {
    console.error("Error creating wordlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getWord = async (req, res) => {
  try {
    const { wordId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(wordId)) {
      return res.status(400).json({ error: "Invalid word ID" });
    }
    const word = await Word.findById(wordId);
    if (!word) {
      return res.status(404).json({ error: "Word not found" });
    }
    res.status(200).json(word);
  } catch (error) {
    console.error("Error fetching word:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateWord = async (req, res) => {
  try {
    const { wordId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(wordId)) {
      return res.status(400).json({ error: "Invalid word ID" });
    }
    const word = await Word.findById(wordId);
    if (!word) {
      return res.status(404).json({ error: "Word not found" });
    }
    const updatedWord = await Word.findByIdAndUpdate(wordId, req.body, {
      new: true,
    });
    res.status(200).json(updatedWord);
  } catch (error) {
    console.error("Error updating word:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteWord = async (req, res) => {
  try {
    const { wordId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(wordId)) {
      return res.status(400).json({ error: "Invalid word ID" });
    }
    await Word.findByIdAndDelete(wordId);
    await Wordlist.findOneAndUpdate(
      { words: wordId },
      { $pull: { words: wordId } }
    );
    res.status(200).json({ message: "Word deleted successfully" });
  } catch (error) {
    console.error("Error deleting word:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteWordlist = async (req, res) => {
  try {
    const { wordlistId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(wordlistId)) {
      return res.status(400).json({ error: "Invalid wordlist ID" });
    }
    await Wordlist.findByIdAndDelete(wordlistId);
    await Word.deleteMany({ wordlistId });
    res
      .status(200)
      .json({ message: "Wordlist and words deleted successfully" });
  } catch (error) {
    console.error("Error deleting wordlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getWordlists,
  getWordlist,
  createWordlist,
  getWord,
  updateWord,
  deleteWord,
  deleteWordlist,
};
