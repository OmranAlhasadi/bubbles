const Post = require("../models/Post");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username name")
      .sort({ createdAt: -1 }); // Sorts the posts by createdAt in descending order
    res.json(posts);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

const postPost = async (req, res) => {
  try {
    const { authorID, content, imageURL } = req.body;

    let newPost = createPost(authorID, content, imageURL);
    await newPost.save();

    newPost = await newPost.populate("author", "username name");
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error: Couldnt create the new post");
  }
};

function createPost(
  authorID,
  content,
  imageURL = "https://loremflickr.com/640/480"
) {
  return new Post({
    author: authorID,
    content: content,
    image: imageURL,
    likes: [],
    dislikes: [],
    comments: [],
  });
}

module.exports = {
  getPosts,
  postPost,
};
