let userId = null; // Initialize the user ID
let token = localStorage.getItem('token'); // Get the token from local storage

// Function to get the user data from the token
function getUserDataFromToken() {
    if (!token) {
        console.log("No token found");
        return false;
    }

    userId = JSON.parse(localStorage.getItem("userData")).user.userId;

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

async function loadPostData(postId) {
    const postResponse = await fetch(`/communityforum/${postId}`);
    const postData = await postResponse.json();
    document.getElementById("post-title").value = postData.title;
    document.getElementById("post-description").value = postData.description;
    document.getElementById("select-topic-dropdown").dataset.topicId = postData.topicId;

    // Get topic by topic ID
    const topicResponse = await fetch(`/communityforum/topics/${postData.topicId}`);
    const topicData = await topicResponse.json();
    document.getElementById("select-topic-dropdown").textContent = topicData.topic;
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
    await populateTopicsDropdown();
    const postId = getQueryParam('id');

    await loadPostData(postId);

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

            try{
                const response = await fetch(`/communityforum/${postId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(
                        postData
                    )
                });
    
                const data = await response.json();
                console.log(data);
    
                if (data.errors) {
                    data.errors.forEach(error => {
                        alert(error);
                    });
                }
                else if (response.status === 200) {
                    alert("Post updated successfully!");
                    window.location.href = `community-forum-post.html?id=${postId}`;
                } else {
                    console.error(data.error);
                    throw new Error("Failed to update post. You may not have the necessary permissions.");
                }
            }
            catch(error){
                console.error("Error:", error);
                alert("Failed to update post. You may not have the necessary permissions.");
            }
        }
    });
});