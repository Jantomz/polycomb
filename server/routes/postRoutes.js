const express = require("express"); // Importing the express module

// Importing the function controllers to manipulate db
const {
  getPosts,
  getPostsByCompetition,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController.js"); // Destructuring to import specific functions from the controller

const router = express.Router(); // Creating a new router object to handle routes

// GET all posts
router.get("/", getPosts); // Route to get all posts, handled by getPosts function

router.get("/competition/:competitionCode", getPostsByCompetition); // Route to get posts by competition code

router.get("/:id", getPost); // Route to get a specific post by ID

router.post("/", createPost); // Route to create a new post

router.put("/:id", updatePost); // Route to update an existing post by ID

router.delete("/:id", deletePost); // Route to delete a post by ID

module.exports = router; // Exporting the router to be used in other parts of the application
