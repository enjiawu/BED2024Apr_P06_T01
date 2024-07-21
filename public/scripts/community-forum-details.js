// Function to get query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

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

// Function to format the date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' }; // Format to November 11, 2021 etc.
    return date.toLocaleDateString('en-US', options);
}

// Function to fetch post details
async function fetchPostDetails(postId) {
    try {
        const response = await fetch(`/communityforum/${postId}`);
        const post = await response.json();
        console.log(post);
        displayPostDetails(post);
    } catch (error) {
        console.error('Failed to fetch post details:', error);
        alert('Failed to fetch post details.');
    }
}

// Function to display post details
async function displayPostDetails(post) {
    const postTitle = document.getElementById('post-title');
    const postDescription = document.getElementById('post-description');
    const postAuthor = document.getElementById('post-author');
    const postDate = document.getElementById('post-date');
    const postLikes = document.getElementById('post-likes');
    const postComments = document.getElementById('post-comments');
    const postTopic = document.getElementById('post-topic');

    postTitle.textContent = post.title;
    postDescription.textContent = post.description;
    postDate.textContent = formatDate(post.dateCreated);
    postLikes.textContent = post.likes;
    postComments.textContent = post.comments;

    // Getting topic name from topic id
    const topicResponse = await fetch(`/communityforum/topics/${post.topicId}`);
    const topicData = await topicResponse.json();
    postTopic.textContent = topicData.topic;

    // Getting username from user id
    const authorResponse = await fetch(`/users/profile/${post.userId}`);
    const authorData = await authorResponse.json();
    postAuthor.textContent = "@" + authorData.username;

    // Like listener
    const likeIcon = document.getElementById('like-icon');
    let isLiked = false;
    try{
        const isLikedResponse = await fetch(`/communityforum/${post.postId}/get-like-by-user/${userId}`); // Check if user has already liked the post
        isLiked = await isLikedResponse.json();
    }
    catch{
        isLiked = false;
    }
    likeIcon.classList.add(isLiked ? "like-true" : "like-false");
    likeIcon.addEventListener("click", async () => {
        try {
            // Check for like/unlike
            const response = await fetch(`/communityforum/${post.postId}/modify-like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: userId })
            });
    
            const responseData = await response.json();
            if (responseData.success) {
                postLikes.textContent = responseData.likes;
                if (responseData.status === 'liked') {
                    likeIcon.classList.remove("like-false");
                    likeIcon.classList.add("like-true");
                } else if (responseData.status === 'unliked') {
                    likeIcon.classList.remove("like-true");
                    likeIcon.classList.add("like-false");
                }
            } else {
                console.error(responseData.error);
            }
        } catch (error) {
            console.error(error);
            alert("You need to be logged in to like a post!");
        }
    });

    // Report dropdown
    const postEllipsis = document.getElementById('post-ellipsis');
    const reportOption = document.createElement("a");
    reportOption.textContent = "Report";
    reportOption.classList.add("dropdown-item");

    // Create the dropdown menu
    const dropdownMenu = document.createElement("div");
    dropdownMenu.classList.add("dropdown-menu", "show");
    dropdownMenu.style.display = "none";
    dropdownMenu.appendChild(reportOption);
    postEllipsis.appendChild(dropdownMenu);

    // Event listener for the ellipsis and report
    let reportOptionVisible = false;
    let postEllipsisVisible = false;

    postEllipsis.addEventListener("click", function() {
        if (postEllipsisVisible) {
            postEllipsisVisible = false;
            dropdownMenu.style.display = "none";
        } else {
            postEllipsisVisible = true;
            dropdownMenu.style.display = "block";
        }
    });

    // Add event listener to close icon
    const closeIcon = document.querySelector(".close-icon");
    const reportContainer = document.getElementById("report-container");
    closeIcon.addEventListener("click", function() {
        reportContainer.style.display = "none";
    });

    // Add event listener to submit button
    const submitButton = document.getElementById("report-submit");
    submitButton.addEventListener("click", function() {
        const reportReason = document.getElementById("report-reason").value;
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
        } else {
            reportOptionVisible = true;
            reportContainer.style.display = "flex";
        }
    });

    // Edit button in the dropdown menu if post is created by the user
    try{
        if(post.userId === userId) {
        const editButton = document.createElement("a");
        editButton.classList.add("dropdown-item");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            // Redirect to the edit post page with the post ID
            window.location.href = `community-forum-edit-post.html?id=${post.postId}`;
        });

        const deleteButton = document.createElement("a");
        deleteButton.classList.add("dropdown-item");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", async function () {
            // Confirm deletion
            const confirmDelete = confirm("Are you sure you want to delete this post?");
            if (!confirmDelete) {
                return;
            }

            // Allow user to delete the comment
            try {
                const response = await fetch(`/communityforum/${post.postId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const success = await response.json();
                if (success) {
                    alert("Post successfully deleted!");
                    window.location.href = "community-forum.html";
                } else {
                    throw new Error("Failed to delete post.");
                }
            } catch (error) {
                console.error(error);
                alert("Failed to delete post.");
            }
        });

        dropdownMenu.appendChild(editButton);
        dropdownMenu.appendChild(deleteButton);
        }
    }
    catch(error){
        // Do nothing
    };

    // Display comments
    displayComments(post.postId);
}

// Function to display comments
async function displayComments(postId) {
    const commentsContainer = document.getElementById('comments-container');
    //commentsContainer.innerHTML = ''; // Clear existing comments

    //Fetch comments
    const commentsResponse = await fetch(`/communityforum/${postId}/comments`);
    const comments = await commentsResponse.json();

    console.log(comments);

    // Iterate through comments and display them
    comments.forEach(async (comment) => {
        // Getting username from user id
        const authorResponse = await fetch(`/users/profile/${comment.userId}`); 
        const authorData = await authorResponse.json();

        const commentElement = document.createElement('div');
        commentElement.classList.add('comment', 'card', 'mb-2');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'd-flex', 'align-items-center', 'py-0', "m-1");

        const likesContainer = document.createElement('div');
        likesContainer.classList.add('d-flex', 'flex-row', 'mx-2', 'gap-2', 'px-3');

        const likes = document.createElement('p');
        likes.classList.add('comment-number-of-likes');
        likes.textContent = comment.likes;
        likesContainer.appendChild(likes);

        const likeIcon = document.createElement('a');
        let isLiked = false;
        try{
            const isLikedResponse = await fetch(`/communityforum/comments/${comment.commentId}/get-like-by-user/${userId}`); // Check if user has already liked the post
            isLiked = await isLikedResponse.json();
            console.log(isLiked);
        }
        catch{
            isLiked = false;
        }
        likeIcon.classList.add('comments-like-icon', isLiked ? "like-true" : "like-false");
        const likeIconI = document.createElement('i');
        likeIconI.classList.add('fa', 'fa-thumbs-up');
        likeIcon.appendChild(likeIconI);
        likesContainer.appendChild(likeIcon);

        // Like listener
        likeIcon.addEventListener("click", async () => {
            try {
                // Check for like/unlike
                const response = await fetch(`/communityforum/comments/${comment.commentId}/modify-like`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userId: userId })
                });
        
                const responseData = await response.json();
                if (responseData.success) {
                    likes.textContent = responseData.likes;
                    if (responseData.status === 'liked') {
                        likeIcon.classList.remove("like-false");
                        likeIcon.classList.add("like-true");
                    } else if (responseData.status === 'unliked') {
                        likeIcon.classList.remove("like-true");
                        likeIcon.classList.add("like-false");
                    }
                } else {
                    console.error(responseData.error);
                }
            } catch (error) {
                console.error(error);
                alert("You need to be logged in to like a post!");
            }
        });

        cardBody.appendChild(likesContainer);

        const commentInfoContainer = document.createElement('div');
        commentInfoContainer.classList.add('mx-2', 'flex-grow-1');

        const commentInfo = document.createElement('div');
        commentInfo.classList.add('d-flex', 'flex-row', 'justify-content-between', 'align-content-between');

        const authorContainer = document.createElement('div');
        authorContainer.classList.add('d-flex', 'flex-row', 'align-content-between', 'justify-content-between', 'mx-3', 'mt-2', 'mb-1', 'flex-grow-1');

        const author = document.createElement('p');
        author.classList.add('comment-author');
        author.textContent = `@${authorData.username}`;
        authorContainer.appendChild(author);

        const dateAndEllipsisContainer = document.createElement('div');
        dateAndEllipsisContainer.classList.add('d-flex', 'flex-row', 'align-content-end', 'mx-2', 'gap-4');

        const date = document.createElement('p');
        date.classList.add('comment-date');
        date.textContent = formatDate(comment.dateCreated);
        dateAndEllipsisContainer.appendChild(date);

        const ellipsis = document.createElement('a');
        ellipsis.classList.add('comment-ellipsis');
        const ellipsisI = document.createElement('i');
        ellipsisI.classList.add('fa', 'fa-ellipsis-v');
        ellipsis.appendChild(ellipsisI);
        dateAndEllipsisContainer.appendChild(ellipsis);

        authorContainer.appendChild(dateAndEllipsisContainer);

        commentInfo.appendChild(authorContainer);

        const commentText = document.createElement('p');
        commentText.classList.add('comment-text', 'mx-3');
        commentText.textContent = comment.description;  

        commentInfoContainer.appendChild(commentInfo);
        commentInfoContainer.appendChild(commentText);

        cardBody.appendChild(commentInfoContainer);

        // Create dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown-menu', 'show');
        dropdownMenu.style.display = 'none';

        const reportOption = document.createElement('a');
        reportOption.textContent = 'Report';
        reportOption.classList.add('dropdown-item');
        reportOption.addEventListener('click', function() {
            // Show report container
            const reportContainer = document.getElementById('report-container');
            reportContainer.style.display = 'flex';

            // Close listeners
            const closeReport = document.getElementById("close-report");
            closeReport.addEventListener("click", function() {
                reportContainer.style.display = "none";
            });
        });
        dropdownMenu.appendChild(reportOption);

        try{
            // Edit button in the dropdown menu if post is created by the user
            if (comment.userId === userId) {
                const editButton = document.createElement("a");
                editButton.classList.add("dropdown-item");
                editButton.textContent = "Edit";

                editButton.addEventListener("click", function () {
                    // Allow user to edit the comment
                    // Show reply container
                    const replyContainer = document.getElementById('reply-container');
                    replyContainer.style.display = 'flex';

                    // Set the text of the reply input
                    const replyInput = document.getElementById('reply-input');
                    replyInput.value = comment.description;

                    // Set the text of the reply input to "Replying to @username"
                    const replyingTo = document.getElementById('replying-to');
                    replyingTo.textContent = `Editing comment`;

                    // Close listener
                    const closeReply = document.getElementById("close-reply");
                    closeReply.addEventListener("click", function() {
                        const confirmDiscard = confirm("Are you sure you want to discard your changes?");
                        if (confirmDiscard) {
                            replyContainer.style.display = "none";
                        }
                    });

                    // Confirm listener
                    const replySubmit = document.getElementById("reply-submit");
                    replySubmit.addEventListener("click", async function() {
                        const replyInput = document.getElementById('reply-input').value;
                        if (replyInput === "") {
                            alert("Please enter a reply.");
                            return;
                        }

                        // Update the comment
                        try {
                            const response = await fetch(`/communityforum/comments/${comment.commentId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ description: replyInput, userId: userId })
                            });

                            const responseData = await response.json();
                            console.log(responseData);
                            if (responseData) {
                                alert("Comment updated successfully!");
                                window.location.reload();
                            } else {
                                throw new Error("Failed to update comment.");
                            }
                        } catch (error) {
                            console.error(error);
                            alert("Failed to update comment.");
                        }
                    });

                });

                const deleteButton = document.createElement("a");
                deleteButton.classList.add("dropdown-item");
                deleteButton.textContent = "Delete";

                deleteButton.addEventListener("click", async function () {
                    // Confirm deletion
                    const confirmDelete = confirm("Are you sure you want to delete this comment?");
                    if (!confirmDelete) {
                        return;
                    }

                    // Allow user to delete the comment
                    try {
                        const response = await fetch(`/communityforum/comments/${comment.commentId}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        const success = await response.json();
                        if (success) {
                            alert("Comment successfully deleted!");
                            window.location.reload();
                        } else {
                            throw new Error("Failed to delete comment.");
                        }
                    } catch (error) {
                        console.error(error);
                        alert("Failed to delete comment.");
                    }
                });

                dropdownMenu.appendChild(editButton);
                dropdownMenu.appendChild(deleteButton);
            }

        } catch (error) {
            // Do nothing
        }

        const replyOption = document.createElement('a');
        replyOption.textContent = 'Reply';
        replyOption.classList.add('dropdown-item');
        replyOption.addEventListener('click', function() {
            // Show reply container
            const replyContainer = document.getElementById('reply-container');
            replyContainer.style.display = 'flex';
        
            // Set the text of the reply input to "Replying to @username"
            const replyingTo = document.getElementById('replying-to');
            replyingTo.textContent = `Replying to @${authorData.username}`;

            // Close listener
            const closeReply = document.getElementById("close-reply");
            closeReply.addEventListener("click", function() {
                replyContainer.style.display = "none";
            });

            // Confirm listener
            const replySubmit = document.getElementById("reply-submit");

            replySubmit.addEventListener("click", async function() {
                const replyInput = document.getElementById('reply-input').value;
                if (replyInput === "") {
                    alert("Please enter a reply.");
                    return;
                }

                // Add the reply to the comment
                try {
                    const response = await fetch(`/communityforum/${postId}/comments/${comment.commentId}/reply`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ description: replyInput, userId: userId })
                    });

                    const responseData = await response.json();
                    console.log(responseData);
                    if (responseData) {
                        alert("Reply posted successfully!");
                        window.location.reload();
                    } else {
                        throw new Error("Failed to post reply.");
                    }
                } catch (error) {
                    console.error(error);
                    alert("Failed to post reply.");
                }
            });
        });
        dropdownMenu.appendChild(replyOption);

        

        // Add dropdown menu to comment ellipsis
        const commentEllipsis = ellipsis;
        commentEllipsis.appendChild(dropdownMenu);

        // Add event listener to comment ellipsis
        commentEllipsis.addEventListener("click", function() {
            const dropdownMenu = ellipsis.querySelector('.dropdown-menu');
            if (dropdownMenu.style.display === "none") {
                dropdownMenu.style.display = "block";
            } else {
                dropdownMenu.style.display = "none";
            }
        });

        commentElement.appendChild(cardBody);

        commentsContainer.appendChild(commentElement);

        // Fetch replies
        const repliesResponse = await fetch(`/communityforum/comments/${comment.commentId}/replies`);
        const replies = await repliesResponse.json();

        if (replies.length > 0) {
            const repliesContainer = document.createElement('div');
            repliesContainer.classList.add('replies-container', 'flex-column', 'align-items-center');

            const seeMore = document.createElement('a');
            seeMore.style.display = 'block';
            seeMore.classList.add('comment-see-more', 'mx-3');
            seeMore.textContent = 'See Replies';
            seeMore.addEventListener('click', async () => {
                if (repliesContainer.style.display === "none") {
                    repliesContainer.style.display = "flex";
                    seeMore.textContent = 'Hide Replies';
                } else {
                    repliesContainer.style.display = "none";
                    seeMore.textContent = 'See Replies';
                }
            });

            commentsContainer.appendChild(repliesContainer);

            replies.forEach(async (reply) => {
            
                // Getting username from user id
                const replyAuthorResponse = await fetch(`/users/profile/${reply.userId}`);
                const replyAuthorData = await replyAuthorResponse.json();
            
                const replyElement = document.createElement('div');
                replyElement.className = 'reply card mb-2';
            
                const replyCardBody = document.createElement('div');
                replyCardBody.className = 'card-body d-flex align-items-center py-0';
            
                const replyLikesContainer = document.createElement('div');
                replyLikesContainer.className = 'd-flex flex-row mx-2 gap-2 pt-3';
            
                const replyLikes = document.createElement('p');
                replyLikes.className = 'reply-number-of-likes';
                replyLikes.textContent = reply.likes;
                replyLikesContainer.appendChild(replyLikes);
            
                const replyLikeIcon = document.createElement('a');
                try{
                    const isLikedResponse = await fetch(`/communityforum/comments/${reply.commentId}/get-like-by-user/${userId}`); // Check if user has already liked the post
                    isLiked = await isLikedResponse.json();
                }
                catch{
                    isLiked = false;
                }
                replyLikeIcon.classList.add('comments-like-icon', isLiked ? "like-true" : "like-false");
                const replyLikeIconI = document.createElement('i');
                replyLikeIconI.className = 'fa fa-thumbs-up';
                replyLikeIcon.appendChild(replyLikeIconI);
                replyLikesContainer.appendChild(replyLikeIcon);

                // Like listener
                replyLikeIcon.addEventListener("click", async () => {
                    try {
                        // Check for like/unlike
                        const response = await fetch(`/communityforum/comments/${reply.commentId}/modify-like`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ userId: userId })
                        });
                
                        const responseData = await response.json();
                        if (responseData.success) {
                            replyLikes.textContent = responseData.likes;
                            if (responseData.status === 'liked') {
                                replyLikeIcon.classList.remove("like-false");
                                replyLikeIcon.classList.add("like-true");
                            } else if (responseData.status === 'unliked') {
                                replyLikeIcon.classList.remove("like-true");
                                replyLikeIcon.classList.add("like-false");
                            }
                        } else {
                            console.error(responseData.error);
                        }
                    } catch (error) {
                        console.error(error);
                        alert("You need to be logged in to like a post!");
                    }
                });
            
                replyCardBody.appendChild(replyLikesContainer);

                const replyInfoContainer = document.createElement('div');
                replyInfoContainer.className = 'mx-2 flex-grow-1';
            
                const replyAuthorInfoContainer = document.createElement('div');
                replyAuthorInfoContainer.className = 'd-flex flex-row justify-content-between align-content-between';
            
                const replyAuthorDetailsContainer = document.createElement('div');
                replyAuthorDetailsContainer.className = 'd-flex flex-row align-content-between justify-content-between mx-3 mt-2 flex-grow-1';
            
                const replyAuthor = document.createElement('p');
                replyAuthor.className = 'reply-author';
                replyAuthor.textContent = `@${replyAuthorData.username}`;
                replyAuthorDetailsContainer.appendChild(replyAuthor);
            
                const replyDateAndEllipsisContainer = document.createElement('div');
                replyDateAndEllipsisContainer.className = 'd-flex flex-row align-content-end gap-4';
            
                const replyDate = document.createElement('p');
                replyDate.className = 'reply-date';
                replyDate.textContent = formatDate(reply.dateCreated);
                replyDateAndEllipsisContainer.appendChild(replyDate);
            
                const replyEllipsis = document.createElement('a');
                replyEllipsis.className = 'reply-ellipsis';
                const replyEllipsisI = document.createElement('i');
                replyEllipsisI.className = 'fa fa-ellipsis-v';
                replyEllipsis.appendChild(replyEllipsisI);
                replyDateAndEllipsisContainer.appendChild(replyEllipsis);

                // Report dropdown
                const reportOption = document.createElement("a");
                reportOption.textContent = "Report";
                reportOption.classList.add("dropdown-item");

                // Create the dropdown menu
                const dropdownMenu = document.createElement("div");
                dropdownMenu.classList.add("dropdown-menu", "show");
                dropdownMenu.style.display = "none";
                dropdownMenu.appendChild(reportOption);
                replyEllipsis.appendChild(dropdownMenu);

                // Event listener for the ellipsis and report
                let reportOptionVisible = false;
                let replyEllipsisVisible = false;

                replyEllipsis.addEventListener("click", function() {
                    if (replyEllipsisVisible) {
                        replyEllipsisVisible = false;
                        dropdownMenu.style.display = "none";
                    } else {
                        replyEllipsisVisible = true;
                        dropdownMenu.style.display = "block";
                    }
                });

                // Add event listener to close icon
                const reportContainer = document.getElementById("report-container");
                reportOption.addEventListener('click', function() {
                    // Show report container
                    const reportContainer = document.getElementById('report-container');
                    reportContainer.style.display = 'flex';
        
                    // Close listeners
                    const closeReport = document.getElementById("close-report");
                    closeReport.addEventListener("click", function() {
                        reportContainer.style.display = "none";
                    });
                });
                dropdownMenu.appendChild(reportOption);

                // Add event listener to submit button
                const submitButton = document.getElementById("report-submit");
                submitButton.addEventListener("click", function() {
                    const reportReason = document.getElementById("report-reason").value;
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
                    } else {
                        reportOptionVisible = true;
                        reportContainer.style.display = "flex";
                    }
                });
            
                replyAuthorDetailsContainer.appendChild(replyDateAndEllipsisContainer);
                replyAuthorInfoContainer.appendChild(replyAuthorDetailsContainer);
                replyInfoContainer.appendChild(replyAuthorInfoContainer);
            
                const replyText = document.createElement('p');
                replyText.className = 'reply-text mx-3';
                replyText.textContent = reply.description;
                replyInfoContainer.appendChild(replyText);
            
                replyCardBody.appendChild(replyInfoContainer);
                replyElement.appendChild(replyCardBody);
            
                repliesContainer.appendChild(replyElement);

                try{
                    // Edit button in the dropdown menu if post is created by the user
                    if (reply.userId === userId) {
                        const editButton = document.createElement("a");
                        editButton.classList.add("dropdown-item");
                        editButton.textContent = "Edit";
        
                        editButton.addEventListener("click", function () {
                            // Allow user to edit the comment
                            // Show reply container
                            const replyContainer = document.getElementById('reply-container');
                            replyContainer.style.display = 'flex';
        
                            // Set the text of the reply input
                            const replyInput = document.getElementById('reply-input');
                            replyInput.value = reply.description;
        
                            // Set the text of the reply input to "Replying to @username"
                            const replyingTo = document.getElementById('replying-to');
                            replyingTo.textContent = `Editing comment`;
        
                            // Close listener
                            const closeReply = document.getElementById("close-reply");
                            closeReply.addEventListener("click", function() {
                                const confirmDiscard = confirm("Are you sure you want to discard your changes?");
                                if (confirmDiscard) {
                                    replyContainer.style.display = "none";
                                }
                            });
        
                            // Confirm listener
                            const replySubmit = document.getElementById("reply-submit");
                            replySubmit.addEventListener("click", async function() {
                                const replyInput = document.getElementById('reply-input').value;
                                if (replyInput === "") {
                                    alert("Please enter a reply.");
                                    return;
                                }
        
                                // Update the comment
                                try {
                                    const response = await fetch(`/communityforum/comments/${reply.commentId}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ description: replyInput, userId: userId })
                                    });
        
                                    const responseData = await response.json();
                                    console.log(responseData);
                                    if (responseData) {
                                        alert("Comment updated successfully!");
                                        window.location.reload();
                                    } else {
                                        throw new Error("Failed to update comment.");
                                    }
                                } catch (error) {
                                    console.error(error);
                                    alert("Failed to update comment.");
                                }
                            });
        
                        });
        
                        const deleteButton = document.createElement("a");
                        deleteButton.classList.add("dropdown-item");
                        deleteButton.textContent = "Delete";
        
                        deleteButton.addEventListener("click", async function () {
                            // Confirm deletion
                            const confirmDelete = confirm("Are you sure you want to delete this comment?");
                            if (!confirmDelete) {
                                return;
                            }
        
                            // Allow user to delete the comment
                            try {
                                const response = await fetch(`/communityforum/comments/${reply.commentId}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });

                                const success = await response.json();
                                if (success) {
                                    alert("Comment successfully deleted!");
                                    window.location.reload();
                                } else {
                                    throw new Error("Failed to delete comment.");
                                }
                            } catch (error) {
                                console.error(error);
                                alert("Failed to delete comment.");
                            }
                        });
        
                        dropdownMenu.appendChild(editButton);
                        dropdownMenu.appendChild(deleteButton);
                    }
        
                } catch (error) {
                    // Do nothing
                }

            });
            
            commentInfoContainer.appendChild(seeMore);
            commentElement.appendChild(repliesContainer);

            repliesContainer.style.display = 'none'; // Hide replies by default
        }

    });
}

const postCommentButton = document.getElementById('post-comment-button');
postCommentButton.addEventListener('click', async () => {
    const commentInput = document.getElementById('comment-input');
    const comment = commentInput.value;
    const postId = getQueryParam('id');

    if (comment === "") {
        alert("Please enter a comment.");
        return;
    }

    try{
        const response = await fetch(`/communityforum/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ description: comment, userId: userId })
        })
    
        const data = await response.json();
        console.log(data);
        if (data) {
            alert("Comment posted successfully!");
            window.location.reload();
        } else {
            console.error(data.error);
            alert("Failed to post comment.");
        }
    }
    catch(error){
        console.error(error);
        alert("You need to be logged in to post a comment!");
    }
});


// Fetch post details on page load if post id is correct 
document.addEventListener('DOMContentLoaded', async () => {
    getUserDataFromToken();

    console.log(userId);

    const postId = getQueryParam('id');
    if (postId) {
        await fetchPostDetails(postId);
    } else {
        alert('Post not found.');
    }
});
