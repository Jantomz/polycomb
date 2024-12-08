const express = require("express"); // Importing the express module to create a router

// Importing the function controllers to manipulate db
const {
  getUsers, // Function to get all users
  getUser, // Function to get a specific user by ID
  createUser, // Function to create a new user
} = require("../controllers/authController");

const router = express.Router(); // Creating a new router object

// Route to get all users, mapped to the getUsers controller function
router.get("/", getUsers);

// Route to get a specific user by ID, mapped to the getUser controller function
router.get("/:id", getUser);

// Route to create a new user, mapped to the createUser controller function
router.post("/", createUser);

module.exports = router; // Exporting the router to be used in other parts of the application
