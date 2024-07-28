const axios = require("axios");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");
require("dotenv").config(); // Import dotenv package to read environment variables

class Article {
    constructor(searchTerm, sortBy) {
        this.searchTerm = searchTerm;
        this.sortBy = sortBy;
    }

    static async getArticles(searchTerm, sortBy) {
        if (searchTerm === undefined || searchTerm === "undefined")
            searchTerm = "";
        const response = await axios.get(
            `https://newsapi.org/v2/everything?q=%22sustainable%20living%22%22${searchTerm}%22&sortBy=${sortBy}&apiKey=${process.env.ARTICLES_API_KEY}`
        );

        console.log(
            `https://newsapi.org/v2/everything?q=%22sustainable%20living%22%22${searchTerm}%22&sortBy=${sortBy}&apiKey=${process.env.ARTICLES_API_KEY}`
        );

        return response.data.articles;
    }

    // Fetch the article content using Axios
    static async getArticleContent(articleUrl) {
        const response = await axios.get(articleUrl);
        const html = response.data;
        const dom = new JSDOM(html, { url: articleUrl });
        const reader = new Readability(dom.window.document);
        const article = reader.parse();

        // console.log("Title:", article.title);
        // console.log("Content:", article.content);
        return article.content;
    }
}

module.exports = Article;
