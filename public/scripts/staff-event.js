let staffData;

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('event-pending-tab').addEventListener('click', fetchPendingEvents);
    document.getElementById('event-deny-tab').addEventListener('click', fetchDeniedEvents);

    // Retrieve user data from localStorage
    staffData = JSON.parse(localStorage.getItem('staffData'));
    // Debugging: Print staffData
    console.log('Staff Data:', staffData);

    // Initially load pending events
    fetchPendingEvents();
});

async function fetchPendingEvents() {
    try {
        const response = await fetch('/events/pending');
        const events = await response.json();
        displayEvents(events, 'pending-events-container', 'pending');
    } catch (error) {
        console.error('Error fetching pending events:', error);
    }
}

async function fetchDeniedEvents() {
    try {
        const response = await fetch('/events/denied');
        const events = await response.json();
        displayEvents(events, 'deny-events-container', 'denied');
    } catch (error) {
        console.error('Error fetching denied events:', error);
    }
}

function displayEvents(events, containerId, status) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    events.forEach(event => {
        const eventElement = createEventElement(event, status);
        container.appendChild(eventElement);
    });
}

function createEventElement(event, status) {
    const eventContainer = document.createElement('div');
    eventContainer.className = 'card-body d-flex flex-column justify-content-between posts-container';

    let additionalInfo = '';
    if (status === 'denied') {
        additionalInfo = `<div class="denied-by">By: ${event.staffName}</div>`;
    }

    eventContainer.innerHTML = `
        <div class="event-header">
            <div class="pending-state">
            ${event.status}
            ${additionalInfo}
            </div>
            <div class="view-event">
                <a href="../html/participate-event.html?id=${event.eventId}">View Event</a>
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
        <div class="action-container">
        <div class="dropdown">
            <button class="dropbtn">Action</button>
            <div class="dropdown-content">
                <a href="#" onclick="approveEvent(${event.eventId})">Approve</a>
                <a href="#" onclick="denyEvent(${event.eventId})">Deny</a>
            </div>
        </div>
        </div>
    `;

    return eventContainer;
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

// Function to approve an event
async function approveEvent(eventId) {
    const staffId = staffData.staff.staffId;
    const staffName = staffData.staff.staffName;
    if (confirm('Are you sure you want to approve this event?')) {
        try {
            const response = await fetch(`/events/approve/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token if required
                },
                body: JSON.stringify({ staffId, staffName })
            });
            const result = await response.json();
            console.log('Approve Response:', result); // Debugging log
            if (result.status === 'Open') {
                alert('Event approved successfully.');
                fetchPendingEvents(); // Refresh the pending events
            } else {
                alert('Failed to approve event.');
            }
        } catch (error) {
            console.error('Error approving event:', error);
            alert('Failed to approve event.');
        }
    }
}

// Function to deny an event
async function denyEvent(eventId) {
    const staffId = staffData.staff.staffId;
    const staffName = staffData.staff.staffName;

    console.log('Deny Event - Staff Info:', { staffId, staffName }); // Add log

    if (confirm('Are you sure you want to deny this event?')) {
        try {
            const response = await fetch(`/events/deny/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Include token if required
                },
                body: JSON.stringify({ staffId, staffName }) // Include staffId and staffName in the request body
            });
            const result = await response.json();
            console.log('Deny Response:', result); // Debugging log
            if (result.status === 'Denied') {
                alert('Event denied successfully.');
                fetchPendingEvents(); // Refresh the pending events
            } else {
                alert('Failed to deny event.');
            }
        } catch (error) {
            console.error('Error denying event:', error);
            alert('Failed to deny event.');
        }
    }
}