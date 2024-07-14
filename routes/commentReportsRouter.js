// commentReportsRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const commentReportsController = require("../controllers/commentReportsController.js");

//Report Routes
router.get("/", commentReportsController.getAllCommentReports);
router.get("/:id", commentReportsController.getCommentReportById);
router.delete("/:id", commentReportsController.deleteCommentReport);

module.exports = router; // Export the router
