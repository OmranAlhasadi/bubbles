const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const authController = require("../controllers/authController");

// Authentication routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// User routes

router.post("/user", userController.addUser);

router.get("/user/:username", userController.getUser);
router.get("/other-user/:username", userController.getOtherUser);
router.get("/example-user", userController.getExample);
router.get("/:userId/friends", userController.getFriends);

// Route to accept a friend request
router.post(
  "/user/:userId/accept-request/:requesterUsername",
  userController.acceptFriendRequest
);

// Route to reject a friend request
router.post(
  "/user/:userId/reject-request/:requesterUsername",
  userController.rejectFriendRequest
);

module.exports = router;
