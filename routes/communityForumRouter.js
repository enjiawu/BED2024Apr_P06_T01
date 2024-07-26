// communityForumRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const postsController = require("../controllers/communityForumPostController.js");
const topicsController = require("../controllers/communityForumTopicsController.js");

// Importing Middleware
const validateCommunityForumPost = require("../middlewares/validateCommunityForumPost.js");
const validateCommunityForumComment = require("../middlewares/validateCommunityForumComment.js");
const validateCommunityForumPostReport = require("../middlewares/validateCommunityForumPostReport.js");
const validateCommunityForumCommentReport = require("../middlewares/validateCommunityForumCommentReport.js");
const valideateCommunityForumTopic = require("../middlewares/validateCommunityForumTopic.js");
const validateLikes = require("../middlewares/validateLikes.js");
const verifyJWT = require("../middlewares/verifyJWT.js");

// Get all topics and post routes
router.get("/", postsController.getAllPosts); // Get all forum posts
router.get("/topics", topicsController.getAllTopics); // Get all forum topics

// Topic modification routes
router.post("/topics", verifyJWT, valideateCommunityForumTopic, topicsController.createTopic); // Create a new forum topic
router.put("/topics/:id", verifyJWT, valideateCommunityForumTopic, topicsController.updateTopic); // Update an existing forum topic
router.delete("/topics/:id", verifyJWT, topicsController.deleteTopic); // Delete a forum topic

// Statistics Routes
router.get("/post-count", postsController.getPostCount); // Get total number of posts
router.get("/topic-count", topicsController.getTopicCount); // Get total number of topics
router.get("/likes-count", postsController.getAllLikes); // Get total number of likes across all posts

// Sorting Routes
router.get("/sort-by-likes-desc", postsController.sortPostsByLikesDesc); // Sort posts by likes in descending order
router.get("/sort-by-likes-asc", verifyJWT, postsController.sortPostsByLikesAsc); // Sort posts by likes in ascending order
router.get("/sort-by-newest", postsController.sortPostsByNewest); // Sort posts by date in descending order
router.get("/sort-by-oldest", postsController.sortPostsByOldest); // Sort posts by date in ascending order

// Specific Post or Topic Routes
router.get("/topics/:id", topicsController.getTopicById); // Get a specific topic by ID
router.get("/posts-by-topic/:id", postsController.getPostsByTopic); // Get posts belonging to a specific topic

// Other routes
router.get("/search", postsController.searchPosts); // Search for posts based on criteria
router.get("/trending-topics", postsController.getTrendingTopics); // Get the id and number of posts for the trending topics

// Post modification routes
router.get("/:id", postsController.getPostById); // Get a specific post by ID
router.post("", verifyJWT, validateCommunityForumPost, postsController.createPost); // Create a new forum post
router.put("/:id", verifyJWT, validateCommunityForumPost, postsController.updatePost); // Update an existing forum post
router.delete("/:id", verifyJWT, postsController.deletePost); // Delete a forum post

// Like Routes
router.put("/:id/modify-like", verifyJWT, validateLikes, postsController.modifyLike); // Like/unlike a post
router.get("/:postId/get-like-by-user/:userId", postsController.getLikeByUser) // pass in user id

// Comment routes
router.get("/:id/comments", postsController.getCommentsByPost); // Get all comments for a post by post id excluding the replies
router.post("/:id/comments", verifyJWT, validateCommunityForumComment, postsController.createComment); // Add a comment to a post by post id
router.get("/comments/:id", postsController.getCommentById); // Get a specific comment by ID
router.put("/comments/:commentId", verifyJWT, validateCommunityForumComment, postsController.updateComment); // Update a comment by comment id
router.delete("/comments/:id", verifyJWT, postsController.deleteComment); // Delete a comment by comment id
router.post("/:postId/comments/:commentId/reply", verifyJWT, validateCommunityForumComment, postsController.replyToComment); // Reply to a comment by parent comment id
router.get("/comments/:id/replies", postsController.getRepliesByComment); // Get all replies to a comment by parent comment id
router.put("/comments/:id/modify-like", verifyJWT, validateLikes, postsController.modifyCommentLike); // Like/unlike a comment
router.get("/comments/:commentId/get-like-by-user/:userId", postsController.getCommentLikeByUser) // Get a comment like by user


// Report Routes
router.post("/report-post", verifyJWT, validateCommunityForumPostReport, postsController.reportPost); // Get all reports
router.post("/report-comment", verifyJWT, validateCommunityForumCommentReport, postsController.reportComment); // Report a comment

router.get('/users/:id', postsController.getPostsByUserId);// New route for getting posts by user ID
module.exports = router; // Export the router
