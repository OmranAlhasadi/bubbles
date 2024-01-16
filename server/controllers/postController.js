const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
const Like = require("../models/Like");

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
      post._doc.comments = comments;

      const likes = await Like.find({ post: post._id }).populate(
        "user",
        "username"
      );
      post._doc.likes = likes.map((like) => like.user.username);
      post._doc.likesCount = likes.length;
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
      post._doc.comments = comments;

      const likes = await Like.find({ post: post._id }).populate(
        "user",
        "username"
      );
      post._doc.likes = likes;
      post._doc.likesCount = likes.length;
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

    newPost._doc.comments = [];
    newPost._doc.likes = [];
    newPost._doc.likesCount = 0;

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

    // Delete all comments associated with the post
    await Comment.deleteMany({ post: post._id });

    // Delete all likes associated with the post
    await Like.deleteMany({ post: post._id });

    // Finally, delete the post itself
    await post.deleteOne();
    res.status(200).send("Post and associated data deleted successfully");
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

module.exports.deleteComment = async (req, res) => {
  try {
    const { commentID } = req.params;
    const userID = req.body.userId;

    // Find the comment
    const comment = await Comment.findById(commentID);
    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    // Check if the user is authorized to delete the comment
    if (comment.author.toString() !== userID) {
      return res.status(403).send("Not authorized to delete this comment");
    }

    // Delete the comment
    await Comment.deleteOne({ _id: commentID });

    res.status(200).send("Comment deleted successfully");
  } catch (error) {
    console.error("Delete Comment Error: ", error);
    res.status(500).send("Server error");
  }
};

// Like a post
module.exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId;

    // Check if the user already liked the post
    const existingLike = await Like.findOne({ post: postId, user: userId });
    if (existingLike) {
      return res.status(400).send("Post already liked by this user.");
    }

    // Create a new like
    const newLike = new Like({ post: postId, user: userId });
    await newLike.save();

    res.status(201).send("Post liked successfully.");
  } catch (error) {
    console.error("Like Post Error:", error);
    res.status(500).send("Server error");
  }
};

// Unlike a post
module.exports.unlikePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.body.userId;

    // Remove the like
    const result = await Like.deleteOne({ post: postId, user: userId });
    if (result.deletedCount === 0) {
      return res.status(404).send("Like not found or already removed.");
    }

    res.status(200).send("Post unliked successfully.");
  } catch (error) {
    console.error("Unlike Post Error:", error);
    res.status(500).send("Server error");
  }
};
