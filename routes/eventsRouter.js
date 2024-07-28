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
const verifyJWT = require("../middlewares/verifyJWT");

//Event Routes
router.get("/", eventsController.getAllEvents);
router.get("/listed", eventsController.getListedEvents);
router.get("/pending", eventsController.getPendingEvents);
router.get("/denied", eventsController.getDeniedEvents);
router.get("/count", eventsController.getEventCount);
router.get("/search", eventsController.searchEvents);
router.get("/status/:status", eventsController.getEventsByStatus);
router.get("/:id", eventsController.getEventById);
router.get("/:userId/participated", eventsController.getParticipatedEvents);
router.get("/:userId/events-hosted", eventsController.getHostedEventsbyUser);
router.get("/:eventId/get-like-by-user/:userId", eventsController.getLikeByUser);
router.get("/:eventId/get-event-participation/:userId", eventsController.getEventByUser);
router.post("/", verifyJWT, upload.single('image'), validateEvent, eventsController.createEvent);
router.put("/approve/:id", eventsController.approveEvent);
router.put("/deny/:id", eventsController.denyEvent);
router.put("/:id/modify-like", verifyJWT, validateLikes, eventsController.modifyLike);
router.put("/:id/modify-participation", verifyJWT, eventsController.modifyParticipation);
router.put("/:id", verifyJWT, upload.single('image'), validateEvent, eventsController.updateEvent);
router.delete("/:id", verifyJWT, eventsController.deleteEvent);

module.exports = router; // Export the router