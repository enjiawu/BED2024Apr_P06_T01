// messageRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const messagesController = require("../controllers/messagesController.js");

//Message Routes
router.get("/", messagesController.getAllMessages);
router.get("/:id", messagesController.getMessageById);
router.patch("/reply/:id", messagesController.updateMessageStatus);
router.post("/", messagesController.sendMessage);

module.exports = router; // Export the router
