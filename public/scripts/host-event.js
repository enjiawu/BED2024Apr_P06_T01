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

document.addEventListener('DOMContentLoaded', () => {
    const hostEventForm = document.getElementById('hostEventForm');

    hostEventForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(hostEventForm);

        const eventImageFile = document.getElementById('eventImage').files[0];
        const errorMessagesDiv = document.getElementById('errorMessages');
        errorMessagesDiv.innerHTML = '';
        // Validate file type
        if (!isImageFile(eventImageFile)) {
            displayFeedback('Please upload a valid image file.', 'error');
            return;
        }
        
        formData.append('image', '');
        formData.append('userId', userId);
        formData.append('username', username);

        try {
            const response = await fetch('/events', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const result = await response.json();
                if (result.errors) {
                    result.errors.forEach(error => {
                    const errorMessage = document.createElement('p');
                    errorMessage.textContent = error;
                    errorMessagesDiv.appendChild(errorMessage);
                });
            } else {
                throw new Error('Failed to create event');
            }  
               
            }

            const createdEvent = await response.json();
            console.log('Event created successfully:', createdEvent);
            alert('Event created successfully! Your event will now be pending for approval.');
            displayFeedback('Event created successfully! Your event will now be pending for approval.', 'success');

            // Clear form fields on successful creation
            hostEventForm.reset();

            // Optionally clear the image preview
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.src = '#';
            imagePreview.style.display = 'none';
        } catch (error) {
            console.error('Error creating event:', error);
            alert('Unable to create event. Please try again.');
            displayFeedback('Unable to create event. Please try again.', 'error');
            // Handle error display or other feedback to the user
        }
    });

    document.getElementById('eventImage').addEventListener('change', function(event) {
        const imagePreview = document.getElementById('imagePreview');
        const file = event.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            imagePreview.src = '#';
            imagePreview.style.display = 'none';
        }
    });
});

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

document.addEventListener('DOMContentLoaded', () => {
    const returnBtn = document.querySelector('.return-btn');
    returnBtn.addEventListener('click', () => {
        window.location.href = 'event.html';
    });
    getUserDataFromToken();
});