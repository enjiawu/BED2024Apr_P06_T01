// eventsRouter.js 
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

//Importing controllers
const eventsController = require("../controllers/eventsController.js");

//Importing middleware
const upload = require('../middlewares/fileUpload');
const validateEvent = require('../middlewares/validateEvent');
const validateLikes = require("../middlewares/validateLikes");

//Event Routes
router.get("/", eventsController.getAllEvents);
router.get("/listed", eventsController.getListedEvents);
router.get("/pending", eventsController.getPendingEvents);
router.get("/denied", eventsController.getDeniedEvents);
router.get("/count", eventsController.getEventCount);
router.get("/search", eventsController.searchEvents);
router.get("/status/:status", eventsController.getEventsByStatus);
router.get("/:id", eventsController.getEventById);
router.get("/:eventId/get-like-by-user/:userId", eventsController.getLikeByUser)
router.get("/:eventId/get-event-participation/:userId", eventsController.getEventByUser);
router.post("/", upload.single('image'), validateEvent, eventsController.createEvent);
router.put("/approve/:id", eventsController.approveEvent);
router.put("/deny/:id", eventsController.denyEvent);
router.put("/:id/modifylike", validateLikes, eventsController.modifyLike);
router.put("/:id/modifyparticipation", eventsController.modifyParticipation);
router.put("/:id", upload.single('image'), validateEvent, eventsController.updateEvent);
router.delete("/:id", eventsController.deleteEvent);

module.exports = router; // Export the router