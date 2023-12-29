const express = require("express");
const router = express.Router();
const {
  getUser,
  getOtherUser,
  addUser,
  getExample,
  getFriends,
} = require("../controllers/userController");

const authController = require("../controllers/authController");

// Authentication routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// User routes

router.post("/user", addUser);

router.get("/user/:username", getUser);
router.get("/other-user/:username", getOtherUser);
router.get("/example-user", getExample);
router.get("/:userId/friends", getFriends);

module.exports = router;
