// messageRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const messagesController = require("../controllers/messagesController.js");

// Importing Middleware
const verifyJWT = require("../middlewares/verifyJWT.js");

//Message Routes
router.get("/", verifyJWT, messagesController.getAllMessages);
router.get("/:id", verifyJWT, messagesController.getMessageById);
router.patch("/:id/reply", verifyJWT, messagesController.updateMessageStatus);
router.post("/", messagesController.sendMessage);

module.exports = router; // Export the router
