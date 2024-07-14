// cabronFootprintCalculatorRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const carbonFootprintCalculatorController = require("../controllers/carbonFootprintController.js");

// Calculate carbon footprint route
router.get("/", carbonFootprintCalculatorController.calculateCarbonFootprint);

module.exports = router; // Export the router