// articlesRouter.js
//Importing modules/packages
const express = require("express");

//Instatiating the app
const router = express.Router();

//Importing controllers
const articlesController = require("../controllers/articlesController.js");

//Reply Routes
router.get("/:articleUrl/content", articlesController.getArticleContent);
router.get("/:sortBy", articlesController.getArticles);

module.exports = router; // Export the router
