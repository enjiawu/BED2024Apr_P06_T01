//Importing modules/packages
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const dbConfig = require("./dbConfig.js");
const staticMiddleware = express.static("public");

//Importing Controllers
const usersController = require("./controllers/usersController")
const postsController = require("./controllers/postsController");

//Instatiating the app
const app = express();

//Defining port
const port = process.env.PORT || 3000;

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(staticMiddleware);

//Post Routes
app.get("/communityforum", postsController.getAllPosts);
app.get("/communityforum/search", postsController.searchPosts)
app.get("/communityforum/:id", postsController.getPostById)
app.post("/communityforum", postsController.createPost)
app.put("/communityforum/:id",postsController.updatePost)
app.delete("/communityforum/:id", postsController.deletePost)

//User Routes
app.get("/users/with-posts", usersController.getUsersWithPosts)
app.post("/users/add-post",  usersController.addPostsToUser);
app.delete("/users/remove-post/:id",  usersController.removePostsFromUser);

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
