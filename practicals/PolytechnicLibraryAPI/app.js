//Importing modules/packages
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const dbConfig = require("./dbConfig.js");
//const staticMiddleware = express.static("public");

//Importing Controllers
const usersController = require("./controllers/userController.js");
const booksController = require("./controllers/bookController.js");

//Instatiating the app
const app = express();

//Defining port
const port = process.env.PORT || 3000;

//Middleware
const verifyJWT = require("./middleware/verifyJWT.js");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(staticMiddleware);

// Routes
app.get("/books", booksController.getAllBooks);
app.get("/books/:id", booksController.getBookById);
app.put("/books/:id/availability", booksController.updateBookAvailability);

app.get("/users", usersController.getAllUsers);
app.get("/users/:username", usersController.getUserByUsername);
app.post("/register", usersController.registerUser);

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
