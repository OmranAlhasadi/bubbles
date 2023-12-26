const express = require("express");
const router = express.Router();
const {
  getUser,
  addUser,
  getExample,
  getFriends,
} = require("../controllers/userController");

router.get("/user", getUser);
router.post("/user", addUser);
router.get("/example-user", getExample);
router.get("/:userId/friends", getFriends);

module.exports = router;
