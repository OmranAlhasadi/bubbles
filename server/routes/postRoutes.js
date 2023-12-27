const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/posts", postController.getPosts);
router.post("/posts", postController.postPost);

router.delete("/posts/:postId", postController.deletePost);

module.exports = router;
