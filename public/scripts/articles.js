document.addEventListener("DOMContentLoaded", function () {
    const articleReaderModal = document.getElementById("article-reader-modal");

    async function loadArticles(searchTerm, sortBy) {
        const articlesResponse = await fetch(
            `/articles/${sortBy}?searchTerm=${searchTerm}`
        );

        console.log(`/articles/${sortBy}?searchTerm=${searchTerm}`);

        const articles = await articlesResponse.json();
        console.log(articles);

        const articlesList =
            document.getElementsByClassName("articles-list")[0];
        const articleCardTemplate =
            document.getElementsByClassName("article-card")[0];
        articlesList.replaceChildren(articleCardTemplate);

        const clientTimezone = Intl.DateTimeFormat().resolvedOptions();
        console.log(clientTimezone);

        for (let article of articles) {
            // console.log(article);

            let newArticleCard = articleCardTemplate.cloneNode(true);
            articlesList.appendChild(newArticleCard);

            newArticleCard.querySelector(".article-source").innerText =
                article.source.name;

            newArticleCard.querySelector(".article-date").innerText =
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

            newArticleCard.setAttribute("data-bs-article-url", article.url);
            newArticleCard.setAttribute(
                "data-bs-author",
                article.source.author
            );

            newArticleCard.addEventListener("click", async function () {
                console.log(this);

                const contentResponse = await fetch(
                    `/articles/${encodeURIComponent(
                        this.getAttribute("data-bs-article-url")
                    )}/content`
                );
                const content = await contentResponse.json();

                articleReaderModal
                    .querySelector(".article-link")
                    .setAttribute(
                        "href",
                        this.getAttribute("data-bs-article-url")
                    );

                articleReaderModal.querySelector(".modal-title").innerText =
                    this.querySelector(".article-heading").innerText;
                articleReaderModal.querySelector(".article-heading").innerText =
                    this.querySelector(".article-heading").innerText;
                articleReaderModal.querySelector(".article-content").innerHTML =
                    content;
                articleReaderModal
                    .querySelector(".article-reader-image")
                    .setAttribute(
                        "src",
                        this.querySelector(".article-image").src
                    );
                articleReaderModal.querySelector(
                    ".article-source-and-author"
                ).innerText =
                    this.getAttribute("data-bs-author") === "undefined"
                        ? this.querySelector(".article-source").innerText
                        : this.querySelector(".article-source").innerText +
                          " - " +
                          this.getAttribute("data-bs-author");

                articleReaderModal.querySelector(".article-date").innerText =
                    this.querySelector(".article-date").innerText;
            });

            newArticleCard.classList.remove("hidden");
        }
    }

    const close = document.getElementsByClassName("close")[0];
    close.addEventListener("click", function () {
        articleReaderModal
            .querySelector(".article-link")
            .setAttribute("href", "");

        articleReaderModal.querySelector(".modal-title").innerText = "";
        articleReaderModal.querySelector(".article-heading").innerText = "";
        articleReaderModal.querySelector(".article-content").innerHTML = "";
        articleReaderModal
            .querySelector(".article-reader-image")
            .setAttribute("src", "");
        articleReaderModal.querySelector(
            ".article-source-and-author"
        ).innerText = "";

        articleReaderModal.querySelector(".article-date").innerText = "";
    });

    const searchBar = document.getElementsByClassName("search-bar")[0];
    const clear = document.getElementsByClassName("clear")[0];
    let typingTimer;
    searchBar.addEventListener("input", function () {
        if (this.value.length > 0) {
            clear.classList.remove("hidden");
            this.id = "";
        } else {
            clear.classList.add("hidden");
            this.id = "right-border-radius";
        }
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function () {
            console.log(searchBar.value);
            loadArticles(searchBar.value, sortBy);
        }, 500);
    });

    clear.addEventListener("click", function () {
        searchBar.value = "";
        clear.classList.add("hidden");
        searchBar.id = "right-border-radius";
        loadArticles("", sortBy);
    });

    searchBar.value = "";

    let sortBy = "relevancy";
    const sortByDropdown =
        document.getElementsByClassName("dropdown-toggle")[0];
    sortByDropdown.innerText = sortBy;

    for (const option of document.getElementsByClassName("dropdown-item")) {
        option.addEventListener("click", function () {
            sortBy = this.getAttribute("data-sort-by");
            sortByDropdown.innerText = option.innerText;
            loadArticles(searchBar.value, sortBy);

            for (const option of document.getElementsByClassName(
                "dropdown-item"
            )) {
                option.classList.remove("active");
            }
            this.classList.add("active");
        });
    }

    loadArticles("", sortBy);
});
