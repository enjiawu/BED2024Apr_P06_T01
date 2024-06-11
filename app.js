const express = require("express");
const usersController = require("./controllers/usersController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.port || 3000;

const staticMiddleware = express.static("public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticMiddleware);

app.get("/users/count", usersController.getUserCount);

app.listen(port, async () => {
    try {
        await sql.connect(dbConfig);
        console.log("Database connection established successfully");
    } catch (error) {
        console.error("Database connection error: ", error);
        process.exit(1);
    }
    console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
    console.log("Server is shutting down...");
    await sql.close();
    console.log("Database connection closed");
    process.exit(0);
});
