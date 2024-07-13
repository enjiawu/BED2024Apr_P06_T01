// reportsRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const postReportsController = require("../controllers/postReportsController.js");

//Report Routes
router.get("/", postReportsController.getAllPostReports);
router.get("/:id", postReportsController.getPostReportById);
router.delete("/:id", postReportsController.deletePostReport);

module.exports = router; // Export the router
