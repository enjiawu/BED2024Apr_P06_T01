// staffRoutes.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const staffsController = require("../controllers/staffsController.js");

// Middleware
const verifyJWT = require('../middlewares/verifyJWT.js');

// Routes
router.get("/alladmin", verifyJWT, staffsController.getAllStaffs); 
router.post("/register", staffsController.registerStaff);
router.post("/login", staffsController.loginStaff);

module.exports = router; // Export the router