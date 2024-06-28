async function fetchTrendingTopics() {
    const response = await fetch("/communityforum/topics"); // Replace with your API endpoint
    const data = await response.json();

    console.log(data); // Log the data to the console
  
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

async function populateTopicsDropdown(){
    const response = await fetch("/communityforum/topics"); // Replace with your API endpoint
    const data = await response.json();

    const topicList = document.getElementById("topic-dropdown");
    topicList.innerHTML = ""; // Clear the existing topics

    data.forEach((topic) => {
        //Create the topic option
        const topicOptionContainer = document.createElement("li");
        const topicOption = document.createElement("a");
        topicOption.classList.add("dropdown-item");
        topicOption.href = "#";
        topicOption.value = topic.topicId;
        topicOption.textContent = topic.topic;

        //Append the option to the topic list
        topicOptionContainer.appendChild(topicOption);
        topicList.appendChild(topicOptionContainer);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    fetchTrendingTopics(); // Call the function to fetch and display trending topics
    populateTopicsDropdown(); // Call the function to fetch and display topic data
});

