const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const authController = require("../controllers/authController");

// User routes

/* router.post("/user", userController.addUser); */

router.get("/:username", userController.getUser);
router.get("/other-user/:username", userController.getOtherUser);
router.get("/example-user", userController.getExample);
router.get("/example-user2", userController.getExample2);
router.get("/:userId/friends", userController.getFriends);

// Route to send a friend request
router.post(
  "/:userId/send-request/:recieverUsername",
  userController.sendFriendRequest
);

// Route to accept a friend request
router.post(
  "/:userId/accept-request/:requesterUsername",
  userController.acceptFriendRequest
);

// Route to reject a friend request
router.post(
  "/:userId/reject-request/:requesterUsername",
  userController.rejectFriendRequest
);

module.exports = router;
