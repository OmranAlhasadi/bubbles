const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", authController.loginUser);
router.post("/login-example", authController.loginExampleUser);
router.post("/register", authController.registerUser);

router.get("/logout", authController.logoutUser);

router.get("/status", authMiddleware, authController.checkAuthStatus);

module.exports = router;
