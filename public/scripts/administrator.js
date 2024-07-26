document.addEventListener("DOMContentLoaded", async function () {
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

            const originalPosterResponse = await fetch(
                `/users/profile/${post.userId}`
            );
            console.log(originalPosterResponse);
            const originalPoster = await originalPosterResponse.json();
            newPostReportCard.querySelector(".original-poster").innerText =
                originalPoster.username;

            newPostReportCard
                .querySelector(".original-poster")
                .addEventListener("click", async function () {
                    const userResponse = await fetch(
                        `/users/${originalPoster.username}`
                    );
                    const user = await userResponse.json();

                    const userModal = document.querySelector(".user-modal");

                    userModal.querySelector(".profile-picture").src =
                        user.profilePicture;
                    userModal.querySelector(".username").innerText =
                        user.username;
                    userModal.querySelector(".role").innerText = user.role;
                    userModal.querySelector(".bio").innerText = user.bio;
                    userModal.querySelector(".email").innerText = user.email;
                    userModal.querySelector(".location").innerText =
                        user.location;
                    userModal.querySelector(".id").innerText = user.userId;

                    userModal.style.display = "block";
                    document.body.classList.add("stop-scrolling");
                });

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
                `/users/profile/${postReport.userId}`
            );
            const postReporter = await postReporterResponse.json();
            newPostReportCard.querySelector(".post-reporter").innerText =
                postReporter.username;

            newPostReportCard
                .querySelector(".post-reporter")
                .addEventListener("click", async function () {
                    const userResponse = await fetch(
                        `/users/${postReporter.username}`
                    );
                    const user = await userResponse.json();

                    const userModal = document.querySelector(".user-modal");

                    userModal.querySelector(".profile-picture").src =
                        user.profilePicture;
                    userModal.querySelector(".username").innerText =
                        user.username;
                    userModal.querySelector(".role").innerText = user.role;
                    userModal.querySelector(".bio").innerText = user.bio;
                    userModal.querySelector(".email").innerText = user.email;
                    userModal.querySelector(".location").innerText =
                        user.location;
                    userModal.querySelector(".id").innerText = user.userId;

                    userModal.style.display = "block";
                    document.body.classList.add("stop-scrolling");
                });

            newPostReportCard.querySelector(".report-reason").innerText =
                postReport.reason;

            newPostReportCard.setAttribute(
                "data-report-id",
                postReport.reportId
            );
            newPostReportCard.setAttribute("data-post-id", post.postId);

            newPostReportCard
                .querySelector(".ignore-button")
                .addEventListener("click", async function () {
                    const reportId =
                        newPostReportCard.getAttribute("data-report-id");
                    const deletePostReportResponse = await fetch(
                        `/reports/posts/${reportId}`,
                        {
                            method: "DELETE",
                        }
                    );
                    if (deletePostReportResponse.ok) {
                        newPostReportCard.parentNode.removeChild(
                            newPostReportCard
                        );
                    }
                });

            newPostReportCard
                .querySelector(".remove-button")
                .addEventListener("click", async function () {
                    const reportId =
                        newPostReportCard.getAttribute("data-report-id");
                    const deletePostReportResponse = await fetch(
                        `/reports/posts/${reportId}`,
                        {
                            method: "DELETE",
                        }
                    );
                    if (deletePostReportResponse.ok) {
                        const postId =
                            newPostReportCard.getAttribute("data-post-id");
                        const deletePostResponse = await fetch(
                            `/communityforum/${postId}`,
                            {
                                method: "DELETE",
                            }
                        );
                    }
                });
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
                `/users/profile/${comment.userId}`
            );
            const originalCommenter = await originalCommenterResponse.json();
            newCommentReportCard.querySelector(
                ".original-commenter"
            ).innerText = originalCommenter.username;
            newCommentReportCard
                .querySelector(".original-commenter")
                .addEventListener("click", async function () {
                    const userResponse = await fetch(
                        `/users/${originalCommenter.username}`
                    );
                    const user = await userResponse.json();

                    const userModal = document.querySelector(".user-modal");

                    userModal.querySelector(".profile-picture").src =
                        user.profilePicture;
                    userModal.querySelector(".username").innerText =
                        user.username;
                    userModal.querySelector(".role").innerText = user.role;
                    userModal.querySelector(".bio").innerText = user.bio;
                    userModal.querySelector(".email").innerText = user.email;
                    userModal.querySelector(".location").innerText =
                        user.location;
                    userModal.querySelector(".id").innerText = user.userId;

                    userModal.style.display = "block";
                    document.body.classList.add("stop-scrolling");
                });

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
                `/users/profile/${commentReport.userId}`
            );
            const commentReporter = await commentReporterResponse.json();
            newCommentReportCard.querySelector(".comment-reporter").innerText =
                commentReporter.username;

            newCommentReportCard
                .querySelector(".comment-reporter")
                .addEventListener("click", async function () {
                    const userResponse = await fetch(
                        `/users/${commentReporter.username}`
                    );
                    const user = await userResponse.json();

                    const userModal = document.querySelector(".user-modal");

                    userModal.querySelector(".profile-picture").src =
                        user.profilePicture;
                    userModal.querySelector(".username").innerText =
                        user.username;
                    userModal.querySelector(".role").innerText = user.role;
                    userModal.querySelector(".bio").innerText = user.bio;
                    userModal.querySelector(".email").innerText = user.email;
                    userModal.querySelector(".location").innerText =
                        user.location;
                    userModal.querySelector(".id").innerText = user.userId;

                    userModal.style.display = "block";
                    document.body.classList.add("stop-scrolling");
                });

            newCommentReportCard.querySelector(".report-reason").innerText =
                commentReport.reason;

            newCommentReportCard.setAttribute(
                "data-report-id",
                commentReport.reportId
            );
            newCommentReportCard.setAttribute("data-post-id", comment.postId);
            newCommentReportCard.setAttribute(
                "data-comment-id",
                commentReport.commentId
            );

            newCommentReportCard
                .querySelector(".view-post-button")
                .setAttribute(
                    "href",
                    `/html/community-forum-post.html?id=${comment.postId}`
                );

            newCommentReportCard
                .querySelector(".ignore-button")
                .addEventListener("click", async function () {
                    const reportId =
                        newCommentReportCard.getAttribute("data-report-id");
                    const deleteCommentReportResponse = await fetch(
                        `/reports/comments/${reportId}`,
                        {
                            method: "DELETE",
                        }
                    );
                    if (deleteCommentReportResponse.ok) {
                        newCommentReportCard.parentNode.removeChild(
                            newCommentReportCard
                        );
                    }
                });
            newCommentReportCard
                .querySelector(".remove-button")
                .addEventListener("click", async function () {
                    const reportId =
                        newCommentReportCard.getAttribute("data-report-id");
                    const deleteCommentReportResponse = await fetch(
                        `/reports/comments/${reportId}`,
                        {
                            method: "DELETE",
                        }
                    );
                    if (deleteCommentReportResponse.ok) {
                        const commentId =
                            newCommentReportCard.getAttribute(
                                "data-comment-id"
                            );
                        const deleteCommentResponse = await fetch(
                            `/communityforum/comments/${commentId}`,
                            {
                                method: "DELETE",
                            }
                        );
                    }
                });

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
            if (message.status === "unanswered") {
                let newMessageCard = messageCardTemplate.cloneNode(true);
                messagesList.appendChild(newMessageCard);

                newMessageCard.querySelector(".name").innerText =
                    message.lastName !== null
                        ? message.firstName + " " + message.lastName
                        : message.firstName;
                newMessageCard.querySelector(".email").innerText =
                    message.email;
                newMessageCard.querySelector(".message").innerText =
                    message.message;
                newMessageCard.querySelector(".phone-number").innerText =
                    message.phoneNumber;

                newMessageCard
                    .querySelector(".reply-button")
                    .addEventListener("click", async function () {
                        if (
                            newMessageCard.querySelector(".reply-input")
                                .value !== ""
                        ) {
                            const postReplyResponse = await fetch("/replies", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    submissionId: message.Id,
                                    staffId: 1,
                                    senderEmail: message.email,
                                    originalMessage: message.message,
                                    replyDescription:
                                        newMessageCard.querySelector(
                                            ".reply-input"
                                        ).value,
                                }),
                            });
                            if (postReplyResponse.ok) {
                                const updateMessageStatusResponse = await fetch(
                                    `/messages/reply/${message.Id}`,
                                    {
                                        method: "PATCH",
                                    }
                                );
                                if (updateMessageStatusResponse.ok) {
                                    newMessageCard.parentNode.removeChild(
                                        newMessageCard
                                    );
                                }
                            }
                        }
                    });

                newMessageCard.classList.remove("hidden");
            }
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
        await loadPostReports();
    } else if (commentReportsTab.classList.contains("active")) {
        await loadCommentReports();
    } else if (messagesTab.classList.contains("active")) {
        await loadMessages();
    }
});
