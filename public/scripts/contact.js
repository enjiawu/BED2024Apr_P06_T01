document.getElementById('add-contact-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect the form data
    const firstName = document.getElementById('contact-first-name').value;
    const lastName = document.getElementById('contact-last-name').value;
    const email = document.getElementById('contact-email').value;
    const phoneNumber = document.getElementById('contact-phone-number').value;
    const message = document.getElementById('contact-msg').value;

    // Create the request payload
    const payload = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        message: message
    };

    try {
        const response = await fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Show success message
            document.getElementById('add-update-contact').style.display = 'block';
            document.getElementById('add-contact-form').reset();

            // Hide the success message after 3 seconds
            setTimeout(function() {
                document.getElementById('add-update-contact').style.display = 'none';
            }, 3000);
        } else {
            alert('Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to send message. Please try again.');
    }
});
