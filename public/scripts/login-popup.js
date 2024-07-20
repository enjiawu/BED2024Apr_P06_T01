document.addEventListener("DOMContentLoaded", () => {
    // Get all necessary elements
    const wrapper = document.querySelector('.wrapper');
    const loginLinks = document.querySelectorAll('.login-link');
    const staffLoginLink = document.querySelector('.staff-login-link');
    const registerLink = document.querySelector('.register-link');
    const popupBtn = document.querySelector('.login-btn-pop');
    const iconClose = document.querySelector('.icon-close');
    const userDropdown = document.getElementById('user-dropdown');
    const profilePicture = document.querySelector('.profile-pic img');
    const logoutButton = document.getElementById('logout-button');

    // Get the form containers
    const loginForm = document.querySelector('.form-box.login');
    const staffLoginForm = document.querySelector('.form-box.staff-login');
    const registerForm = document.querySelector('.form-box.register');

    // Function to hide all forms
    function hideAllForms() {
        loginForm.classList.remove('active');
        staffLoginForm.classList.remove('active');
        registerForm.classList.remove('active');
    }

    // Function to update UI based on authentication status
    function updateUIForAuthenticatedUser(userData) {
        userDropdown.style.display = 'block';
        document.getElementById('login-button-nav').style.display = 'none';

        if (userData.profilePicUrl) {
            profilePicture.src = userData.profilePicUrl;
        }

        wrapper.classList.remove('pop-active');
    }

    // Event listener for clicking on the Register link
    registerLink.addEventListener('click', (event) => {
        event.preventDefault();
        hideAllForms();
        registerForm.classList.add('active');
        wrapper.classList.add('link-active-register');
    });

    // Event listener for clicking on the staff Login link
    staffLoginLink.addEventListener('click', (event) => {
        event.preventDefault();
        hideAllForms();
        staffLoginForm.classList.add('active');
        wrapper.classList.add('link-active-staff');
    });

    // Event listeners for clicking on the Login links
    loginLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            hideAllForms();
            loginForm.classList.add('active');
            wrapper.classList.remove('link-active-staff');
            wrapper.classList.remove('link-active-register');
        });
    });

    // Event listener for clicking on the Login button to show the popup
    popupBtn.addEventListener('click', () => {
        wrapper.classList.add('pop-active');
        hideAllForms();
        loginForm.classList.add('active'); // Default to login form when popup is shown
    });

    // Event listener for clicking on the close icon to hide the popup
    iconClose.addEventListener('click', () => {
        wrapper.classList.remove('pop-active');
        wrapper.classList.remove('link-active-staff');
        wrapper.classList.remove('link-active-register');
        hideAllForms();
    });

    // Login form submission event listener
    document.getElementById('login-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const userData = await response.json();
            localStorage.setItem('token', userData.token);
            localStorage.setItem('userData', JSON.stringify(userData));
            console.log('Login successful:', userData);
            alert('Login successful!');

            updateUIForAuthenticatedUser(userData);

        } catch (error) {
            alert('Login failed. Invalid email or password.');
            console.error('Login error:', error);
        }
    });

    // Check if the user is already logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');

    if (token && userData) {
        updateUIForAuthenticatedUser(JSON.parse(userData));
    }

    // Logout functionality
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');

        // Hide user dropdown and show login button
        userDropdown.style.display = 'none';
        document.getElementById('login-button-nav').style.display = 'block';
    });
});


// Staff Login form submission event listener
document.getElementById('staff-login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/staffs/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const staffData = await response.json();
        localStorage.setItem('token', staffData.token);
        localStorage.setItem('staffData', JSON.stringify(staffData));
        console.log('Login successful:', staffData);
        alert('Login successful!');

        updateUIForAuthenticatedUser(staffData);

    } catch (error) {
        alert('Login failed. Invalid email or password.');
        console.error('Login error:', error);
    }
});

// Check if the user is already logged in
const token = localStorage.getItem('token');
const userData = localStorage.getItem('userData');

if (token && userData) {
    updateUIForAuthenticatedUser(JSON.parse(userData));
}

// Logout functionality
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');

    // Hide user dropdown and show login button
    userDropdown.style.display = 'none';
    document.getElementById('login-button-nav').style.display = 'block';
});
