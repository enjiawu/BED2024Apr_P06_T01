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


// Function to get query parameter by name
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

document.addEventListener('DOMContentLoaded', async () => {
    const eventId = getQueryParam('id');
    if (eventId) {
        await fetchEventDetails(eventId);
    } else {
        alert('Event not found.');
    }

    document.querySelector('.updateBtn').addEventListener('click', handleFormSubmit);
    document.getElementById('customImage').addEventListener('change', handleFileChange);
});

async function fetchEventDetails(eventId) {
    try {
        const response = await fetch(`/events/${eventId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch event details');
        }
        const event = await response.json();

        if (userId !== event.userId) {
            alert('You are not authorized to edit this event.');
            window.location.href = '/index.html'; // Redirect or handle unauthorized access
            return;
        }

        populateForm(event);
    } catch (error) {
        console.error('Error fetching event details:', error);
        alert('Event not found.');
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const eventId = getQueryParam('id');
    const formData = new FormData(document.getElementById('editEventForm'));
    const eventImageFile = document.getElementById('customImage').files[0];

    // Append the image file only if a new image is selected
    if (eventImageFile) {
        // Validate file type
        if (!isImageFile(eventImageFile)) {
            displayFeedback('Please upload a valid image file.', 'error');
            return;
        }
    }

    formData.append('image', '');
    formData.append('userId', userId);
    formData.append('username', username);

    try {
        const response = await fetch(`/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        if (!response.ok) {
            const result = await response.json();
            if (result.errors) {
                displayValidationErrors(result.errors);
            } else {
                throw new Error('Failed to update event');
            }
            return;
        }
        alert('Event updated successfully');
        displayFeedback('Event updated successfully!', 'success');
        // Optionally redirect or update UI
    } catch (error) {
        console.error('Error updating event:', error);
        alert('Failed to update event. Please try again.');
        displayFeedback('Failed to update event. Please try again.', 'error');
    }
}

async function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        const imagePreview = document.getElementById('eventImage');
        imagePreview.src = await getFileBase64(file);
    }
}

function populateForm(event) {
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventImage').src = event.image;
    document.getElementById('eventDetails').value = event.description;
    document.getElementById('eventDate').value = formatDate(event.startDate);
    document.getElementById('eventTime').value = formatTime(event.startTime);
    document.getElementById('eventStatus').value = event.status;
    document.getElementById('eventLocation').value = event.location;
}

function formatTime(timeString) {
    const timeWithoutMilliseconds = timeString.split('.')[0]; // Remove milliseconds if present
    const time = new Date(timeWithoutMilliseconds);
    const hours = time.getHours().toString().padStart(2, '0'); // Ensure two-digit hours
    const minutes = time.getMinutes().toString().padStart(2, '0'); // Ensure two-digit minutes
    return `${hours}:${minutes}`;
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

async function getFileBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

function isImageFile(file) {
    return file && file.type.startsWith('image/');
}

function displayFeedback(message, type) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.innerText = message;
    feedbackElement.classList.remove('error', 'success');
    if (type === 'error') {
        feedbackElement.classList.remove('text-success');
        feedbackElement.classList.add('text-danger');    
    } else if (type === 'success') {
        feedbackElement.classList.remove('text-danger');
        feedbackElement.classList.add('text-success');
    }
}

function displayValidationErrors(errors) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.innerHTML = ''; // Clear previous messages

    errors.forEach(error => {
        const p = document.createElement('p');
        p.innerText = error;
        p.classList.add('text-danger'); // You can style these error messages as needed
        feedbackElement.appendChild(p);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const returnBtn = document.querySelector('.returnBtn');
    const eventId = getQueryParam('id');
    returnBtn.addEventListener('click', () => {
        window.location.href = `participate-event.html?id=${eventId}`;
    });
    getUserDataFromToken();
});