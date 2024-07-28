// userRoutes.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

// Importing Controllers
const usersController = require("../controllers/usersController.js");

// Middleware
const verifyJWT = require("../middlewares/verifyJWT.js");
const upload = require("../middlewares/fileUpload.js");

//User Routes
router.get("/allmember", usersController.getAllUsers); // testing data
router.get("/profile/:userId", verifyJWT,usersController.getUserByUserId); 
router.put("/profile/:userId", verifyJWT, upload.single('file'), usersController.updateUser);
router.get("/count", usersController.getUserCount);
router.get("/:username", usersController.getUserByUserName);
router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);
router.post("/changePassword", verifyJWT, usersController.changePassword);

module.exports = router; // Export the router
