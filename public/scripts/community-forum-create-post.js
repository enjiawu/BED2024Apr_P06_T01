const userId = 5; // Hardcoded user ID for testing purposes

function validateInput() {
    const title = document.getElementById("post-title").value;
    const description = document.getElementById("post-description").value;
    const topicId = document.getElementById("select-topic-dropdown").dataset.topicId;

    console.log(title, description, topicId);

    if (!title || !description || !topicId) {
        alert("Please fill in all fields and select a topic.");
        return false;
    }
    return true;
}

// Populate drop down options for post topics and add event listeners for the topics
async function populateTopicsDropdown() {
    const response = await fetch("/communityforum/topics");
    const data = await response.json();

    const topicList = document.getElementById("topic-dropdown");
    const topicDropdownButton = document.getElementById("select-topic-dropdown");

    data.forEach((topic) => {
        // Create the topic option
        const topicOptionContainer = document.createElement("li");
        const topicOption = document.createElement("a");
        topicOption.classList.add("dropdown-item");
        topicOption.dataset.topicId = topic.topicId;
        topicOption.textContent = topic.topic;

        // Append the option to the topic list
        topicOptionContainer.appendChild(topicOption);
        topicList.appendChild(topicOptionContainer);
    });

    // Add event listeners to the topic dropdown options
    const topicDropdownItems = document.querySelectorAll("#topic-dropdown li a");
    topicDropdownItems.forEach((item) => {
        item.addEventListener("click", function(event) {
            const selectedTopic = event.target.textContent;
            const topicId = event.target.dataset.topicId; // Get the topic ID from the data attribute

            // Update the text of the topic-dropdown-button
            topicDropdownButton.textContent = selectedTopic;
            topicDropdownButton.dataset.topicId = topicId; // Store the topic ID in the data attribute
        });
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    populateTopicsDropdown();

    const addPostButton = document.getElementById("add-post-button");

    addPostButton.addEventListener("click", async (event) => {
        event.preventDefault();

        topicId = parseInt(document.getElementById("select-topic-dropdown").dataset.topicId);
        title = document.getElementById("post-title").value;
        description = document.getElementById("post-description").value;

        if (validateInput()) {
            const postData = {
                userId,
                title,
                description,
                topicId,
            };

            console.log(postData);

            const response = await fetch("/communityforum", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    postData
                )
            });

            const data = await response.json();
            console.log(data);

            if (!response.ok) {
                const result = await response.json();
                if (result.errors) {
                    result.errors.forEach(error => {
                        alert(error);
                    });
                }
            }
            else if (response.status === 201) {
                alert("Post created successfully!");
                window.location.href = "community-forum.html";
            } else {
                alert("Failed to create post.");
            }
        }
    });
});