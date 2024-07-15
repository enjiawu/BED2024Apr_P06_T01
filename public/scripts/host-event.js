document.addEventListener('DOMContentLoaded', () => {
    const hostEventForm = document.getElementById('hostEventForm');

    hostEventForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        //const formData = new FormData(hostEventForm);
        const eventTitle = document.getElementById('eventTitle').value;
        const eventDescription = document.getElementById('eventDescription').value;
        const eventDate = document.getElementById('eventDate').value;
        const eventTime = document.getElementById('eventTime').value;
        const eventLocation = document.getElementById('eventLocation').value;

        const eventImage = document.getElementById('eventImage').files[0]; // Assuming single file input

        const getFileBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        };
        
        const imageBase64 = eventImage ? await getFileBase64(eventImage) : '';

        const formInput = {
            image: imageBase64,
            title: eventTitle,
            description: eventDescription,
            startDate: eventDate,
            startTime: eventTime,
            location: eventLocation,
            userId: '1', //Change to current user ID later on 
            username: 'john_doe' //Change to current username later on
        }

        console.log(formInput);

        try {
            const response = await fetch('/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formInput)
            });

            if (!response.ok) {
                throw new Error('Failed to create event');
            }

            const createdEvent = await response.json();
            console.log('Event created successfully:', createdEvent);

            // Clear form fields on successful creation
            hostEventForm.reset();
        } catch (error) {
            console.error('Error creating event:', error);
            // Handle error display or other feedback to the user
        }
    });
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