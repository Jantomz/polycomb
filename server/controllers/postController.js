const Post = require("../models/postModel"); // Import the Post model
const mongoose = require("mongoose"); // Import mongoose for database operations

// get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 }); // Fetch all posts and sort by creation date in descending order
    res.status(200).json(posts); // Send the posts as a JSON response with status 200
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch posts", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

// get a post by competitionCode
const getPostsByCompetition = async (req, res) => {
  try {
    const posts = await Post.find({
      competitionCode: req.params.competitionCode, // Fetch posts by competition code from request parameters
    });
    res.status(200).json(posts); // Send the posts as a JSON response with status 200
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch posts by competition code",
      details: error.message,
    }); // Handle errors and send a 500 status with error details
  }
};

// get a post by id
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // Fetch a post by its ID from request parameters
    if (!post) {
      return res.status(404).json({ error: "Post not found" }); // If post not found, send a 404 status with error message
    }
    res.status(200).json(post); // Send the post as a JSON response with status 200
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch post", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

// create a post
const createPost = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" }); // Validate request body and send a 400 status if invalid
  }

  try {
    const post = new Post(req.body); // Create a new Post instance with request body data
    await post.save(); // Save the new post to the database
    res.status(201).json(post); // Send the created post as a JSON response with status 201
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create post", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

// update a post
const updatePost = async (req, res) => {
  const { id } = req.params; // Extract post ID from request parameters
  const post = req.body; // Extract post data from request body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid post ID" }); // Validate post ID and send a 404 status if invalid
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true }); // Update the post and return the new version
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" }); // If post not found, send a 404 status with error message
    }
    res.status(200).json(updatedPost); // Send the updated post as a JSON response with status 200
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update post", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

// delete a post
const deletePost = async (req, res) => {
  const { id } = req.params; // Extract post ID from request parameters

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid post ID" }); // Validate post ID and send a 404 status if invalid
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(id); // Delete the post by its ID
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" }); // If post not found, send a 404 status with error message
    }
    res.status(200).json({ message: "Post deleted successfully" }); // Send a success message with status 200
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete post", details: error.message }); // Handle errors and send a 500 status with error details
  }
};

module.exports = {
  getPosts,
  getPostsByCompetition,
  getPost,
  createPost,
  updatePost,
  deletePost,
}; // Export all controller functions for use in routes
