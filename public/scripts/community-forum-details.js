// Function to get query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

async function fetchPostDetails(postId) {
    const response = await fetch(`/communityforum/${postId}`);
    const post = await response.json();
    console.log(post);
}

function displayPostDetails(post) {
    const postTitle = document.getElementById('post-title');
    const postContent = document.getElementById('post-content');
    const postAuthor = document.getElementById('post-author');
    const postDate = document.getElementById('post-date');

    postTitle.textContent = post.title;
    postContent.textContent = post.content;
    postAuthor.textContent = post.author;
    postDate.textContent = post.date;
}

// Function to fetch post details
document.addEventListener('DOMContentLoaded', async () => {
    const postId = getQueryParam('id');
    if (postId) {
        await fetchPostDetails(postId);
    } else {
        alert('Post not found.');
    }
});