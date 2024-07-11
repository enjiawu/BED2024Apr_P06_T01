// reportsRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const reportsController = require("../controllers/reportsController.js");

//Report Routes
router.get("/", reportsController.getAllReports);
router.get("/:id", reportsController.getReportById);
router.delete("/:id", reportsController.deleteReport);

module.exports = router; // Export the router