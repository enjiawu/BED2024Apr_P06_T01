document.addEventListener("DOMContentLoaded", async () => {
    const profilePicture = document.getElementById('profile-picture');
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const profileLocation = document.getElementById('profile-location');
    const profileBio = document.getElementById('profile-bio');

    // Fetch user data from local storage
    console.log(localStorage.getItem('userData'));
    console.log(localStorage.getItem('staffData'));
    const userData = JSON.parse(localStorage.getItem('userData'));
    const staffData = JSON.parse(localStorage.getItem('staffData'))

    if (userData) {
        // Update UI elements with user data
        profilePicture.src = userData.profilePicture || 'images/logo/ReThink Logo - Beige.png'; // Add a default profile picture if none exists
        profileUsername.textContent = userData.username;
        profileEmail.textContent = userData.email;
        profileLocation.textContent = userData.location || 'Location not provided';
        profileBio.textContent = userData.bio || 'Bio not provided';
    }

    else if (staffData){
        profilePicture.src = staffData.profilePicture || 'images/logo/ReThink Logo - Beige.png';
        profileUsername.textContent = staffData.name;
        profileEmail.textContent = staffData.email;
        profileLocation.textContent = staffData.location || 'Location not provided';
        profileBio.textContent = staffData.bio || 'Bio not provided';
    }
    
    else {
        alert('Not authenticated');
        return window.location.href = '../index.html'; // Redirect to login page if not authenticated
    }
});