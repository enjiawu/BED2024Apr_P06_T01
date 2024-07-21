document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('You need to log in first.');
        window.location.href = '/login.html';  // Redirect to login page if not authenticated
        return;
    }

    try {
        const response = await fetch('/profile/:userId', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data.');
        }

        const userData = await response.json();

        document.getElementById('profile-name').textContent = userData.username;
        document.getElementById('profile-email').textContent = userData.email;
        // Add more fields as needed

    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to fetch user data.');
    }
});