// staffRoutes.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const staffsController = require("../controllers/staffsController.js");

// Middleware
const {validateRegisterStaff, validateLoginStaff} = require('../middlewares/validateStaff.js');

// Routes
router.get("/alladmin", staffsController.getAllStaffs); 
router.post("/register", validateRegisterStaff, staffsController.registerStaff);
router.post("/login", validateLoginStaff, staffsController.loginStaff);

module.exports = router; // Export the router