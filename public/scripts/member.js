document.addEventListener('DOMContentLoaded', function () {
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
            .then(async posts => {
                // Debugging: Print post data
                console.log('Post Data:', posts);

                // Check if post data is received
                if (Array.isArray(posts) && posts.length > 0) {
                    const postsContainer = document.getElementById('posts-container');
                    postsContainer.innerHTML = ''; // Clear the container

                    for (const post of posts) {
                        const postElement = await createPostElement(post);
                        postsContainer.appendChild(postElement);
                    }
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
                events.forEach(event => event.type = 'hosted'); // Mark events as hosted
                renderEvents(events, 'Hosted Events', 'hosted');
            })
            .catch(error => console.error('Error fetching hosted events:', error));

        fetch(`/events/${userId}/participated`)
            .then(response => response.json())
            .then(events => {
                console.log('Participated Events:', events);
                events.forEach(event => event.type = 'participated'); // Mark events as participated
                renderEvents(events, 'Participated Events', 'participated');
            })
            .catch(error => console.error('Error fetching participated events:', error));

        // Fetch and render events based on the filter
        const filterSelect = document.getElementById('events-filter');
        filterSelect.addEventListener('change', function () {
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
                hostedEvents.forEach(event => event.type = 'hosted'); // Mark events as hosted
                participatedEvents.forEach(event => event.type = 'participated'); // Mark events as participated
                const allEvents = [...hostedEvents, ...participatedEvents];
                renderEvents(allEvents, 'All Events');
            })
            .catch(error => console.error('Error fetching all events:', error));
    } else {
        let url = filter === 'hosted' ? hostedUrl : participatedUrl;

        fetch(url)
            .then(response => response.json())
            .then(events => {
                events.forEach(event => event.type = filter); // Mark events with filter type
                renderEvents(events, filter === 'hosted' ? 'Hosted Events' : 'Participated Events', filter);
            })
            .catch(error => console.error(`Error fetching ${filter} events:`, error));
    }
}

// Function to render events
function renderEvents(events, title, filter) {
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = ''; // Clear existing events

    const section = document.createElement('section');
    section.innerHTML = `<h2 class="change-size">${title}</h2>`;

    events.forEach(event => {
        const eventElement = document.createElement('div');
        eventElement.className = 'event-card';
        eventElement.innerHTML = `
            <div class="event-header">
                <div class="pending-state ${event.status === 'denied' ? 'denied-state' : ''}">${event.status}</div>
                <div class="edit-button">
                    ${event.type === 'hosted' ? `<a href="../html/edit-event.html?id=${event.eventId}">Edit Event</a>` : `<a href="#" onclick="confirmQuitEvent(${event.eventId})">Quit The Event</a>`}
                </div>
            </div>
            <div class="event-details">
                <div class="event-info-left">
                    <img src="${event.imageUrl || '../images/logo/ReThink Logo - Green.png'}" class="event-image" alt="${event.title}" onerror="this.onerror=null; this.src='../images/logo/ReThink Logo - Green.png';">
                    <div><strong>Date:</strong> ${new Date(event.startDate).toLocaleDateString()}</div>
                    <div><strong>Time:</strong> ${formatTime(event.startTime)}</div>
                    <div><strong>Location:</strong> ${event.location}</div>
                </div>
                <div class="event-info-right">
                    <h3 class="event-title">${event.title}</h3>
                    <p>${event.description}</p>
                </div>
            </div>
            <div class="view-event">
                <a href="../html/participate-event.html?id=${event.eventId}">View Event</a>
            </div>
        `;
        section.appendChild(eventElement);
    });

    eventsContainer.appendChild(section);
}

function formatTime(timeString) {
    const timeWithoutMilliseconds = timeString.split('.')[0]; // Remove milliseconds if present
    const time = new Date(timeWithoutMilliseconds);
    const hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0'); // Ensure two-digit minutes

    let period = 'AM';
    let formattedHours = hours;

    if (hours === 0) {
        formattedHours = 12; // Midnight
    } else if (hours === 12) {
        period = 'PM'; // Noon
    } else if (hours > 12) {
        formattedHours = hours - 12;
        period = 'PM';
    }

    return `${formattedHours}:${minutes} ${period}`;
}

// Function to confirm quitting an event
function confirmQuitEvent(eventId) {
    if (confirm('Are you sure you want to quit the event?')) {
        quitEvent(eventId);
    }
}

// Function to handle quitting an event
async function quitEvent(eventId) {
    const userId = JSON.parse(localStorage.getItem('userData')).user.userId; // Retrieve userId from localStorage

    try {
        const response = await fetch(`/events/${eventId}/modifyparticipation`, {
            method: 'PUT', // Adjust according to your API requirements
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId })
        });
        const data = await response.json();
        if (data.success) {
            alert('Successfully quit the event.');
            const participatedEvents = await fetchUserEvents(userId, 'participated');
            renderEvents(participatedEvents, 'Participated Events', 'participated'); // Refresh the participated events list
        } else {
            throw new Error(data.message || 'Failed to quit the event.');
        }
    } catch (error) {
        console.error('Error quitting the event:', error);
        alert('Failed to quit the event.');
    }
}

// Function to fetch user events
async function fetchUserEvents(userId, eventType) {
    let url = eventType === 'hosted' ? `/events/${userId}/events-hosted` : `/events/${userId}/participated`;

    try {
        const response = await fetch(url);
        const events = await response.json();
        return events;
    } catch (error) {
        console.error(`Error fetching ${eventType} events:`, error);
        return [];
    }
}

// Function to fetch topic name
async function fetchTopicName(topicId) {
    try {
        const response = await fetch(`/communityforum/topics/${topicId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const topic = await response.json();
        console.log('Fetched Topic:', topic.topic); // Debugging
        return topic.topic || 'Unknown Topic'; // Handle cases where name might be undefined
    } catch (error) {
        console.error('Error fetching topic name:', error);
        return 'Unknown Topic';
    }
}

// Function to create post element
async function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.className = 'card-body d-flex flex-column justify-content-between posts-container';
    postElement.id = `post-${post.postId}`; // Add ID for easier removal later

    const topicName = await fetchTopicName(post.topicId);

    console.log('topicname:', topicName);

    postElement.innerHTML = `
        <div class="d-flex flex-row justify-content-between align-content-between">
            <div class="d-flex flex-row align-content-between justify-content-between mx-3 mt-2 mb-3 flex-grow-1">
                <div>
                    <h5 class="card-title"><strong>${post.title}</strong></h5>
                    <p class="post-date">${new Date(post.dateCreated).toLocaleDateString()}</p>
                </div>
                <div class="d-flex flex-row align-content-end mx-2 gap-4">
                    <div class="dropdown">
                        <a class="post-ellipsis" id="dropdownMenuButton${post.postId}" aria-haspopup="true" aria-expanded="false">
                            <strong><i class="fa fa-ellipsis-v"></i></strong>
                        </a>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton${post.postId}">
                            <div class="dropdown-item"><a href="../html/community-forum-edit-post.html?id=${post.postId}">Edit</a></div>
                            <div class="dropdown-item" onclick="showDeleteConfirmation(${post.postId})">Delete</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="post-content mb-4">
            <div class="post-topic mb-2 topic-name">${topicName}</div>
            <p class="card-text">${post.description}</p>
        </div>
        <div class="d-flex flex-row align-items-center justify-content-between">
            <div class="d-flex flex-row align-content-between justify-content-between mx-3 mt-2 mb-3 flex-grow-1">
                <div class="d-flex flex-row justify-content-end gap-2">
                    <div class="d-flex flex-row post-icon">
                        <i class="like-icon mx-2 fa fa-thumbs-up"></i>
                        <p class="number-of-likes">${post.likes}</p>
                    </div>
                    <div class="d-flex flex-row post-icon">
                        <i class="post-comment-icon mx-2 fa fa-comment-o"></i>
                        <p class="post-comments">${post.comments}</p>
                    </div>
                </div>
                <div>
                    <div class="view-post"><a href="../html/community-forum-post.html?id=${post.postId}">view post</a></div>
                </div>
            </div>
        </div>
    `;

    // Add event listener for the dropdown
    const dropdownButton = postElement.querySelector(`#dropdownMenuButton${post.postId}`);
    const dropdownMenu = postElement.querySelector(`.dropdown-menu`);

    dropdownButton.addEventListener('click', function (event) {
        event.stopPropagation();
        closeAllDropdowns();
        dropdownMenu.classList.toggle('show');
    });

    document.addEventListener('click', function () {
        dropdownMenu.classList.remove('show');
    });

    return postElement;
}

// Function to show delete confirmation
function showDeleteConfirmation(postId) {
    const deleteConfirmationContainer = document.getElementById('deleteConfirmationContainer');
    deleteConfirmationContainer.style.display = 'flex';

    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');

    // Event listener for confirm delete button
    confirmDeleteButton.onclick = function () {
        deletePost(postId);
        deleteConfirmationContainer.style.display = 'none';
    };

    // Event listener for cancel delete button
    cancelDeleteButton.onclick = function () {
        deleteConfirmationContainer.style.display = 'none';
    };
}

// Function to close all dropdowns
function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}

// Function to delete a post
async function deletePost(postId) {
    const token = localStorage.getItem('token'); // Retrieve token
    console.log(postId, token); // Debugging

    try {
        const response = await fetch(`/communityforum/${postId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const success = await response.json();
        if (success) {
            alert("Post successfully deleted!");
            const postElement = document.querySelector(`#post-${postId}`);
            if (postElement) postElement.remove(); // Remove the post element from the DOM
            window.location.reload();
        } else {
            console.error(success.error);
            throw new Error("Failed to delete post.");
        }

    } catch (error) {
        console.error('Error deleting post:', error);
        alert("Failed to delete post.");
    }
}