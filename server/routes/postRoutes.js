const express = require("express");

// importing the function controllers to manipulate db
const {
  getPosts,
  getPostsByCompetition,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController.js");

const router = express.Router();

// GET all posts
router.get("/", getPosts);

router.get("/competition/:competitionCode", getPostsByCompetition);

router.get("/:id", getPost);

router.post("/", createPost);

router.put("/:id", updatePost);

router.delete("/:id", deletePost);

module.exports = router;
