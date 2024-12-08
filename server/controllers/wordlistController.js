const Wordlist = require("../models/wordlistModel"); // Import Wordlist model
const Word = require("../models/wordModel"); // Import Word model
const mongoose = require("mongoose"); // Import mongoose for MongoDB interactions

const getWordlists = async (req, res) => {
  try {
    const competitionCode = req.params.competitionCode; // Extract competition code from request parameters
    const wordlists = await Wordlist.find({ competitionCode }).sort({
      createdAt: -1, // Sort wordlists by creation date in descending order
    });
    res.status(200).json(wordlists); // Send the wordlists as a JSON response
  } catch (error) {
    console.error("Error fetching wordlists:", error); // Log error to the console
    res.status(500).json({ error: "Internal server error" }); // Send a 500 status code for server errors
  }
};

const getWordlist = async (req, res) => {
  try {
    const { competitionCode, wordlistId } = req.params; // Extract competition code and wordlist ID from request parameters
    if (!mongoose.Types.ObjectId.isValid(wordlistId)) {
      return res.status(400).json({ error: "Invalid wordlist ID" }); // Validate wordlist ID format
    }
    const wordlist = await Wordlist.findOne({
      competitionCode,
      _id: wordlistId, // Find wordlist by competition code and ID
    });
    if (!wordlist) {
      return res.status(404).json({ error: "Wordlist not found" }); // Handle case where wordlist is not found
    }
    res.status(200).json(wordlist); // Send the wordlist as a JSON response
  } catch (error) {
    console.error("Error fetching wordlist:", error); // Log error to the console
    res.status(500).json({ error: "Internal server error" }); // Send a 500 status code for server errors
  }
};

const createWordlist = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ error: "Request body is missing or empty" }); // Validate request body
    }
    const words = req.body.words; // Extract words array from request body
    if (!words || words.length === 0) {
      return res.status(400).json({ error: "Words array is missing or empty" }); // Validate words array
    }
    const wordIds = [];
    for (let i = 0; i < words.length; i++) {
      const word = new Word(words[i]); // Create new Word document for each word
      await word.save(); // Save each word to the database
      wordIds.push(word._id); // Collect word IDs
    }
    req.body.words = wordIds; // Replace words array with word IDs
    const wordlist = new Wordlist(req.body); // Create new Wordlist document
    await wordlist.save(); // Save wordlist to the database
    res.status(201).json(wordlist); // Send the created wordlist as a JSON response
  } catch (error) {
    console.error("Error creating wordlist:", error); // Log error to the console
    res.status(500).json({ error: "Internal server error" }); // Send a 500 status code for server errors
  }
};

const getWord = async (req, res) => {
  try {
    const { wordId } = req.params; // Extract word ID from request parameters
    if (!mongoose.Types.ObjectId.isValid(wordId)) {
      return res.status(400).json({ error: "Invalid word ID" }); // Validate word ID format
    }
    const word = await Word.findById(wordId); // Find word by ID
    if (!word) {
      return res.status(404).json({ error: "Word not found" }); // Handle case where word is not found
    }
    res.status(200).json(word); // Send the word as a JSON response
  } catch (error) {
    console.error("Error fetching word:", error); // Log error to the console
    res.status(500).json({ error: "Internal server error" }); // Send a 500 status code for server errors
  }
};

const updateWord = async (req, res) => {
  try {
    const { wordId } = req.params; // Extract word ID from request parameters
    if (!mongoose.Types.ObjectId.isValid(wordId)) {
      return res.status(400).json({ error: "Invalid word ID" }); // Validate word ID format
    }
    const word = await Word.findById(wordId); // Find word by ID
    if (!word) {
      return res.status(404).json({ error: "Word not found" }); // Handle case where word is not found
    }
    const updatedWord = await Word.findByIdAndUpdate(wordId, req.body, {
      new: true, // Return the updated document
    });
    res.status(200).json(updatedWord); // Send the updated word as a JSON response
  } catch (error) {
    console.error("Error updating word:", error); // Log error to the console
    res.status(500).json({ error: "Internal server error" }); // Send a 500 status code for server errors
  }
};

const deleteWord = async (req, res) => {
  try {
    const { wordId } = req.params; // Extract word ID from request parameters
    if (!mongoose.Types.ObjectId.isValid(wordId)) {
      return res.status(400).json({ error: "Invalid word ID" }); // Validate word ID format
    }
    await Word.findByIdAndDelete(wordId); // Delete word by ID
    await Wordlist.findOneAndUpdate(
      { words: wordId }, // Find wordlist containing the word
      { $pull: { words: wordId } } // Remove word ID from wordlist
    );
    res.status(200).json({ message: "Word deleted successfully" }); // Send success message
  } catch (error) {
    console.error("Error deleting word:", error); // Log error to the console
    res.status(500).json({ error: "Internal server error" }); // Send a 500 status code for server errors
  }
};

const deleteWordlist = async (req, res) => {
  try {
    const { wordlistId } = req.params; // Extract wordlist ID from request parameters
    if (!mongoose.Types.ObjectId.isValid(wordlistId)) {
      return res.status(400).json({ error: "Invalid wordlist ID" }); // Validate wordlist ID format
    }
    await Wordlist.findByIdAndDelete(wordlistId); // Delete wordlist by ID
    await Word.deleteMany({ wordlistId }); // Delete all words associated with the wordlist
    res
      .status(200)
      .json({ message: "Wordlist and words deleted successfully" }); // Send success message
  } catch (error) {
    console.error("Error deleting wordlist:", error); // Log error to the console
    res.status(500).json({ error: "Internal server error" }); // Send a 500 status code for server errors
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
