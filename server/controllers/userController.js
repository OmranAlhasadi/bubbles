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

module.exports = {
  getUser,
  addUser,
};
