// eventsRouter.js 
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

//Importing controllers
const eventsController = require("../controllers/eventsController.js");

const upload = require('../middlewares/fileUpload');

//Event Routes
router.get("/", eventsController.getAllEvents);
router.get("/listed", eventsController.getListedEvents);
router.get("/pending", eventsController.getPendingEvents);
router.get("/denied", eventsController.getDeniedEvents);
router.get("/count", eventsController.getEventCount);
router.get("/search", eventsController.searchEvents);
router.get("/status/:status", eventsController.getEventsByStatus);
router.get("/:id", eventsController.getEventById);
router.post("/", upload.single('image'), eventsController.createEvent);
router.put("/approve/:id", eventsController.approveEvent);
router.put("/deny/:id", eventsController.denyEvent);
router.put("/:id", upload.single('image'), eventsController.updateEvent);
router.delete("/:id", eventsController.deleteEvent);

module.exports = router; // Export the router