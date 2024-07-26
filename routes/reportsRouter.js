// postReportsRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const postReportsController = require("../controllers/postReportsController.js");
const commentReportsController = require("../controllers/commentReportsController.js");

// Importing Middleware
const verifyJWT = require("../middlewares/verifyJWT.js");

//Post Report Routes
router.get("/posts", verifyJWT, postReportsController.getAllPostReports);
router.get("/posts/:id", verifyJWT, postReportsController.getPostReportById);
router.delete("/posts/:id", verifyJWT, postReportsController.deletePostReport);

//Comment Report Routes
router.get(
    "/comments",
    verifyJWT,
    commentReportsController.getAllCommentReports
);
router.get(
    "/comments/:id",
    verifyJWT,
    commentReportsController.getCommentReportById
);
router.delete(
    "/comments/:id",
    verifyJWT,
    commentReportsController.deleteCommentReport
);

module.exports = router; // Export the router
