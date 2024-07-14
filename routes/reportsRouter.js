// postReportsRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const postReportsController = require("../controllers/postReportsController.js");
const commentReportsController = require("../controllers/commentReportsController.js");

//Post Report Routes
router.get("/posts", postReportsController.getAllPostReports);
router.get("/posts/:id", postReportsController.getPostReportById);
router.delete("/posts/:id", postReportsController.deletePostReport);

//Comment Report Routes
router.get("/comments", commentReportsController.getAllCommentReports);
router.get("/comments/:id", commentReportsController.getCommentReportById);
router.delete("/comments/:id", commentReportsController.deleteCommentReport);

module.exports = router; // Export the router
