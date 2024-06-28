function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


async function fetchPosts() {
    const postResponse = await fetch("/communityforum"); 
    const postData = await postResponse.json();

    console.log(postData); // Log the data to the console
  
    const postList = document.getElementById("forum-posts");

    postData.forEach((post) => {
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
        const postTopicContainer = document.createElement("div");
        postTopicContainer.classList.add("d-flex", "flex-row");
        const postTopic = document.createElement("div");
        postTopic.classList.add("post-topic");
        const topicName = post.topicId; // Replace with logic to get topic name
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

        const postAuthor = document.createElement("a");
        postAuthor.classList.add("post-author");
        postAuthor.textContent = `@${post.userId}`;
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

        postOptions.appendChild(postEllipsis);

        postRight.appendChild(postRightDetails);
        postRight.appendChild(postOptions);

        postBody.appendChild(postRight);

        postItem.appendChild(postBody);
        postList.appendChild(postItem);
    });
}

async function fetchForumStats() {
    const postCountResponse = await fetch("/communityforum/post-count"); 
    const postCountData = await postCountResponse.json();

    const topicCountResponse = await fetch("/communityforum/topic-count"); 
    const topicCountData = await topicCountResponse.json();

    const likesCountResponse = await fetch("/communityforum/likes-count");
    const likesCountData = await likesCountResponse.json();

    console.log(postCountData); 
    console.log(topicCountData); 
    console.log(likesCountData); 
    const postStats = document.getElementById("posts-stats");
    const topicStats = document.getElementById("topics-stats");
    const likesStats = document.getElementById("likes-stats");

    postStats.innerText = postCountData.postCount;
    topicStats.innerText = topicCountData.topicCount;
    likesStats.innerText = likesCountData.totalLikes;
}

document.addEventListener("DOMContentLoaded", function () {
    fetchPosts(); // Call the function to fetch and display book data
    fetchForumStats(); // Call the function to fetch and display post count
});