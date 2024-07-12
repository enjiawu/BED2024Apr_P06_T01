// repliesRouter.js 
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

//Importing controllers
const repliesController = require("../controllers/repliesController.js");

//Reply Routes
router.get("/:id", repliesController.getReplyById);
router.post("/", repliesController.addReply);

module.exports = router; // Export the router