// communityForumRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const postsController = require("../controllers/communityForumPostController.js");
const topicsController = require("../controllers/communityForumTopicsController.js");

// Get all topics and post routes
router.get("/", postsController.getAllPosts); // Get all forum posts
router.get("/topics", topicsController.getAllTopics); // Get all forum topics

// Statistics Routes
router.get("/post-count", postsController.getPostCount); // Get total number of posts
router.get("/topic-count", topicsController.getTopicCount); // Get total number of topics
router.get("/likes-count", postsController.getAllLikes); // Get total number of likes across all posts

// Sorting Routes
router.get("/sort-by-likes-desc", postsController.sortPostsByLikesDesc); // Sort posts by likes in descending order
router.get("/sort-by-likes-asc", postsController.sortPostsByLikesAsc); // Sort posts by likes in ascending order
router.get("/sort-by-newest", postsController.sortPostsByNewest); // Sort posts by date in descending order
router.get("/sort-by-oldest", postsController.sortPostsByOldest); // Sort posts by date in ascending order

// Specific Post or Topic Routes
router.get("/topics/:id", topicsController.getTopicById); // Get a specific topic by ID
router.get("/posts-by-topic/:id", postsController.getPostsByTopic); // Get posts belonging to a specific topic

// Post modification routes
router.get("/:id", postsController.getPostById); // Get a specific post by ID
router.post("", postsController.createPost); // Create a new forum post
router.put("/:id", postsController.updatePost); // Update an existing forum post
router.delete("/:id", postsController.deletePost); // Delete a forum post

// Like Routes
router.put("/like-post/:id", postsController.likePost); // Like a post
router.put("/unlike-post/:id", postsController.unlikePost); // Unlike a post

// Comment routes
router.get("/comments/:id", postsController.getCommentsByPost); // Get all comments for a post
router.get("/comments/:id", postsController.getCommentById); // Get a specific comment by ID
router.post("/comments/:id", postsController.createComment); // Add a comment to a post
router.put("/comments/:id", postsController.updateComment); // Update a comment
router.delete("/comments/:id", postsController.deleteComment); // Delete a comment
router.post("/comments/:id/reply", postsController.replyToComment); // Reply to a comment
router.get("/comments/:id/replies", postsController.getRepliesByComment); // Get all replies to a comment

// Report Routes
router.post("/report-post", postsController.reportPost); // Get all reports
router.post("/report-comment", postsController.reportComment); // Report a comment

// Other routes
router.get("/search", postsController.searchPosts); // Search for posts based on criteria
router.get("/trending-topics", postsController.getTrendingTopics); // Get the id and number of posts for the trending topics

module.exports = router; // Export the router
