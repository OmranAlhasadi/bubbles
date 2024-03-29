const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signup
exports.registerUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // only set to true in production
      sameSite: "strict",
      maxAge: 3600000, // cookie expiry, should match token expiry
    });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        aboutMe: "",
        //profileImg here later
        friends: [],
        friendRequests: [],
        sentRequests: [],
        //I will add rest of details later
      },
    });
  } catch (error) {
    res.status(500).send("Error registering new user");
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
      return res.status(401).send("Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development", // only set to true in production
      sameSite: "strict",
      maxAge: 3600000, // cookie expiry, should match token expiry
    });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        aboutMe: user.aboutMe,
        //profileImg here later
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
    res.status(500).send("Error logging in");
  }
};

// Logout user
exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).send("Logged out successfully");
};

// Check auth status
exports.checkAuthStatus = (req, res) => {
  if (req.user) {
    res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
};
