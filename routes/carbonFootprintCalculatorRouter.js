// cabronFootprintCalculatorRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const carbonFootprintCalculatorController = require("../controllers/carbonFootprintController.js");

// Importing Middleware
const validateCarbonFootprint = require("../middlewares/validateCarbonFootprint.js");

// Calculate carbon footprint route
router.post("/",validateCarbonFootprint, carbonFootprintCalculatorController.calculateCarbonFootprint); // Calculate carbon footprint

module.exports = router; // Export the router