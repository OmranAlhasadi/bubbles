const Post = require("../models/Post");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username name");
    res.json(posts);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getPosts,
};
