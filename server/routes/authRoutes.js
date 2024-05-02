const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { passwordResetLimiter } = require("../middlewares/rateLimiter");

router.post("/login", authController.loginUser);
router.post("/login-example", authController.loginExampleUser);
router.post("/register", authController.registerUser);

router.get("/logout", authController.logoutUser);

router.get("/status", authMiddleware, authController.checkAuthStatus);

router.get("/verify-email", authController.verifyEmail);

router.post(
  "/forgot-password",

  authController.forgotPassword
);

router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
