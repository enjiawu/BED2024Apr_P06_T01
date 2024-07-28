document.addEventListener("DOMContentLoaded", () => {
    // Retrieve user data from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));
    const staffData = JSON.parse(localStorage.getItem('staffData'));

    console.log('Parsed userData:', userData);
    console.log('Parsed staffData:', staffData);

    if (userData) {
        const user = userData.user;

        // Show profile based on role
        showSettingBasedOnRole(user.role);

    } else if (staffData) {
        const staff = staffData.staff;

        // Show profile based on role
        showSettingBasedOnRole(staff.role);

    } else {
        // Redirect to login page if no user data found
        alert('Not authenticated');
        window.location.href = '../index.html'; // Redirect to login page if not authenticated
    }
});

function showSettingBasedOnRole(role) {

    const staffSetting = document.getElementById('staff-setting');
    const memberSetting = document.getElementById('member-setting');

    // Hide all profiles
    staffSetting.style.display = 'none';
    memberSetting.style.display = 'none';

    // Show profile based on role
    switch (role) {
        case 'member':
            memberSetting.style.display = 'block';
            break;
        case 'admin':
            staffSetting.style.display = 'block';

            break;
        case 'event':
            staffSetting.style.display = 'block';
            break;
        default:
            console.error('Unknown role:', role);
    }
}

