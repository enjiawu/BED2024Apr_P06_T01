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

// Render events on the page
function renderEvents(events) {
    const eventsContainer = document.querySelector('.events-Container');
    const noEventsMessage = document.getElementById('noEventsMessage');
    eventsContainer.innerHTML = ''; // Clear existing content
    
    if (events.length === 0) {
        noEventsMessage.style.display = 'block';
    } else {
        noEventsMessage.style.display = 'none';
    }

    events.forEach(event => {
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
                    <button class="btn btn likeBtn">
                        <i class="bi bi-hand-thumbs-up-fill"></i> <span class="likeCount">${event.likes}</span>
                    </button>
                    <p class="mt-1">Status: ${event.status}</p>
                    <p>Date & Time of Event: ${formatDate(event.startDate) + ' ' + formatTime(event.startTime)}</p>
                </div>
            </div>
        `;
        eventsContainer.appendChild(eventCard);

        // const likeBtn = document.querySelector('.likeBtn');
        // const likeCount = document.querySelector('.likeCount');

        // likeBtn.addEventListener('click', () => {
        //     if (!likeBtn.disabled) {
        //         event.likes += 1;
        //         likeCount.textContent = event.likes;
        //         likeBtn.disabled = true;
        //     } 
        // });
    });
}

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
});