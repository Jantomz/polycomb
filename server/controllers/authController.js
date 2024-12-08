// this file holds functions that hold the logic for manipulating the database, as we don't want to clutter the router file

// imports the workout collection model
const User = require("../models/userModel");

const mongoose = require("mongoose");

// TODO: Add authentication through JWT or something to these routes

// get all workouts
const getUsers = async (req, res) => {
  const users = await User.find({}).sort({ createdAt: -1 }); // sorting in descending order
  res.status(200).json(users);
};

const getUser = async (req, res) => {
  const user = await User.find({ uid: req.params.id });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(user);
};

const createUser = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
  }
  // TODO: Check validity of user body
  console.log("Creating user: ", req.body);
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
};

// exporting all the function controllers
module.exports = {
  getUsers,
  getUser,
  createUser,
};
