document.addEventListener("DOMContentLoaded", function () {
    const userCounter = document.getElementsByClassName("user-counter")[0];
    const postCounter = document.getElementsByClassName("post-counter")[0];
    const eventCounter = document.getElementsByClassName("event-counter")[0];

    async function updateCounters() {
        const userCountResponse = await fetch("/users/count");
        const userCountData = await userCountResponse.json();

        const postCountResponse = await fetch("/communityforum/post-count");
        const postCountData = await postCountResponse.json();

        const eventCountResponse = await fetch("/events/count");
        const eventCountData = await eventCountResponse.json();

        if (
            userCounter.innerText == "..." ||
            parseInt(userCounter.innerText) == userCountData.userCount
        ) {
            userCounter.innerText = userCountData.userCount;
        }

        if (
            postCounter.innerText == "..." ||
            parseInt(postCounter.innerText) == postCountData.postCount
        ) {
            postCounter.innerText = postCountData.postCount;
        }

        if (
            eventCounter.innerText == "..." ||
            parseInt(eventCounter.innerText) == eventCountData.eventCount
        ) {
            eventCounter.innerText = eventCountData.eventCount;
        }
    }

    updateCounters();
});
