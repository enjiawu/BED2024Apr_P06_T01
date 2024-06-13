//Importing modules/packages
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const dbConfig = require("./dbConfig.js");
const staticMiddleware = express.static("public");

//Importing Controllers
const usersController = require("./controllers/usersController");
const postsController = require("./controllers/postsController");
const eventsController = require("./controllers/eventsController.js");
const messagesController = require("./controllers/messagesController.js");

//Instatiating the app
const app = express();

//Defining port
const port = process.env.PORT || 3000;

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticMiddleware);

//Post Routes
app.get("/posts", postsController.getAllPosts);
app.get("/posts/search", postsController.searchPosts);
app.get("/posts/count", postsController.getPostCount);
app.get("/posts/:id", postsController.getPostById);
app.post("/posts", postsController.createPost);
app.put("/posts/:id", postsController.updatePost);
app.delete("/posts/:id", postsController.deletePost);

//User Routes
app.get("/users/with-posts", usersController.getUsersWithPosts);
app.post("/users/add-post", usersController.addPostsToUser);
app.delete("/users/remove-post/:id", usersController.removePostsFromUser);
app.get("/users/count", usersController.getUserCount);

//Event Routes
app.get("/events/count", eventsController.getEventCount);

//Contact Us Submission Routes
app.get("/messages", messagesController.getAllMessages);
app.get("/messages/:id", messagesController.getMessageById);

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
