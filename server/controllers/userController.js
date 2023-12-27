const User = require("../models/User"); //User model

// Get user information
const getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Add a new user
const addUser = async (req, res) => {
  try {
    const newUser = new User({
      //user model has a name and email this is just a placeholder
      name: req.body.name,
      email: req.body.email,
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Example endpoint to fetch example user data
const getExample = async (req, res) => {
  try {
    const exampleUser = await User.findOne({ username: "Example User" });
    if (!exampleUser) {
      return res.status(404).send("Example user not found");
    }
    const exampleUserData = {
      uid: exampleUser._id,
      username: exampleUser.username,
      aboutMe: exampleUser.aboutMe,
    };
    res.json(exampleUserData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getFriends = async (req, res) => {
  try {
    // Fetch the user by their ID
    const userId = req.params.userId;
    const user = await User.findById(userId).populate("friends", "username");

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Map the friends to extract only necessary information
    const friendsData = user.friends.map((friend) => ({
      username: friend.username,
      profileLink: `/profile/${friend.username}`, // Link to the friend profile
    }));

    res.json(friendsData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getUser,
  addUser,
  getExample,
  getFriends,
};
