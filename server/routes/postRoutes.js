const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/", postController.getPosts);
router.post("/", postController.postPost);

router.get("/:username", postController.getUserPosts);

router.delete("/:postId", postController.deletePost);

// POST a comment
router.post("/:postID/comments", postController.addComment);

// DELETE a comment
router.delete("/comments/:commentID", postController.deleteComment);

// Route to like a post
router.post("/:postId/like", postController.likePost);

// Route to unlike a post
router.delete("/:postId/like", postController.unlikePost);

module.exports = router;
