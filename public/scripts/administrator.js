document.addEventListener("DOMContentLoaded", function () {
    async function loadPostReports() {
        const postReportsResponse = await fetch("/reports/posts");
        const postReports = await postReportsResponse.json();
        // console.log(postReports);

        const postReportsList =
            document.getElementsByClassName("post-reports-list")[0];
        const postReportCardTemplate =
            document.getElementsByClassName("post-report-card")[0];
        postReportsList.replaceChildren(postReportCardTemplate);

        for (let postReport of postReports) {
            const postResponse = await fetch(
                `/communityforum/${postReport.postId}`
            );
            const post = await postResponse.json();
            // console.log(post);

            let newPostReportCard = postReportCardTemplate.cloneNode(true);
            postReportsList.appendChild(newPostReportCard);

            newPostReportCard.querySelector(".post-title").innerText =
                post.title;
            newPostReportCard.querySelector(".post-likes").innerText =
                post.likes;
            newPostReportCard.querySelector(".post-description").innerText =
                post.description;

            const originalPosterResponse = await fetch(`/users/${post.userId}`);
            const originalPoster = await originalPosterResponse.json();
            newPostReportCard.querySelector(".original-poster").innerText =
                originalPoster.username;

            newPostReportCard.querySelector(".post-comments").innerText =
                post.comments;

            const topicResponse = await fetch(
                `/communityforum/topics/${post.topicId}`
            );
            const topic = await topicResponse.json();
            newPostReportCard.querySelector(".post-topics").innerText =
                topic.topic;

            newPostReportCard.querySelector(".date-posted").innerText =
                post.dateCreated.slice(0, 10) +
                " " +
                post.dateCreated.slice(11, 19) +
                post.dateCreated.slice(23);

            newPostReportCard.querySelector(".date-reported").innerText =
                postReport.dateReported.slice(0, 10) +
                " " +
                postReport.dateReported.slice(11, 19) +
                postReport.dateReported.slice(23);

            const postReporterResponse = await fetch(
                `/users/${postReport.userId}`
            );
            const postReporter = await postReporterResponse.json();
            newPostReportCard.querySelector(".post-reporter").innerText =
                postReporter.username;

            newPostReportCard.querySelector(".report-reason").innerText =
                postReport.reason;

            newPostReportCard.classList.remove("hidden");
        }

        // PostReportCardTemplate.classList.add("hidden");
    }

    async function loadCommentReports() {
        const commentReportsResponse = await fetch("/reports/comments");
        const commentReports = await commentReportsResponse.json();
        // console.log(commentReports);

        const commentReportsList = document.getElementsByClassName(
            "comment-reports-list"
        )[0];
        const commentReportCardTemplate = document.getElementsByClassName(
            "comment-report-card"
        )[0];
        commentReportsList.replaceChildren(commentReportCardTemplate);

        for (let commentReport of commentReports) {
            console.log(commentReport);
            const commentResponse = await fetch(
                `/communityforum/comments/${commentReport.commentId}`
            );
            const comment = await commentResponse.json();
            // console.log(comment);

            let newCommentReportCard =
                commentReportCardTemplate.cloneNode(true);
            commentReportsList.appendChild(newCommentReportCard);

            newCommentReportCard.querySelector(".comment-likes").innerText =
                comment.likes;
            newCommentReportCard.querySelector(".comment-body").innerText =
                comment.description;

            const originalCommenterResponse = await fetch(
                `/users/${comment.userId}`
            );
            const originalCommenter = await originalCommenterResponse.json();
            newCommentReportCard.querySelector(
                ".original-commenter"
            ).innerText = originalCommenter.username;

            newCommentReportCard.querySelector(".date-commented").innerText =
                comment.dateCreated.slice(0, 10) +
                " " +
                comment.dateCreated.slice(11, 19) +
                comment.dateCreated.slice(23);

            newCommentReportCard.querySelector(".date-reported").innerText =
                commentReport.dateReported.slice(0, 10) +
                " " +
                commentReport.dateReported.slice(11, 19) +
                commentReport.dateReported.slice(23);

            const commentReporterResponse = await fetch(
                `/users/${commentReport.userId}`
            );
            const commentReporter = await commentReporterResponse.json();
            newCommentReportCard.querySelector(".comment-reporter").innerText =
                commentReporter.username;

            newCommentReportCard.querySelector(".report-reason").innerText =
                commentReport.reason;

            newCommentReportCard.classList.remove("hidden");
        }

        // CommentReportCardTemplate.classList.add("hidden");
    }

    async function loadMessages() {
        const messagesResponse = await fetch("/messages");
        const messages = await messagesResponse.json();
        // console.log(messages);

        const messagesList =
            document.getElementsByClassName("messages-list")[0];
        const messageCardTemplate =
            document.getElementsByClassName("message-card")[0];
        messagesList.replaceChildren(messageCardTemplate);

        for (let message of messages) {
            // console.log(message);
            let newMessageCard = messageCardTemplate.cloneNode(true);
            messagesList.appendChild(newMessageCard);

            newMessageCard.querySelector(".name").innerText =
                message.lastName !== null
                    ? message.firstName + " " + message.lastName
                    : message.firstName;
            newMessageCard.querySelector(".email").innerText = message.email;
            newMessageCard.querySelector(".message").innerText =
                message.message;
            newMessageCard.querySelector(".phone-number").innerText =
                message.phoneNumber;

            newMessageCard.classList.remove("hidden");
        }

        // messageCardTemplate.classList.add("hidden");
    }

    const postReportsTab = document.getElementsByClassName(
        "admin-post-reports-tab"
    )[0];
    postReportsTab.addEventListener("click", loadPostReports);

    const commentReportsTab = document.getElementsByClassName(
        "admin-comment-reports-tab"
    )[0];
    commentReportsTab.addEventListener("click", loadCommentReports);

    const messagesTab =
        document.getElementsByClassName("admin-messages-tab")[0];
    messagesTab.addEventListener("click", loadMessages);

    if (postReportsTab.classList.contains("active")) {
        loadPostReports();
    } else if (commentReportsTab.classList.contains("active")) {
        loadCommentReports();
    } else if (messagesTab.classList.contains("active")) {
        loadMessages();
    }
});
