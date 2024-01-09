const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/posts", postController.getPosts);
router.post("/posts", postController.postPost);

router.get("/posts/:username", postController.getUserPosts);

router.delete("/posts/:postId", postController.deletePost);

// POST a comment
router.post("/posts/:postID/comments", postController.addComment);

// DELETE a comment
router.delete("/comments/:commentID", postController.deleteComment);

// Route to like a post
router.post("/posts/:postId/like", postController.likePost);

// Route to unlike a post
router.delete("/posts/:postId/like", postController.unlikePost);

module.exports = router;
