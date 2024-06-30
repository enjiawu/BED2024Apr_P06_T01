//Importing modules/packages
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const dbConfig = require("./dbConfig.js");
const staticMiddleware = express.static("public");

//Importing Controllers
const usersController = require("./controllers/usersController.js");
const postsController = require("./controllers/communityForumPostController.js");
const topicsController = require("./controllers/communityForumTopicsController.js");
const reportsController = require("./controllers/reportsController.js");
const eventsController = require("./controllers/eventsController.js");
const messagesController = require("./controllers/messagesController.js");
const repliesController = require("./controllers/repliesController.js");

//Instatiating the app
const app = express();

//Defining port
const port = process.env.PORT || 3000;

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticMiddleware);

// Community Forum Routes
app.get("/communityforum", postsController.getAllPosts); // Get all forum posts
app.get("/communityforum/topics", topicsController.getAllTopics); // Get all forum topics
//// Community Forum - Statistics Routes
app.get("/communityforum/post-count", postsController.getPostCount); // Get total number of posts
app.get("/communityforum/topic-count", topicsController.getTopicCount); // Get total number of topics
app.get("/communityforum/likes-count", postsController.getAllLikes); // Get total number of likes across all posts
//// Sorting Routes
app.get("/communityforum/sort-by-likes-desc", postsController.sortPostsByLikesDesc); // Sort posts by likes in descending order
app.get("/communityforum/sort-by-likes-asc", postsController.sortPostsByLikesAsc); // Sort posts by likes in ascending order
app.get("/communityforum/sort-by-newest", postsController.sortPostsByNewest); // Sort posts by date in descending order
app.get("/communityforum/sort-by-oldest", postsController.sortPostsByOldest); // Sort posts by date in ascending order
//// Specific Post or Topic Routes
app.get("/communityforum/topics/:id", topicsController.getTopicById); // Get a specific topic by ID
app.get("/communityforum/posts-by-topic/:id", postsController.getPostsByTopic); // Get posts belonging to a specific topic
app.get("/communityforum/search", postsController.searchPosts); // Search for posts based on criteria
//// Individual Post CRUD Routes
app.get("/communityforum/:id", postsController.getPostById); // Get a specific post by ID
app.post("/communityforum", postsController.createPost); // Create a new forum post
app.put("/communityforum/:id", postsController.updatePost); // Update an existing forum post
app.delete("/communityforum/:id", postsController.deletePost); // Delete a forum post

//Report Routes
app.get("/reports", reportsController.getAllReports);
app.get("/reports/:id", reportsController.getReportById);
app.delete("/reports/:id", reportsController.deleteReport);

//User Routes
app.get("/users", usersController.getAllUsers);
app.post("/users", usersController.registerUser);
app.post("/users/login", usersController.loginUser);
//app.post("/users/logout", usersController.logoutUser);
app.get("/users/with-posts", usersController.getUsersWithPosts);
app.post("/users/add-post", usersController.addPostsToUser);
app.delete("/users/remove-post/:id", usersController.removePostsFromUser);
app.get("/users/count", usersController.getUserCount);
app.get("/users/:id", usersController.getUserById);

//Event Routes
app.get("/events", eventsController.getAllEvents);
app.get("/events/count", eventsController.getEventCount);
app.get("/events/search", eventsController.searchEvents);
app.get("/events/status/:status", eventsController.getEventsByStatus);
app.get("/events/:id", eventsController.getEventById);
app.post("/events", eventsController.createEvent);
app.put("/events/:id", eventsController.updateEvent);
app.delete("/events/:id", eventsController.deleteEvent);

//Message Routes
app.get("/messages", messagesController.getAllMessages);
app.get("/messages/:id", messagesController.getMessageById);
app.post("/messages",messagesController.sendMessage);

//Reply Routes
app.get("/replies/:id", repliesController.getReplyById);
app.post("/replies", repliesController.addReply);

app.listen(port, async () => {
    try {
        // Connect to the database
        await sql.connect(dbConfig);
        console.log("Database connection established successfully");
    } catch (err) {
        console.error("Database connection error:", err);
        // Terminate the application with an error code (optional)
        process.exit(1); // Exit with code 1 indicating an error
    }

    console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    // Perform cleanup tasks (e.g., close database connections)
    await sql.close();
    console.log("Database connection closed");
    process.exit(0); // Exit with code 0 indicating successful shutdown
});
