document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('event-pending-tab').addEventListener('click', fetchPendingEvents);
    document.getElementById('event-deny-tab').addEventListener('click', fetchDeniedEvents);

    // Initially load pending events
    fetchPendingEvents();
});

async function fetchPendingEvents() {
    try {
        const response = await fetch('/events/pending');
        const events = await response.json();
        displayEvents(events, 'pending-events-container');
    } catch (error) {
        console.error('Error fetching pending events:', error);
    }
}

async function fetchDeniedEvents() {
    try {
        const response = await fetch('/events/denied');
        const events = await response.json();
        displayEvents(events, 'deny-events-container');
    } catch (error) {
        console.error('Error fetching denied events:', error);
    }
}

function displayEvents(events, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    events.forEach(event => {
        const eventElement = createEventElement(event);
        container.appendChild(eventElement);
    });
}

function createEventElement(event) {
    const eventContainer = document.createElement('div');
    eventContainer.className = 'card-body d-flex flex-column justify-content-between posts-container';

    eventContainer.innerHTML = `

        <div class="event-header">
            <div class="pending-state">${event.status}</div>
            <div class="view-event">
                <a href="../html/participate-event.html">View Event</a>
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
        <div class="edit-button">
            <a href="#"">Action</a>
        </div>
    `;

    return eventContainer;
}