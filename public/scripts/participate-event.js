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

            setupLikeButton(event, 1);

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

};

async function setupLikeButton(event, userId) {
    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.getElementById('likeCount');

    let isLiked = false;
    try {
        const isLikedResponse = await fetch(`/events/${event.eventId}/get-like-by-user/1`); // Change once user session storage is implemented
        isLiked = await isLikedResponse.json();
    }
    catch {
        isLiked = false;
    }

    likeBtn.addEventListener('click', async () => {
        try {
            const response = await fetch(`/events/${event.eventId}/modifylike`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId })
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
    updateLikeButton(likeBtn, isLiked, event.likes); // Default to false, assuming the user hasn't liked it yet
}

function updateLikeButton(button, liked, likeCount) {
    if (liked) {
        button.innerHTML = `<i class="bi bi-hand-thumbs-up-fill"></i> <span id="likeCount">${likeCount}</span>`;
    } else {
        button.innerHTML = `<i class="bi bi-hand-thumbs-up"></i> <span id="likeCount">${likeCount}</span>`;
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