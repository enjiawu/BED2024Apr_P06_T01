// Fetch events from the server
async function fetchEvents() {
    try {
        const response = await fetch('/events'); 
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
    const time = new Date(timeString);

    const timeOptions = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };

    return time.toLocaleTimeString('en-US', timeOptions);
}

// Render events on the page
function renderEvents(events) {
    const eventsContainer = document.querySelector('.events-Container');
    eventsContainer.innerHTML = ''; // Clear existing content
    
    events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        eventCard.innerHTML = `
            <div class="d-flex">
                <img src="${event.image}" class="card-img" style="width: 160px; height: 160px; margin: 7.5px;" alt="Event Image">
                <div class="flex-grow-1">
                    <h5 class="mt-2"><strong>${event.title}</strong></h5>
                    <p>Hosted by: ${event.username}</p>
                    <p class="event-desc">${event.description}</p>
                </div>
                <div class="text-end">
                    <button class="btn btn">
                        <i class="bi bi-hand-thumbs-up-fill"></i> ${event.likes}
                    </button>
                </div>
                <div>
                    <p class="mt-1">Status: ${event.status}</p>
                    <p>Date and Time of Event: ${formatDate(event.startDate) + ' ' + formatTime(event.startTime)}</p>
                </div>  
            </div>
        `;
        eventsContainer.appendChild(eventCard);
    });
}



// Trigger fetching events when the page loads
document.addEventListener('DOMContentLoaded', fetchEvents);
