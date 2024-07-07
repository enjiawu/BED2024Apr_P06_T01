// Function to format the post data and display it on the page
async function formatPost(post, postList){    
    // Create the main post container element
    const postItem = document.createElement("div");
    postItem.classList.add("card", "mt-3");

    // Create the card body element
    const postBody = document.createElement("div");
    postBody.classList.add("card-body", "d-flex", "flex-row", "justify-content-between", "px-3", "py-3");

    // Creating the post left section
    const postLeft = document.createElement("div");
    postLeft.classList.add("d-flex", "flex-row", "align-items-center");

    // Likes section
    const likes = document.createElement("div");
    likes.classList.add("likes", "d-flex", "flex-row", "mx-2");

    const numberOfLikes = document.createElement("p");
    numberOfLikes.classList.add("number-of-likes");
    numberOfLikes.textContent = post.likes;
    likes.appendChild(numberOfLikes);

    const likeIcon = document.createElement("a");
    likeIcon.classList.add("like-icon", "like-false");
    const likeIconContent = document.createElement("i");
    likeIconContent.classList.add("fa", "fa-thumbs-up");
    likeIcon.appendChild(likeIconContent);
    likes.appendChild(likeIcon);

    postLeft.appendChild(likes);

    // Post content section
    const postContent = document.createElement("div");
    postContent.classList.add("post-content");

    const postTitle = document.createElement("a");
    postTitle.classList.add("card-title");
    postTitle.textContent = post.title;
    postContent.appendChild(postTitle);

    const postDescription = document.createElement("a");
    postDescription.classList.add("card-text");
    postDescription.textContent = post.description;
    postContent.appendChild(postDescription);

    postLeft.appendChild(postContent);

    // Post topics section
    // Getting topic name from topic id
    const topicResponse = await fetch(`/communityforum/topics/${post.topicId}`);
    const topicData = await topicResponse.json();

    const postTopicContainer = document.createElement("div");
    postTopicContainer.classList.add("d-flex", "flex-row");
    const postTopic = document.createElement("div");
    postTopic.classList.add("post-topic");
    const topicName = topicData.topic; // Replace with logic to get topic name
    postTopic.textContent = topicName;
    postTopicContainer.appendChild(postTopic);
    postContent.appendChild(postTopicContainer);

    postLeft.appendChild(postContent);
    postBody.appendChild(postLeft);

    // Post right section
    const postRight = document.createElement("div");
    postRight.classList.add("d-flex", "flex-row", "align-content-start", "justify-content-start");

    const postRightDetails = document.createElement("div");
    postRightDetails.classList.add("post-right", "d-flex", "flex-column", "align-content-end", "text-end", "mx-3");

    const postDateAuthorContainer = document.createElement("div");
    postDateAuthorContainer.classList.add("mb-4");

    const postDate = document.createElement("p");
    postDate.classList.add("post-date");
    postDate.textContent = formatDate(post.dateCreated); // Format date 
    postDateAuthorContainer.appendChild(postDate);

    // Getting user name from the user id
    const userResponse = await fetch(`/users/${post.userId}`);
    const userData = await userResponse.json();

    const postAuthor = document.createElement("a");
    postAuthor.classList.add("post-author");
    postAuthor.textContent = `@${userData.username}`;
    postDateAuthorContainer.appendChild(postAuthor);

    postRightDetails.appendChild(postDateAuthorContainer);

    // Comments section
    const commentsSection = document.createElement("div");
    commentsSection.classList.add("d-flex", "flex-row", "justify-content-end");

    const commentIcon = document.createElement("i");
    commentIcon.classList.add("post-comment-icon", "mx-2", "fa", "fa-comment-o");
    commentsSection.appendChild(commentIcon);

    const postComments = document.createElement("p");
    postComments.classList.add("post-comments");
    postComments.textContent = post.comments;
    commentsSection.appendChild(postComments);

    postRightDetails.appendChild(commentsSection);

    const postOptions = document.createElement("div");
    postOptions.classList.add("d-flex", "flex-row", "align-content-end", "mx-2");

    const postEllipsis = document.createElement("a");
    postEllipsis.classList.add("post-ellipsis");
    const postEllipsisIcon = document.createElement("i");
    postEllipsisIcon.classList.add("fa", "fa-ellipsis-v");
    postEllipsis.appendChild(postEllipsisIcon);

    const reportOption = document.createElement("a");
    reportOption.textContent = "Report";
    reportOption.classList.add("dropdown-item");

    // Create the report container
    const reportContainer = document.createElement("div");
    reportContainer.id = "report-container";
    reportContainer.className = "w-25 justify-content-center mx-3 my-4 flex-column";

    // Create the report content
    const reportContent = document.createElement("div");
    reportContent.className = "report-content d-flex flex-column";
    reportContainer.appendChild(reportContent);

    // Create the header with title and close icon
    const header = document.createElement("div");
    header.className = "d-flex flex-row justify-content-between mb-4";
    reportContent.appendChild(header);

    const title = document.createElement("h4");
    title.textContent = "Report Post";
    header.appendChild(title);

    const closeIconContainer = document.createElement("div");
    closeIconContainer.className = "d-flex flex-row justify-content-end";
    header.appendChild(closeIconContainer);

    const closeIcon = document.createElement("a");
    closeIcon.className = "close-icon";
    closeIcon.href = "#";
    closeIcon.innerHTML = "<i class='fa fa-times'></i>";
    closeIconContainer.appendChild(closeIcon);

    // Create the textarea for report reason
    const reportReasonInput = document.createElement("textarea");
    reportReasonInput.id = "report-reason";
    reportReasonInput.className = "w-100";
    reportReasonInput.rows = 3;
    reportReasonInput.placeholder = "Enter report reason...";
    reportContent.appendChild(reportReasonInput);

    // Create the submit button
    const submitButtonContainer = document.createElement("div");
    submitButtonContainer.className = "d-flex flex-row justify-content-end mt-3";
    reportContent.appendChild(submitButtonContainer);

    const submitButton = document.createElement("button");
    submitButton.id = "report-submit";
    submitButton.className = "btn";
    submitButton.textContent = "Submit";
    submitButtonContainer.appendChild(submitButton);

    // Hide the report container
    reportContainer.style.display = "none";

    // Add the report container to the page
    postOptions.appendChild(reportContainer);

    const dropdownMenu = document.createElement("div");
    dropdownMenu.classList.add("dropdown-menu", "show");
    dropdownMenu.style.display = "none";

    dropdownMenu.appendChild(reportOption);

    postEllipsis.appendChild(dropdownMenu);

    postOptions.appendChild(postEllipsis);

    postRight.appendChild(postRightDetails);
    postRight.appendChild(postOptions);

    postBody.appendChild(postRight);

    postItem.appendChild(postBody);
    postList.appendChild(postItem);
    
    // Event listener for the ellipsis and report
    let reportOptionVisible = false;
    let postEllipsisVisible = false;

    postEllipsis.addEventListener("click", function() {
        if (postEllipsisVisible) {
            postEllipsisVisible = false;
            dropdownMenu.style.display = "none";
        }
        else {
            postEllipsisVisible = true;
            dropdownMenu.style.display = "block";
        }
    });
    
    // Add event listener to close icon
    closeIcon.addEventListener("click", function() {
        reportContainer.style.display = "none";
    });
    
    // Add event listener to submit button
    submitButton.addEventListener("click", function() {
        const reportReason = reportReasonInput.value;
        if (reportReason === "") {
            alert("Please enter a reason for reporting the post.");
            return;
        }
        alert("Post has been reported! Our staff will review it shortly.");
        reportContainer.style.display = "none";
    });

    reportOption.addEventListener("click", function() {
        if (reportOptionVisible) {
            reportOptionVisible = false;
            reportContainer.style.display = "none";
        }
        else {
            reportOptionVisible = true;  
            reportContainer.style.display = "flex";
        }
    });

}

// Function to format the date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' }; // Format to November 11, 2021 etc.
    return date.toLocaleDateString('en-US', options);
}

// Function to fetch the post data from the server
async function fetchPosts() {
    const postResponse = await fetch("/communityforum"); 
    const postData = await postResponse.json();
  
    const postList = document.getElementById("forum-posts");

    postData.forEach((post) => {
        formatPost(post, postList); // Call the function to format the post data and display it on the page for each post
    });
}

// Function to fetch the forum stats from the server
async function fetchForumStats() {
    const postCountResponse = await fetch("/communityforum/post-count"); 
    const postCountData = await postCountResponse.json();

    const topicCountResponse = await fetch("/communityforum/topic-count"); 
    const topicCountData = await topicCountResponse.json();

    const likesCountResponse = await fetch("/communityforum/likes-count");
    const likesCountData = await likesCountResponse.json();

    // Display the stats on the page
    const postStats = document.getElementById("posts-stats");
    const topicStats = document.getElementById("topics-stats");
    const likesStats = document.getElementById("likes-stats");

    postStats.innerText = postCountData.postCount;
    topicStats.innerText = topicCountData.topicCount;
    likesStats.innerText = likesCountData.totalLikes;
}

// Function to search for posts
async function searchPosts(){
    const search = document.getElementById("search").value;
    const response = await fetch(`/communityforum/search?searchTerm=${search}`);
    const data = await response.json();
    const postList = document.getElementById("forum-posts");
    postList.innerHTML = ""; // Clear the existing posts

    if (data.length === 0) {
        alert("No posts found!"); // Alert the user if no posts were found
    } else {
        data.forEach((post) => {
            formatPost(post, postList); // Call the function to format the post data and display it on the page for each post
        });
    }
}

// Listener for when the search bar input is entered by user
const searchInput = document.getElementById("search");

searchInput.addEventListener("keypress", function(event) { // When the user clicks on enter on their keyboard
    if (event.key === "Enter") {
        searchPosts();
    }
});


// Function to sort posts by date from newest to oldest 
async function sortPostsByNewest(){
    const response = await fetch("/communityforum/sort-by-newest");
    const data = await response.json();
    const postList = document.getElementById("forum-posts");
    postList.innerHTML = ""; // Clear the existing posts

    data.forEach((post) => {
        formatPost(post, postList); // Call the function to format the post data and display it on the page for each post
    });
}

// Function to sort posts by date from oldest to newest
async function sortPostsByOldest(){
    const response = await fetch("/communityforum/sort-by-oldest");
    const data = await response.json();
    const postList = document.getElementById("forum-posts");
    postList.innerHTML = ""; // Clear the existing posts

    data.forEach((post) => {
        formatPost(post, postList); // Call the function to format the post data and display it on the page for each post
    });
}

// Function to sort posts by likes in descending order
async function sortPostsByLikesDesc(){
    const response = await fetch("/communityforum/sort-by-likes-desc");
    const data = await response.json();
    const postList = document.getElementById("forum-posts");
    postList.innerHTML = ""; // Clear the existing posts

    data.forEach((post) => {
        formatPost(post, postList); // Call the function to format the post data and display it on the page for each post
    });
}

// Function to sort posts by likes in ascending order
async function sortPostsByLikesAsc(){
    const response = await fetch("/communityforum/sort-by-likes-asc");
    const data = await response.json();
    const postList = document.getElementById("forum-posts");
    postList.innerHTML = ""; // Clear the existing posts

    data.forEach((post) => {
        formatPost(post, postList); // Call the function to format the post data and display it on the page for each post
    });
}

// Function to sort post by topic
async function sortPostsByTopic(topicId){ 
    const response = await fetch(`/communityforum/posts-by-topic/${topicId}`);
    const data = await response.json();
    const postList = document.getElementById("forum-posts");
    postList.innerHTML = ""; // Clear the existing posts
    console.log(data);

    if (data.error) {
        alert("No posts found!"); // Alert the user if no posts were found
    } else {
        data.forEach((post) => {
            formatPost(post, postList); // Call the function to format the post data and display it on the page for each post
        });
    }
}

// Populate drop down options for post topics and add event listeners for the topics
async function populateTopicsDropdown(){
    const response = await fetch("/communityforum/topics"); 
    const data = await response.json();

    const topicList = document.getElementById("topic-dropdown");
    const topicDropdownButton = document.getElementById("topic-dropdown-button");

    data.forEach((topic) => {
        //Create the topic option
        const topicOptionContainer = document.createElement("li");
        const topicOption = document.createElement("a");
        topicOption.classList.add("dropdown-item");
        topicOption.dataset.topicId = topic.topicId;
        topicOption.textContent = topic.topic;

        //Append the option to the topic list
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

        if (selectedTopic === "All Topics") {
            fetchPosts();
        } else{
            sortPostsByTopic(topicId);
        }
      });
    });
}
 

// Event listeners for sort by dropdowns
const sortByDropdownButton = document.getElementById("sort-by-dropdown-button");
const sortByDropdownItems = document.querySelectorAll("#sort-by-dropdown li a");

sortByDropdownItems.forEach((item) => {
  item.addEventListener("click", function(event) {
    const selectedValue = event.target.getAttribute("value");
    const selectedText = event.target.textContent;

    sortByDropdownButton.textContent = selectedText;

    if (selectedValue === "newest") {
      sortPostsByNewest();
    } else if (selectedValue === "oldest") {
      sortPostsByOldest();
    } else if (selectedValue === "likes-desc") {
      sortPostsByLikesDesc();
    } else if (selectedValue === "likes-asc") {
      sortPostsByLikesAsc();
    }
  });
});

// When the page loads, fetch the post data and display it
document.addEventListener("DOMContentLoaded", function () {
    fetchPosts(); // Call the function to fetch and display book data
    fetchForumStats(); // Call the function to fetch and display post count
    populateTopicsDropdown();
});