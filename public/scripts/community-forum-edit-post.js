let userId = null; // Initialize the user ID

// Function to get the user data from the token
function getUserDataFromToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        console.log("No token found");
        return false;
    }

    userId = JSON.parse(localStorage.getItem("userData")).userId;

    return true;
}

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

function loadPostData(postId) {
    fetch(`/communityforum/${postId}`)
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("post-title").value = data.title;
            document.getElementById("post-description").value = data.description;
            document.getElementById("select-topic-dropdown").dataset.topicId = data.topicId;

            // Get topic by topic ID
            const response = fetch(`/communityforum/topics/${data.topicId}`);
            response.then((response) => response.json())
                .then((data) => {
                    document.getElementById("select-topic-dropdown").textContent = data.topic;
                });
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

// Function to get query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to confirmm if user wants to return to the community forum
function leaveConfirmation(){
    const leave = confirm("Are you sure you want to leave this page? Your changes will not be saved.");
    if (leave){
        window.location.href = "community-forum.html";
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    getUserDataFromToken();
    populateTopicsDropdown();
    const postId = getQueryParam('id');

    loadPostData(postId);

    const editPostButton = document.getElementById("edit-post-button");

    editPostButton.addEventListener("click", async (event) => {
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

            const response = await fetch(`/communityforum/${postId}`, {
                method: "PUT",
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
                if (data.errors) {
                    data.errors.forEach(error => {
                        alert(error);
                    });
                }
            }

            else if (response.status === 200) {
                alert("Post updated successfully!");
                window.location.href = `community-forum-post.html?id=${postId}`;
            } else {
                alert("Failed to update post.");
            }
        }
    });
});