document.addEventListener("DOMContentLoaded", function () {
    async function loadReports() {
        const reportsResponse = await fetch("/post-reports");
        const reports = await reportsResponse.json();
        // console.log(reports);

        const reportsList = document.getElementsByClassName("reports-list")[0];
        const reportCardTemplate =
            document.getElementsByClassName("report-card")[0];

        for (let report of reports) {
            const postResponse = await fetch(
                `/communityforum/${report.postId}`
            );
            const post = await postResponse.json();
            // console.log(post);

            let newReportCard = reportCardTemplate.cloneNode(true);
            reportsList.appendChild(newReportCard);

            newReportCard.querySelector(".post-title").innerText = post.title;
            newReportCard.querySelector(".post-likes").innerText = post.likes;
            newReportCard.querySelector(".post-description").innerText =
                post.description;

            const originalPosterResponse = await fetch(`/users/${post.userId}`);
            const originalPoster = await originalPosterResponse.json();
            newReportCard.querySelector(".original-poster").innerText =
                originalPoster.username;

            newReportCard.querySelector(".post-comments").innerText =
                post.comments;

            const topicResponse = await fetch(
                `/communityforum/topics/${post.topicId}`
            );
            const topic = await topicResponse.json();
            newReportCard.querySelector(".post-topics").innerText = topic.topic;

            newReportCard.querySelector(".date-posted").innerText =
                post.dateCreated.slice(0, 10) +
                " " +
                post.dateCreated.slice(11, 19) +
                post.dateCreated.slice(23);

            newReportCard.querySelector(".date-reported").innerText =
                report.dateReported.slice(0, 10) +
                " " +
                report.dateReported.slice(11, 19) +
                report.dateReported.slice(23);

            const reporterResponse = await fetch(`/users/${report.userId}`);
            const reporter = await reporterResponse.json();
            newReportCard.querySelector(".post-reporter").innerText =
                reporter.username;

            newReportCard.querySelector(".report-reason").innerText =
                report.reason;

            newReportCard.classList.remove("hidden");
        }

        // reportCardTemplate.classList.add("hidden");
    }

    async function loadMessages() {
        const messagesResponse = await fetch("/messages");
        const messages = await messagesResponse.json();
        // console.log(messages);

        const messagesList =
            document.getElementsByClassName("messages-list")[0];
        const messageCardTemplate =
            document.getElementsByClassName("message-card")[0];

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

    const reportsTab = document.getElementsByClassName("admin-reports-tab")[0];
    reportsTab.addEventListener("click", loadReports);

    const messagesTab =
        document.getElementsByClassName("admin-messages-tab")[0];
    messagesTab.addEventListener("click", loadMessages);

    if (reportsTab.classList.contains("active")) {
        loadReports();
    } else if (messagesTab.classList.contains("active")) {
        loadMessages();
    }
});
