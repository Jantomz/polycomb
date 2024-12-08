const Post = require("../models/postModel");
const mongoose = require("mongoose");

// get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch posts", details: error.message });
  }
};

// get a post by competitionCode
const getPostsByCompetition = async (req, res) => {
  try {
    const posts = await Post.find({
      competitionCode: req.params.competitionCode,
    });
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to fetch posts by competition code",
        details: error.message,
      });
  }
};

// get a post by id
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch post", details: error.message });
  }
};

// create a post
const createPost = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
  }

  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create post", details: error.message });
  }
};

// update a post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid post ID" });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update post", details: error.message });
  }
};

// delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid post ID" });
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete post", details: error.message });
  }
};

module.exports = {
  getPosts,
  getPostsByCompetition,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
