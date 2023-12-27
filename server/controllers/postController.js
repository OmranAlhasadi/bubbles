const Post = require("../models/Post");

// get all posts
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

// create a post
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

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const userId = req.body.userId; // Access userId from the request body

    if (!post) {
      return res.status(404).send("Post not found");
    }

    if (post.author.toString() !== userId) {
      return res.status(403).send("Not authorized to delete this post");
    }

    await post.deleteOne();
    res.status(200).send("Post deleted successfully");
  } catch (error) {
    console.error("Delete Post Error: ", error);
    res.status(500).send("Server error");
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
  deletePost,
};
