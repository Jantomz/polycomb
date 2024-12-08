// this file holds functions that hold the logic for manipulating the database, as we don't want to clutter the router file

// imports the workout collection model
const Wordlist = require("../models/wordlistModel");

const Word = require("../models/wordModel");

const mongoose = require("mongoose");

const getWordlists = async (req, res) => {
  const competitionCode = req.params.competitionCode;
  const wordlists = await Wordlist.find({
    competitionCode: competitionCode,
  }).sort({ createdAt: -1 }); // sorting in descending order
  res.status(200).json(wordlists);
};

const getWordlist = async (req, res) => {
  const { competitionCode, wordlistId } = req.params;

  console.log("Getting wordlist: ", competitionCode, wordlistId);

  const wordlist = await Wordlist.findOne({
    competitionCode: competitionCode,
    _id: wordlistId,
  });

  console.log("Wordlist: ", wordlist);

  if (!wordlist) {
    return res.status(404).json({ error: "Wordlist not found" });
  }

  res.status(200).json(wordlist);
};

const createWordlist = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
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

  console.log("Creating wordlist: ", req.body);

  const wordlist = new Wordlist(req.body);
  await wordlist.save();
  res.status(201).json(wordlist);
};

const getWord = async (req, res) => {
  const { wordId } = req.params;

  const word = await Word.findById(wordId);

  if (!word) {
    return res.status(404).json({ error: "Word not found" });
  }

  res.status(200).json(word);
};

const updateWord = async (req, res) => {
  const { wordId } = req.params;

  const word = await Word.findById(wordId);

  if (!word) {
    return res.status(404).json({ error: "Word not found" });
  }

  const updatedWord = await Word.findByIdAndUpdate(wordId, req.body, {
    new: true,
  });

  res.status(200).json(updatedWord);
};

// exporting all the function controllers
module.exports = {
  getWordlists,
  getWordlist,
  createWordlist,
  getWord,
  updateWord,
};
