// eventsRouter.js 
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

//Importing controllers
const eventsController = require("../controllers/eventsController.js");

//Event Routes
router.get("/", eventsController.getAllEvents);
router.get("/count", eventsController.getEventCount);
router.get("/search", eventsController.searchEvents);
router.get("/status/:status", eventsController.getEventsByStatus);
router.get("/:id", eventsController.getEventById);
router.post("/", eventsController.createEvent);
router.put("/:id", eventsController.updateEvent);
router.delete("/:id", eventsController.deleteEvent);

module.exports = router; // Export the router