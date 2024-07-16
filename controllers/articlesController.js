const Article = require("../models/article");

const getArticles = async (req, res) => {
    try {
        const articles = await Article.getArticles(req.body.sortBy);
        res.status(200).json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving articles");
    }
};

const getArticleContent = async (req, res) => {
    const articleUrl = req.body.articleUrl;
    // console.log(articleUrl);

    try {
        const article = await Article.getArticleContent(articleUrl);
        res.status(200).json(article);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching article");
    }
};

module.exports = {
    getArticles,
    getArticleContent,
};
