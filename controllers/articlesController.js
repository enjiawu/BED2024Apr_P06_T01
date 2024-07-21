const Article = require("../models/article");

const getArticles = async (req, res) => {
    try {
        const articles = await Article.getArticles(
            req.query.searchTerm,
            req.params.sortBy
        );
        res.status(200).json(articles);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving articles");
    }
};

const getArticleContent = async (req, res) => {
    try {
        const article = await Article.getArticleContent(req.params.articleUrl);
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
