// this file holds functions that hold the logic for manipulating the database, as we don't want to clutter the router file

// imports the workout collection model
const Post = require("../models/postModel");

const mongoose = require("mongoose");

// get all posts
const getPosts = async (req, res) => {
  const posts = await Post.find({}).sort({ createdAt: -1 }); // sorting in descending order
  res.status(200).json(posts);
};

// get a post by competitionCode
const getPostsByCompetition = async (req, res) => {
  console.log(
    "Getting all posts by competition code: ",
    req.params.competitionCode
  );
  const posts = await Post.find({
    competitionCode: req.params.competitionCode,
  });
  res.status(200).json(posts);
};

// get a post by id
const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.status(200).json(post);
};

// create a post
const createPost = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: "Request body is missing or empty" });
  }

  console.log("Creating post: ", req.body);

  const post = new Post(req.body);
  await post.save();
  res.status(201).json(post);
};

// update a post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  console.log("Updating post: ", id, post);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Post not found" });
  }

  const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true });

  res.status(200).json(updatedPost);
};

// delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;

  console.log("Deleting post: ", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Post not found" });
  }

  await Post.findByIdAndRemove(id);

  res.status(200).json({ message: "Post deleted successfully" });
};

// exporting all the function controllers
module.exports = {
  getPosts,
  getPostsByCompetition,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
