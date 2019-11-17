const express = require("express");
const {
  getComments,
  createComment,
  isCommenter,
  deleteComment,
} = require("../controllers/comment");
const {
    postById
  } = require("../controllers/post");
const {requireSignin} = require("../controllers/auth");
const {userById} = require("../controllers/user");
const {createCommentValidator} = require('../validator');
const router = express.Router();

router.post(
  '/comment/new/:postId/:userId',
  requireSignin,
  createComment,
  createCommentValidator
);
router.get("/comments/:postId", getComments);
//router.delete("/comment/:commentId", requireSignin, isCommenter, deleteComment)

//any route containing :userId, our app will first execute userById()
router.param("userId", userById)
//any route containing :postId, our app will first execute postById()
router.param("postId", postById)

module.exports = router;
