// repliesRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

//Importing controllers
const repliesController = require("../controllers/repliesController.js");

// Importing Middleware
const validateReply = require("../middlewares/validateReply.js");
const verifyJWT = require("../middlewares/verifyJWT.js");

//Reply Routes
router.get("/:id", verifyJWT, repliesController.getReplyById);
router.post("/", verifyJWT, validateReply, repliesController.addReply);

module.exports = router; // Export the router
