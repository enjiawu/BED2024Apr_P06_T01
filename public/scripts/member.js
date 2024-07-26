document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    // Debugging: Print userData
    console.log('User Data:', userData);

    // Check if userData and userData.user are available and has userId
    if (userData) {
        const userId = userData.user.userId; // Access userId correctly
        
        // Debugging: Print userId
        console.log('User ID:', userId);
        
        // Fetch data from API
        fetch(`/communityforum/users/${userId}`)
            .then(response => response.json())
            .then(post => {
                // Debugging: Print post data
                console.log('Post Data:', post);

                // Check if post data is received
                if (post) {
                    // Update the DOM elements with the post data
                    document.getElementById('post-author').textContent = `@${post.userId}`;
                    document.getElementById('post-date').textContent = new Date(post.dateCreated).toLocaleDateString();
                    document.getElementById('post-title').textContent = post.title;
                    document.getElementById('post-description').textContent = post.description;
                    document.getElementById('post-topic').textContent = post.topicId; // Fetch topic details separately if needed
                    document.getElementById('post-likes').textContent = post.likes;
                    document.getElementById('post-comments').textContent = post.comments;
                } else {
                    console.error('Post not found');
                }
            })
            .catch(error => console.error('Error fetching post:', error));
    } else {
        console.error('No userId found in localStorage');
    }
});