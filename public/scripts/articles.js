document.addEventListener("DOMContentLoaded", function () {
    async function loadArticles(sortBy) {
        const articlesResponse = await fetch(`/articles/${sortBy}`);

        const articles = await articlesResponse.json();
        console.log(articles);

        const articlesList =
            document.getElementsByClassName("articles-list")[0];
        const articleCardTemplate =
            document.getElementsByClassName("article-card")[0];

        const clientTimezone = Intl.DateTimeFormat().resolvedOptions();
        console.log(clientTimezone);

        for (let article of articles) {
            console.log(article);

            let newArticleCard = articleCardTemplate.cloneNode(true);
            articlesList.appendChild(newArticleCard);

            newArticleCard.querySelector(".article-source-and-date").innerHTML =
                article.source.name +
                "  &bull;  " +
                article.publishedAt.slice(0, 10) +
                " " +
                article.publishedAt.slice(11, 19) +
                article.publishedAt.slice(23);

            newArticleCard.querySelector(".article-heading").innerText =
                article.title;
            newArticleCard.querySelector(".article-description").innerText =
                article.description;
            newArticleCard.querySelector(".article-image").src =
                article.urlToImage;

            newArticleCard.classList.remove("hidden");
        }
    }

    loadArticles("relevancy");
});
