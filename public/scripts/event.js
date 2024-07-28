let userId = null; // Initialize the user ID
let username = null;
let token = localStorage.getItem('token'); // Get the token from local storage

// Function to get the user data from the token
function getUserDataFromToken() {

    if (!token) {
        console.log("No token found");
        return false;
    }

    userId = JSON.parse(localStorage.getItem("userData")).user.userId;
    username = JSON.parse(localStorage.getItem("userData")).user.username;
    return true;
}


// Fetch events from the server
async function fetchEvents() {
    try {
        const response = await fetch('/events/listed'); 
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const events = await response.json();
        renderEvents(events); // Call render function with fetched events
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    
    // Date options for formatting date part
    const dateOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', dateOptions);
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

async function checkParticipationStatus(eventId, userId) {
    try {
        const response = await fetch(`/events/${eventId}/get-event-participation/${userId}`);
        if (!response.ok) {
            throw new Error('Failed to check participation status');
        }
        const hasParticipated = await response.json();
        return hasParticipated;
    } catch (error) {
        console.error('Error checking participation status:', error);
        return false;
    }
}

function updateLikeButton(button, liked, likeCount) {
    if (liked) {
        button.innerHTML = `<i class="bi bi-hand-thumbs-up-fill"></i> <span class="likeCount">${likeCount}</span>`;
    } else {
        button.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> <span class="likeCount">${likeCount}</span>`;
    }
}

// Render events on the page
async function renderEvents(events) {
    const eventsContainer = document.querySelector('.events-Container');
    const noEventsMessage = document.getElementById('noEventsMessage');
    eventsContainer.innerHTML = ''; // Clear existing content
    
    if (events.length === 0) {
        noEventsMessage.style.display = 'block';
    } else {
        noEventsMessage.style.display = 'none';
    }
    for (const event of events) {
        try {
            const hasParticipated = await checkParticipationStatus(event.eventId, userId);
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');
            eventCard.innerHTML = `
                <div class="d-flex">
                    <img src="${event.image}" class="card-img" style="width: 160px; height: 160px; margin: 7.5px;" alt="Event Image">
                    <div class="flex-grow-1">
                        <a href="participate-event.html?id=${event.eventId}" class="event-card-link">
                            <h5 class="mt-2"><strong>${event.title}</strong></h5>
                            <p>Hosted by: ${event.username}</p>
                            <p class="event-desc">${event.description}</p>
                        </a>
                    </div>
                    <div class="event-details text-end">
                        <button class="btn btn likeBtn" data-event-id="${event.eventId}">
                            <i class="bi bi-hand-thumbs-up-fill"></i> <span class="likeCount">${event.likes}</span>
                        </button>
                        <p class="mt-1">Status: ${event.status}</p>
                        <p>Date & Time of Event: ${formatDate(event.startDate) + ' ' + formatTime(event.startTime)}</p>
                        ${hasParticipated ? '<span class="badge bg-success fs-6">Joined</span>' : ''}
                    </div>
                </div>
            `;
            eventsContainer.appendChild(eventCard);
        } catch (error) {
            console.error('Error processing event:', error);
        }
    }

    const likeButtons = document.querySelectorAll('.likeBtn');
    likeButtons.forEach(async (button) => {
        const eventId = button.getAttribute('data-event-id');

        // Check initial like status
        let isLiked = false;
        try {
            const isLikedResponse = await fetch(`/events/${eventId}/get-like-by-user/${userId}`); 
            isLiked = await isLikedResponse.json();
        } catch {
            isLiked = false;
        }

        // Update button appearance based on initial like status
        updateLikeButton(button, isLiked, button.querySelector('.likeCount').textContent);

        button.addEventListener('click', async () => {
            try {
                const response = await fetch(`/events/${eventId}/modify-like`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ userId: userId }) // Change as needed for actual user ID
                });
                if (!response.ok) {
                    throw new Error('Failed to like/unlike the event');
                }
                const result = await response.json();
                const likeCountElement = button.querySelector('.likeCount');
                likeCountElement.textContent = result.likes;
                updateLikeButton(button, result.likestatus === 'liked', result.likes);
            } catch (error) {
                console.error('Error liking/unliking event:', error);
                alert('Please log in to like an event.');
            }
        });
    });
};


async function searchEvents(searchTerm) {
    try {
        const response = await fetch(`/events/search?searchTerm=${searchTerm}`);
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const events = await response.json();
        renderEvents(events); // Call a function to render the searched events
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

async function filterEvents(status) {
    try {
        const response = await fetch(`/events/status/${status}`);
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        const events = await response.json();
        renderEvents(events); // Call a function to render filtered events
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

// Trigger fetching events when the page loads
document.addEventListener('DOMContentLoaded', fetchEvents);

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    const hostEventBtn = document.querySelector('.hostevent-btn');

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = searchInput.value;
            searchEvents(searchTerm);
        }
    });
    searchBtn.addEventListener('click', () => {
        const searchTerm = searchInput.value;
        searchEvents(searchTerm);
    });

    const loggedIn = getUserDataFromToken();

    if (!loggedIn) {
        hostEventBtn.disabled = true; // Disable the button
        hostEventBtn.classList.add('btn-secondary');
        hostEventBtn.textContent = 'Log in/Sign up to Host Events';
    } else {
        hostEventBtn.addEventListener('click', () => {
            window.location.href = 'host-event.html'; // Redirect to host event page
        });
    }
});

getUserDataFromToken();