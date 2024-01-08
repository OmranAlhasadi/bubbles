const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");

// get all posts
module.exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username profileImg")
      .sort({ createdAt: -1 });

    // Fetch and attach comments for each post
    for (let post of posts) {
      const comments = await Comment.find({ post: post._id }).populate(
        "author",
        "username profileImg"
      );
      post.comments = comments;
    }

    res.json(posts);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// Get all posts by a specific user
module.exports.getUserPosts = async (req, res) => {
  try {
    // Find the user by username
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find posts where the author field matches the user's ID
    const posts = await Post.find({ author: user._id })
      .populate("author", "username profileImg")
      .sort({ createdAt: -1 }); // Sorts the posts by createdAt in descending order

    // Fetch and attach comments for each post
    for (let post of posts) {
      const comments = await Comment.find({ post: post._id }).populate(
        "author",
        "username profileImg"
      );
      post.comments = comments;
    }

    res.json(posts);
  } catch (error) {
    console.error("Get User Posts Error: ", error);
    res.status(500).send("Server Error");
  }
};

// create a post
module.exports.postPost = async (req, res) => {
  try {
    const { authorID, content, imageURL } = req.body;

    let newPost = createPost(authorID, content, imageURL);
    await newPost.save();

    newPost = await newPost.populate("author", "username profileImg");
    res.status(201).json(newPost);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error: Couldnt create the new post");
  }
};

module.exports.deletePost = async (req, res) => {
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

// create a Comment
module.exports.addComment = async (req, res) => {
  try {
    const { authorID, content } = req.body;
    const postID = req.params.postID;

    let newComment = createComment(postID, authorID, content);
    await newComment.save();

    newComment = await newComment.populate("author", "username profileImg");
    res.status(201).json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error: Couldnt create the new comment");
  }
};

function createComment(postID, authorID, content) {
  return new Comment({
    post: postID,
    author: authorID,
    content: content,
  });
}
