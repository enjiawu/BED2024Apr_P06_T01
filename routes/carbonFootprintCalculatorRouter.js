// cabronFootprintCalculatorRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const carbonFootprintCalculatorController = require("../controllers/carbonFootprintController.js");

// Importing Middleware
const validateCarbonFootprint = require("../middlewares/validateCarbonFootprint.js");
const validateCarbonFootprintAction = require("../middlewares/validateCarbonFootprintAction.js");

// Calculate carbon footprint route
router.post("/",validateCarbonFootprint, carbonFootprintCalculatorController.calculateCarbonFootprint); // Calculate carbon footprint

// Carbon footprint possible actions route
router.get("/possibleActions", carbonFootprintCalculatorController.getCarbonFootprintPossibleActions); // Get carbon footprint possible actions
router.get("/possibleActions/:id", carbonFootprintCalculatorController.getCarbonFootprintPossibleActionsById); // Get carbon footprint possible actions by id
router.post("/possibleActions", validateCarbonFootprintAction, carbonFootprintCalculatorController.createCarbonFootprintPossibleAction); // Create carbon footprint possible action
router.put("/possibleActions/:id", validateCarbonFootprintAction, carbonFootprintCalculatorController.updateCarbonFootprintPossibleAction); // Update carbon footprint possible action
router.delete("/possibleActions/:id", carbonFootprintCalculatorController.deleteCarbonFootprintPossibleAction); // Delete carbon footprint possible action


module.exports = router; // Export the router