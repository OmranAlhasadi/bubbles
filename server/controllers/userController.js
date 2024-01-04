const User = require("../models/User"); //User model

// Get user info
module.exports.getUser = async (req, res) => {
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
module.exports.getOtherUser = async (req, res) => {
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
module.exports.addUser = async (req, res) => {
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
module.exports.getExample = async (req, res) => {
  try {
    const exampleUser = await User.findOne({ username: "Example User" })
      .populate("friends", "username profileImg")
      .populate("friendRequests", "username profileImg")
      .populate("sentRequests", "username profileImg");

    if (!exampleUser) {
      return res.status(404).send("Example user not found");
    }

    const exampleUserData = {
      _id: exampleUser._id,
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

//  endpoint to fetch example user data
module.exports.getExample2 = async (req, res) => {
  try {
    const exampleUser = await User.findOne({ username: "Ova_Sauer87" })
      .populate("friends", "username profileImg")
      .populate("friendRequests", "username profileImg")
      .populate("sentRequests", "username profileImg");

    if (!exampleUser) {
      return res.status(404).send("Example user not found");
    }

    const exampleUserData = {
      _id: exampleUser._id,
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

module.exports.getFriends = async (req, res) => {
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

module.exports.sendFriendRequest = async (req, res) => {
  const userId = req.params.userId; // User ID of the user sending the request
  const recieverUsername = req.params.recieverUsername; // Username of the user who will recieve the request

  try {
    const user = await User.findById(userId);
    const reciever = await User.findOne({ username: recieverUsername });

    if (!user || !reciever) {
      return res.status(404).send("User not found.");
    }

    // Check if the reciever's ID is in the user's sentRequests
    // and if the user's ID is in the reciever's friendRequests
    if (
      user.sentRequests.includes(reciever._id) ||
      reciever.friendRequests.includes(user._id)
    ) {
      return res.status(400).send("Friend request already sent.");
    }

    // Add the request to sentRequests of the sender
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { sentRequests: reciever._id },
    });

    // Add the sender to the friendRequests of the reciever
    await User.findByIdAndUpdate(reciever._id, {
      $addToSet: { friendRequests: user._id },
    });

    // Send back the new request's data
    const newRequest = {
      username: reciever.username,
      profileImg: reciever.profileImg,
    };

    res.status(200).json(newRequest);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending friend request");
  }
};

module.exports.acceptFriendRequest = async (req, res) => {
  const userId = req.params.userId; // User ID of the user accepting the request
  const requesterUsername = req.params.requesterUsername; // Username of the user who sent the request

  try {
    const user = await User.findById(userId);
    const requester = await User.findOne({ username: requesterUsername });

    if (!user || !requester) {
      return res.status(404).send("User not found.");
    }

    // Check if the requester's ID is in the user's friendRequests
    // and if the user's ID is in the requester's sentRequests
    if (
      !user.friendRequests.includes(requester._id) ||
      !requester.sentRequests.includes(user._id)
    ) {
      return res.status(400).send("Invalid friend request.");
    }

    // Remove the request from friendRequests and add to friends for the recipient
    await User.findByIdAndUpdate(user._id, {
      $pull: { friendRequests: requester._id },
      $addToSet: { friends: requester._id },
    });

    // Remove the recipient from the sentRequests of the requester and add to their friends
    await User.findByIdAndUpdate(requester._id, {
      $pull: { sentRequests: user._id },
      $addToSet: { friends: user._id },
    });

    // Send back the new friend's data
    const newFriend = {
      username: requester.username,
      profileImg: requester.profileImg,
      profileLink: `/profile/${requester.username}`,
    };

    res.status(200).json(newFriend);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error accepting friend request");
  }
};

module.exports.rejectFriendRequest = async (req, res) => {
  const userId = req.params.userId; // User ID of the user rejecting the request
  const requesterUsername = req.params.requesterUsername; // Username of the user who sent the request

  try {
    const user = await User.findById(userId);
    const requester = await User.findOne({ username: requesterUsername });

    if (!user || !requester) {
      return res.status(404).send("User not found.");
    }

    // Check if the requester's ID is in the user's friendRequests
    // and if the user's ID is in the requester's sentRequests
    if (
      !user.friendRequests.includes(requester._id) ||
      !requester.sentRequests.includes(user._id)
    ) {
      return res.status(400).send("Invalid friend request.");
    }

    // Remove the request from friendRequests of the recipient
    await User.findByIdAndUpdate(user._id, {
      $pull: { friendRequests: requester._id },
    });

    // Remove the recipient from the sentRequests of the requester
    await User.findByIdAndUpdate(requester._id, {
      $pull: { sentRequests: user._id },
    });

    res.status(200).send("Friend request rejected.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error rejecting friend request");
  }
};
