async function fetchTrendingTopics() {
    const response = await fetch("/communityforum/trending-topics"); 
    const data = await response.json();
  
    const topicList = document.getElementById("topics");
    topicList.innerHTML = ""; // Clear the existing topics

    data.forEach((topic) => {
        //Create the topic content 
        const topicContent = document.createElement("div");
        topicContent.classList.add("d-flex", "flex-row");

        //Create the circle icon
        const circle = document.createElement("div");
        circle.classList.add("circle");

        //Create the topic name
        const topicName = document.createElement("p");
        topicName.classList.add("topic");
        topicName.textContent = topic.topic;

        //Append the elements to the topic content
        topicContent.appendChild(circle);
        topicContent.appendChild(topicName);

        //Append the topic content to the topic list
        topicList.appendChild(topicContent);   
    
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    await fetchTrendingTopics(); // Call the function to fetch and display trending topics
});

