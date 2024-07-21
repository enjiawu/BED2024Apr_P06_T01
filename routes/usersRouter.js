// userRoutes.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const usersController = require("../controllers/usersController.js");

// Middleware
const verifyJWT = require("../middlewares/verifyJWT.js");

//User Routes
router.get("/allmember", verifyJWT, usersController.getAllUsers); // testing data
router.get("/profile/:userId", usersController.getUserByUserId); 
router.put("/profile/:userId/edit", verifyJWT, usersController.updateUser);
router.get("/count", usersController.getUserCount);
router.get("/:username", usersController.getUserByUserName);
router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);
//router.post("/users/logout", usersController.logoutUser);

module.exports = router; // Export the router
