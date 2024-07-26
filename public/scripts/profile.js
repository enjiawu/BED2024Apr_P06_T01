document.addEventListener("DOMContentLoaded", () => {
    // Retrieve elements for member profile
    const profilePicture = document.getElementById('profile-picture');
    const profileUsername = document.getElementById('profile-username');
    const profileUsernameDuplicate = document.getElementById('profile-username-duplicate');
    const profileEmail = document.getElementById('profile-email');
    const profileEmailDuplicate = document.getElementById('profile-email-duplicate');
    const profileLocation = document.getElementById('profile-location');

    // Retrieve elements for event profile
    const profilePictureEvent = document.getElementById('profile-picture-event');
    const profileEventName = document.getElementById('profile-event-name');
    const profileEventNameDuplicate = document.getElementById('profile-event-name-duplicate');
    const profileEventEmail = document.getElementById('profile-event-email');
    const profileEventLocation = document.getElementById('profile-event-location');
    const profileEventId = document.getElementById('profile-eventid');

    // Retrieve elements for admin profile
    const profilePictureAdmin = document.getElementById('profile-picture-admin');
    const profileAdminName = document.getElementById('profile-admin-name');
    const profileAdminNameDuplicate = document.getElementById('profile-admin-name-duplicate');
    const profileAdminEmail = document.getElementById('profile-admin-email');
    const profileAdminLocation = document.getElementById('profile-admin-location');
    const profileAdminId = document.querySelector('.profile-adminid');


    // Retrieve user data from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const staffData = JSON.parse(localStorage.getItem('staffData'));

    console.log('Parsed userData:', userData);
    console.log('Parsed staffData:', staffData);

    if (userData) {
        const user = userData.user;

        // Show profile based on role
        showProfileBasedOnRole(user.role);

        // Update profile elements with user data
        profilePicture.src = user.profilePicture || '../images/logo/ReThink Logo - Beige.png'; // Default profile picture
        profileUsername.textContent = user.username || 'Username not provided';
        profileUsernameDuplicate.textContent = user.username || 'Username not provided';
        profileEmail.textContent = user.email || 'Email not provided';
        profileEmailDuplicate.textContent = user.email || 'Email not provided';

        // Update profile elements with event staff data
        profileLocation.textContent = user.location || 'Location not provided';
        profileBio.textContent = user.bio || 'Bio not provided';
    } else if (staffData) {
        const staff = staffData.staff;

        // Show profile based on role
        showProfileBasedOnRole(staff.role);

        // Update profile elements with staff data
        profilePictureEvent.src = staff.profilePicture || '../images/logo/ReThink Logo - Beige.png'; // Default profile picture
        profileEventName.textContent = staff.staffName || 'Name not provided';
        profileEventNameDuplicate.textContent = staff.staffName || 'Name not provided';
        profileEventEmail.textContent = staff.email || 'Email not provided';
        profileEventLocation.textContent = staff.location || 'Location not provided';
        profileEventId.textContent = staff.staffId || 'ID not provided';

        profilePictureAdmin.src = staff.profilePicture || '../images/logo/ReThink Logo - Beige.png'; // Default profile picture
        profileAdminName.textContent = staff.staffName || 'Name not provided';
        profileAdminNameDuplicate.textContent = staff.staffName || 'Name not provided';
        profileAdminEmail.textContent = staff.email || 'Email not provided';
        profileAdminLocation.textContent = staff.location || 'Location not provided';
        profileAdminId.textContent = staff.staffId || 'ID not provided';
    } else {
        // Redirect to login page if no user data found
        alert('Not authenticated');
        window.location.href = '../index.html'; // Redirect to login page if not authenticated
    }
});

function showProfileBasedOnRole(role) {
    // profiles
    const memberProfile = document.getElementById('member-profile');
    const adminProfile = document.getElementById('admin-profile');
    const eventProfile = document.getElementById('event-profile');

    // containers
    const adminContainer = document.getElementById('admin-container');
    const eventContainer = document.getElementById('event-container');
    const memberContainer = document.getElementById('member-container');

    // Hide all profiles
    memberProfile.style.display = 'none';
    adminProfile.style.display = 'none';
    eventProfile.style.display = 'none';

    // Hide all containers
    adminContainer.style.display = 'none';
    eventContainer.style.display = 'none';
    memberContainer.style.display = 'none';

    // Show profile based on role
    switch (role) {
        case 'member':
            memberProfile.style.display = 'block';
            memberContainer.style.display = 'block';
            break;
        case 'admin':
            adminProfile.style.display = 'block';
            adminContainer.style.display = 'block';
            break;
        case 'event':
            eventProfile.style.display = 'block';
            eventContainer.style.display = 'block';
            break;
        default:
            console.error('Unknown role:', role);
    }
}
