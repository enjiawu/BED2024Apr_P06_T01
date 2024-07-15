// userRoutes.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const usersController = require("../controllers/usersController.js");

// Middleware
const verifyJWT = require('../middlewares/verifyJWT.js');

//User Routes
router.get("/", verifyJWT, usersController.getAllUsers);
router.get("/:username", usersController.getUserByUserName);
router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);
//router.post("/users/logout", usersController.logoutUser);
router.get("/with-posts", usersController.getUsersWithPosts);
router.post("/add-post", usersController.addPostsToUser);
router.delete("/remove-post/:id", usersController.removePostsFromUser);
router.get("/count", usersController.getUserCount);

module.exports = router; // Export the router
