// imports the user collection model
const User = require("../models/userModel");

const mongoose = require("mongoose");

// get all users
const getUsers = async (req, res) => {
  // fetches all users from the database and sorts them by creation date in descending order
  const users = await User.find({}).sort({ createdAt: -1 });
  // sends the fetched users as a JSON response with a 200 OK status
  res.status(200).json(users);
};

const getUser = async (req, res) => {
  // fetches a user by their unique id (uid) from the request parameters
  const user = await User.find({ uid: req.params.id });
  // if the user is not found, sends a 404 Not Found response
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  // sends the fetched user as a JSON response with a 200 OK status
  res.status(200).json(user);
};

const createUser = async (req, res) => {
  // checks if the request body is missing or empty
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
  }

  const { uid, email, role } = req.body;

  // checks if uid, email, and role are provided in the request body
  if (!uid || !email || !role) {
    return res.status(400).json({ error: "Uid, email, and role are required" });
  }

  // creates a new user instance with the provided data
  const user = new User(req.body);
  // saves the new user to the database
  await user.save();
  // sends the created user as a JSON response with a 201 Created status
  res.status(201).json(user);
};

// exporting all the function controllers
module.exports = {
  getUsers, // function to get all users
  getUser, // function to get a specific user by uid
  createUser, // function to create a new user
};
