const express = require("express");

// importing the function controllers to manipulate db
const {
  getUsers,
  getUser,
  createUser,
} = require("../controllers/authController");

const router = express.Router();

// GET all workouts
router.get("/", getUsers);

router.get("/:id", getUser);

router.post("/", createUser);

module.exports = router;
