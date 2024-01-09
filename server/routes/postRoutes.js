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

module.exports = router;
