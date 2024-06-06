const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailService = require("../services/emailService");

// signup
exports.registerUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      if (!existingUser.emailVerified) {
        const newToken = jwt.sign(
          { email: req.body.email },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        existingUser.emailVerificationToken = newToken;
        await existingUser.save();
        await emailService.sendVerificationEmail(req.body.email, newToken);
        return res
          .status(200)
          .json({ message: "A new verification email has been sent." });
      }
      return res
        .status(400)
        .json({
          message: "User with that email already exists and is verified.",
        });
    }

    // Check if the username already exists
    const existingUsernameUser = await User.findOne({
      username: req.body.username,
    });
    if (existingUsernameUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const emailVerificationToken = jwt.sign(
      { email: req.body.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const user = new User({
      ...req.body,
      password: hashedPassword,
      aboutMe: "",
      profileImg: "",
      friends: [],
      friendRequests: [],
      sentRequests: [],
      emailVerificationToken,
      emailVerified: false,
    });

    await user.save();
    await emailService.sendVerificationEmail(
      req.body.email,
      emailVerificationToken
    );
    res
      .status(201)
      .json({ message: "Please check your email to verify your account." });
  } catch (error) {
    console.error("Error registering new user", error);
    res.status(500).json({ message: "Error registering new user" });
  }
};

//sign in
exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
      .populate("friends", "username profileImg")
      .populate("friendRequests", "username profileImg")
      .populate("sentRequests", "username profileImg");

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.emailVerified === false) {
      const emailVerificationToken = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Update the user with the new email verification token
      user.emailVerificationToken = emailVerificationToken;
      await user.save();

      await emailService.sendVerificationEmail(
        user.email,
        emailVerificationToken
      );

      return res.status(401).json({
        message: "Email not verified yet, verification link sent to email",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Less sensitive token for client context
    const contextToken = jwt.sign(
      {
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // only set to true in production
      sameSite: "strict",
      maxAge: 3600000, // cookie expiry, should match token expiry
    });

    res.status(201).json({
      token,
      user: {
        contextToken: contextToken,
        username: user.username,
        name: user.name,
        aboutMe: user.aboutMe,
        profileImg: user.profileImg,
        friends: user.friends.map((friend) => ({
          username: friend.username,
          profileImg: friend.profileImg,
          profileLink: `/profile/${friend.username}`,
        })),
        friendRequests: user.friendRequests.map((request) => ({
          username: request.username,
          profileImg: request.profileImg,
        })),
        sentRequests: user.sentRequests.map((request) => ({
          username: request.username,
          profileImg: request.profileImg,
        })),
        //I will add rest of details later
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

//login as example user

exports.loginExampleUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: "Example User" })
      .populate("friends", "username profileImg")
      .populate("friendRequests", "username profileImg")
      .populate("sentRequests", "username profileImg");

    if (!user) {
      return res.status(401).json({ message: "Could not find example user" });
    }

    // Token for HTTP-only cookie
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Less sensitive token for client context
    const contextToken = jwt.sign(
      {
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // only set to true in production
      sameSite: "strict",
      maxAge: 3600000, // cookie expiry, should match token expiry
    });

    res.status(201).json({
      token,
      user: {
        contextToken: contextToken,
        username: user.username,
        name: user.name,
        aboutMe: user.aboutMe,
        profileImg: user.profileImg,
        friends: user.friends.map((friend) => ({
          username: friend.username,
          profileImg: friend.profileImg,
          profileLink: `/profile/${friend.username}`,
        })),
        friendRequests: user.friendRequests.map((request) => ({
          username: request.username,
          profileImg: request.profileImg,
        })),
        sentRequests: user.sentRequests.map((request) => ({
          username: request.username,
          profileImg: request.profileImg,
        })),
        //I will add rest of details later
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};

// Logout user
exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

// Check auth status
/* exports.checkAuthStatus = (req, res) => {
  if (req.user) {
    res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
}; */

exports.checkAuthStatus = async (req, res) => {
  if (req.userId) {
    try {
      const user = await User.findById(req.userId)
        .populate("friends", "username profileImg")
        .populate("friendRequests", "username profileImg")
        .populate("sentRequests", "username profileImg");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Less sensitive token for client context
      const contextToken = jwt.sign(
        {
          username: user.username,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const userDetail = {
        contextToken: contextToken,
        username: user.username,
        name: user.name,
        aboutMe: user.aboutMe,
        profileImg: user.profileImg,
        friends: user.friends.map((friend) => ({
          username: friend.username,
          profileImg: friend.profileImg,
          profileLink: `/profile/${friend.username}`,
        })),
        friendRequests: user.friendRequests.map((request) => ({
          username: request.username,
          profileImg: request.profileImg,
        })),
        sentRequests: user.sentRequests.map((request) => ({
          username: request.username,
          profileImg: request.profileImg,
        })),
      };

      res.status(200).json({ isAuthenticated: true, user: userDetail });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
};

// Verify account email after signup
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerified: false,
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Verification link is invalid or has expired." });
    }

    user.emailVerified = true;
    user.emailVerificationToken = "";
    await user.save();

    res.json({ message: "Email verified successfully. You may now login." });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      res.status(400).json({
        message: "Your verification link has expired. Please sign up again.",
      });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No account with that email address exists." });
    }

    // Generate a token with jwt or any other method you prefer
    const resetToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour from now

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await emailService.sendPasswordResetEmail(user.email, resetUrl);

    res.json({
      message:
        "An email has been sent to your email address with further instructions.",
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({ message: "Error sending password reset email." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Password reset token is invalid or has expired." });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: "Your password has been changed successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password." });
  }
};
