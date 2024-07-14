// userRoutes.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const usersController = require("../controllers/usersController.js");

//User Routes
router.get("/", usersController.getAllUsers);
router.post("/", usersController.registerUser);
router.post("/login", usersController.loginUser);
//router.post("/users/logout", usersController.logoutUser);
router.get("/count", usersController.getUserCount);
router.get("/:id", usersController.getUserById);

module.exports = router; // Export the router
