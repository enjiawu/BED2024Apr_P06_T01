// articlesRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

//Importing controllers
const articlesController = require("../controllers/articlesController.js");

//Reply Routes
router.get("/", articlesController.getArticles);
router.get("/content", articlesController.getArticleContent);

module.exports = router; // Export the router
