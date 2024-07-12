// communityForumRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const postsController = require("../controllers/communityForumPostController.js");
const topicsController = require("../controllers/communityForumTopicsController.js");

// Community Forum Routes
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
router.get("/search", postsController.searchPosts); // Search for posts based on criteria
router.get("/trending-topics", postsController.getTrendingTopics); // Get the id and number of posts for the trending topics

// Individual Post CRUD Routes
router.get("/:id", postsController.getPostById); // Get a specific post by ID
router.post("", postsController.createPost); // Create a new forum post
router.put("/:id", postsController.updatePost); // Update an existing forum post
router.delete("/:id", postsController.deletePost); // Delete a forum post

// Report Routes
router.get("/report-post", postsController.reportPost); // Get all reports

module.exports = router; // Export the router