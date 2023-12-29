const User = require("../models/User"); //User model

// Get user info
const getUser = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username })
      .populate("friends", "username profileImg")
      .populate("friendRequests", "username profileImg")
      .populate("sentRequests", "username profileImg")
      .select("-password"); // Exclude password from the result

    if (!user) {
      return res.status(404).send("User not found");
    }

    const userInfo = {
      username: user.username,
      profileImg: user.profileImg,
      aboutMe: user.aboutMe,
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

    res.json(userInfo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

// Get Other user information
const getOtherUser = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username })
      .populate("friends", "username profileImg") // Populate friends with their usernames
      .select("-password"); // Exclude password from the result

    if (!user) {
      return res.status(404).send("User not found");
    }

    const userInfo = {
      username: user.username,
      profileImg: user.profileImg,
      aboutMe: user.aboutMe,
      friends: user.friends.map((friend) => ({
        username: friend.username,
        profileImg: friend.profileImg,
        profileLink: `/profile/${friend.username}`,
      })),
    };

    res.json(userInfo);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
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

//  endpoint to fetch example user data
const getExample = async (req, res) => {
  try {
    const exampleUser = await User.findOne({ username: "Example User" })
      .populate("friends", "username profileImg")
      .populate("friendRequests", "username profileImg")
      .populate("sentRequests", "username profileImg");

    if (!exampleUser) {
      return res.status(404).send("Example user not found");
    }

    const exampleUserData = {
      uid: exampleUser._id,
      username: exampleUser.username,
      profileImg: exampleUser.profileImg,
      aboutMe: exampleUser.aboutMe,
      friends: exampleUser.friends.map((friend) => ({
        username: friend.username,
        profileImg: friend.profileImg,
        profileLink: `/profile/${friend.username}`,
      })),
      friendRequests: exampleUser.friendRequests.map((request) => ({
        username: request.username,
        profileImg: request.profileImg,
      })),
      sentRequests: exampleUser.sentRequests.map((request) => ({
        username: request.username,
        profileImg: request.profileImg,
      })),
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
    const user = await User.findById(userId).populate(
      "friends",
      "username profileImg"
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Map the friends to extract only necessary information
    const friendsData = user.friends.map((friend) => ({
      username: friend.username,
      profileImg: friend.profileImg,
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
  getOtherUser,
  addUser,
  getExample,
  getFriends,
};
