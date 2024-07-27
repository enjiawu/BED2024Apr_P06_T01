document.addEventListener('DOMContentLoaded', function() {
    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userData'));

    // Debugging: Print userData
    console.log('User Data:', userData);

    if (userData) {
        const userId = userData.user.userId; // Access userId correctly

        // Debugging: Print userId
        console.log('User ID:', userId);
        
        // Fetch posts data from API
        fetch(`/communityforum/users/${userId}`)
            .then(response => response.json())
            .then(posts => {
                // Debugging: Print post data
                console.log('Post Data:', posts);

                // Check if post data is received
                if (Array.isArray(posts) && posts.length > 0) {
                    const postsContainer = document.getElementById('posts-container');
                    postsContainer.innerHTML = ''; // Clear the container

                    posts.forEach(post => {
                        const postElement = document.createElement('div');
                        postElement.className = 'card-body d-flex flex-column justify-content-between posts-container';

                        postElement.innerHTML = `
                            <div class="d-flex flex-row justify-content-between align-content-between">
                                <div class="d-flex flex-row align-content-between justify-content-between mx-3 mt-2 mb-3 flex-grow-1">
                                    <div>
                                        <h5 class="card-title">${post.title}</h5>
                                        <p class="post-date">${new Date(post.dateCreated).toLocaleDateString()}</p>
                                    </div>
                                    <div class="d-flex flex-row align-content-end mx-2 gap-4">
                                        <div class="dropdown">
                                            <a class="post-ellipsis" id="dropdownMenuButton${post.postId}" aria-haspopup="true" aria-expanded="false">
                                                <i class="fa fa-ellipsis-v"></i>
                                            </a>
                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton${post.postId}">
                                                <div class="dropdown-item" onclick="editPost(${post.postId})"><a href="../html/community-forum-edit-post.html">Edit</a></div>
                                                <div class="dropdown-item" onclick="deletePost(${post.postId})">Delete</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="post-content mb-4">
                                <div class="post-topic">${post.topicId}</div>
                                <p class="card-text">${post.description}</p>
                            </div>
                            <div class="d-flex flex-row align-items-center justify-content-between">
                                <div class="d-flex flex-row align-content-between justify-content-between mx-3 mt-2 mb-3 flex-grow-1">
                                    <div class="d-flex flex-row justify-content-end gap-2">
                                        <div class="d-flex flex-row">
                                            <a class="like-icon mx-2"><i class="fa fa-thumbs-up"></i></a>
                                            <p class="number-of-likes">${post.likes}</p>
                                        </div>
                                        <div class="d-flex flex-row">
                                            <i class="post-comment-icon mx-2 fa fa-comment-o"></i>
                                            <p class="post-comments">${post.comments}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="view-post"><a href="../html/community-forum-post.html">view post</a></div>
                                    </div>
                                </div>
                            </div>
                        `;

                        // Append the post element to the container
                        postsContainer.appendChild(postElement);

                        // Add event listener for the dropdown
                        const dropdownButton = postElement.querySelector(`#dropdownMenuButton${post.postId}`);
                        const dropdownMenu = postElement.querySelector(`.dropdown-menu`);

                        dropdownButton.addEventListener('click', function(event) {
                            event.stopPropagation();
                            closeAllDropdowns();
                            dropdownMenu.classList.toggle('show');
                        });

                        document.addEventListener('click', function() {
                            dropdownMenu.classList.remove('show');
                        });
                    });
                } else {
                    console.error('No posts found');
                }
            })
            .catch(error => console.error('Error fetching posts:', error));

            // Fetch events data from API
            fetch(`/events/${userId}/events-hosted`)
                .then(response => response.json())
                .then(events => {
                    console.log('Hosted Events:', events);
                    renderEvents(events, 'Hosted Events', 'hosted');
                })
                .catch(error => console.error('Error fetching hosted events:', error));

            

            fetch(`/events/${userId}/participated`)
                .then(response => response.json())
                .then(events => {
                    console.log('Participated Events:', events);
                    renderEvents(events, 'Participated Events', 'participated');
                })
                .catch(error => console.error('Error fetching participated events:', error));

            // Fetch and render events based on the filter
        const filterSelect = document.getElementById('events-filter');
        filterSelect.addEventListener('change', function() {
            const filterValue = this.value;
            fetchEvents(userId, filterValue);
        });
    } else {
        console.error('No userId found in localStorage');
    }
});

// Function to fetch and render events based on filter
function fetchEvents(userId, filter) {
    let hostedUrl = `/events/${userId}/events-hosted`;
    let participatedUrl = `/events/${userId}/participated`;

    if (filter === 'all') {
        Promise.all([
            fetch(hostedUrl).then(response => response.json()),
            fetch(participatedUrl).then(response => response.json())
        ])
        .then(([hostedEvents, participatedEvents]) => {
            const allEvents = [...hostedEvents, ...participatedEvents];
            renderEvents(allEvents, 'All Events');
        })
        .catch(error => console.error('Error fetching all events:', error));
    } else {
        let url = filter === 'hosted' ? hostedUrl : participatedUrl;

        fetch(url)
            .then(response => response.json())
            .then(events => {
                renderEvents(events, filter === 'hosted' ? 'Hosted Events' : 'Participated Events');
            })
            .catch(error => console.error(`Error fetching ${filter} events:`, error));
    }
}

// Function to render events
function renderEvents(events, title) {
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = ''; // Clear existing events

    const section = document.createElement('section');
    section.innerHTML = `<h2>${title}</h2>`;

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-card';
        eventElement.innerHTML = `
            <div class="event-header">
            <div class="pending-state">${event.status}</div>
            <div class="edit-button">
                <a href="../html/edit-event.html"">Edit Event</a>
            </div>
        </div>
        <div class="event-details">
            <div class="event-info-left">
                <img src="${event.imageUrl || '../images/logo/ReThink Logo - Green.png'}" class="event-image" alt="${event.title}" onerror="this.onerror=null; this.src='../images/logo/ReThink Logo - Green.png';">
                <div>Date: ${new Date(event.startDate).toLocaleDateString()}</div>
                <div>Time: ${event.startTime}</div>
                <div>Location: ${event.location}</div>
            </div>
            <div class="event-info-right">
                <h3>${event.title}</h3>
                <p>${event.description}</p>
            </div>
        </div>
        <div class="view-event">
            <a href="../html/participate-event.html">View Event</a>
        </div>

            
        `;
        section.appendChild(eventElement);
    });

    eventsContainer.appendChild(section);
}

// Add editPost and deletePost functions
function editPost(postId) {
    // Implement edit functionality here
    console.log('Edit post', postId);
}

function deletePost(postId) {
    // Implement delete functionality here
    console.log('Delete post', postId);
}

// Function to close all dropdowns
function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}