const express = require("express");
const router = express.Router();
const { getUser, addUser } = require("../controllers/userController");

router.get("/user", getUser);
router.post("/user", addUser);

module.exports = router;
