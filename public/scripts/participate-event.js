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

// Function to get query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

document.addEventListener('DOMContentLoaded', async () => {
    const eventId = getQueryParam('id');
    const mainContent = document.querySelector('main');
    const originalHTML = mainContent.innerHTML;
    if (eventId) {
        // Fetch event details from server
        try {
            const response = await fetch(`/events/${eventId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch event details');
            }
            const event = await response.json();
            displayEventDetails(event);

            const editEventBtn = document.getElementById('editEventBtn');
            editEventBtn.addEventListener('click', () => {
                window.location.href = `/html/edit-event.html?id=${eventId}`;
            });

            const deleteEventBtn = document.getElementById('deleteEventBtn');
            deleteEventBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this event?')) {
                    deleteEvent(eventId);
                }
            });

            setupLikeButton(event, userId);
            setupParticipateBtn(event, userId);

        } catch (error) {
            console.error('Error fetching event details:', error);
            alert('Event not found.');
            mainContent.innerHTML = originalHTML;
        }
    } else {
        alert('Event not found.');
        mainContent.innerHTML = originalHTML;
    }
});

function displayEventDetails(event) {
    document.querySelector('h1').innerText = event.title;
    document.querySelector('.card-img').src = event.image;
    document.querySelector('.card-body ul').innerHTML = `
        <li><strong>Event Posted on:</strong> ${formatDate(event.datePosted)}</li>
        <li><strong>Event Begins on:</strong> ${formatDate(event.startDate) + ' ' + formatTime(event.startTime)}</li>
        <li><strong>Status:</strong> ${event.status}</li>
        <li><strong>Event Held at:</strong> ${event.location}</li>
    `;
    document.querySelector('.card-text').innerText = event.description;

    //Ensure that users whose events don't belong to them aren't able to edit them
    const editDropdown = document.querySelector('.edit-dropdown');
    if (userId !== event.userId) {
        editDropdown.style.display = 'none';
    }
};

async function deleteEvent(eventId) {
    try {
        const response = await fetch(`/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({userId : userId})
        });
        if (!response.ok) {
            throw new Error('Failed to delete the event');
        }
        alert('Event deleted successfully.');
        window.location.href = '/html/event.html'; // Redirect to events page
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event.');
    }
}

async function setupLikeButton(event, userId) {
    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.getElementById('likeCount');

    let isLiked = false;
    try {
        const isLikedResponse = await fetch(`/events/${event.eventId}/get-like-by-user/${userId}`); // Change once user session storage is implemented
        isLiked = await isLikedResponse.json();
    }
    catch {
        isLiked = false;
    }

    likeBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`/events/${event.eventId}/modify-like`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId: userId })
            });
            if (!response.ok) {
                throw new Error('Failed to like/unlike the event');
            }
            const result = await response.json();
            //likeCount.textContent = event.likes;
            event.likes = result.likes;
            console.log('Likes:', event.likes);
            likeCount.textContent = event.likes;
            updateLikeButton(likeBtn, result.likestatus === 'liked', event.likes);
        } catch (error) {
            console.error('Error liking/unliking event:', error);
            alert('Please log in to like an event.');
        }
    });

    // Check the initial like status
    updateLikeButton(likeBtn, isLiked, event.likes); 
}

function updateLikeButton(button, liked, likeCount) {
    if (liked) {
        button.innerHTML = `<i class="bi bi-hand-thumbs-up-fill"></i> <span id="likeCount">${likeCount}</span>`;
    } else {
        button.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> <span id="likeCount">${likeCount}</span>`;
    }
}

//Participation Logic
async function setupParticipateBtn(event, userId) {
    const participateBtn = document.getElementById('participateBtn');

    if (event.status === 'Cancelled' || event.status === 'Closed') {
        participateBtn.disabled = true;
        participateBtn.classList.add('btn-secondary');
        participateBtn.textContent = 'Event is ' + event.status;
        return;
    }

    let hasParticipated = false;
    try {
        const hasParticipatedResponse = await fetch(`/events/${event.eventId}/get-event-participation/${userId}`);
        hasParticipated = await hasParticipatedResponse.json();
    }
    catch {
        hasParticipated = false;
    }

    // Check the initial participation status
    updateParticipateBtn(participateBtn, hasParticipated); 

    participateBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`/events/${event.eventId}/modify-participation`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId: userId })
            });
            if (!response.ok) {
                throw new Error('Failed to join/withdraw the event');
            }
            const result = await response.json();
            updateParticipateBtn(participateBtn, result.eventstatus === 'joined');
            displayFeedback(result.eventstatus === 'joined' ? "Thanks for joining! We'll look forward to your participation!" : 'Withdrawn event. Thanks for considering!', 'success');
        } catch (error) {
            console.error('Error joining/withdrawing event:', error);
            alert('Please log in to participate in an event.');
            displayFeedback('Failed to join/withdraw the event. Please try again.', 'error');
        }
    });
}

function updateParticipateBtn(button, participated) {
    if (participated) {
        button.textContent = 'Withdraw Event';
    } else {
        button.textContent = 'Participate in Event';
    }
}

function displayFeedback(message, type) {
    const element = document.getElementById('feedback');
    element.innerText = message;
    element.classList.remove('text-success', 'text-danger');
    if (type === 'error') {
        element.classList.add('text-danger');
    } else if (type === 'success') {
        element.classList.add('text-success');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
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

document.addEventListener('DOMContentLoaded', () => {
    const returnBtn = document.getElementById('returnBtn');
    
    returnBtn.addEventListener('click', () => {
        window.location.href = 'event.html';
    });
});

getUserDataFromToken();