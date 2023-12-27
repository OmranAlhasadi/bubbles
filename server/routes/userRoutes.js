const express = require("express");
const router = express.Router();
const {
  getUser,
  addUser,
  getExample,
  getFriends,
} = require("../controllers/userController");

const authController = require("../controllers/authController");

// Authentication routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// User routes
router.get("/user", getUser);
router.post("/user", addUser);
router.get("/example-user", getExample);
router.get("/:userId/friends", getFriends);

module.exports = router;
