document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.querySelector('.wrapper');
    const loginLinks = document.querySelectorAll('.login-link');
    const staffLoginLink = document.querySelector('.staff-login-link');
    const registerLink = document.querySelector('.register-link');
    const popupBtn = document.querySelector('.login-btn-pop');
    const iconClose = document.querySelector('.icon-close');
    const userDropdown = document.getElementById('user-dropdown');
    const profilePicture = document.querySelector('.profile-pic img');
    const logoutButton = document.getElementById('logout-button');

    const loginForm = document.querySelector('.form-box.login');
    const staffLoginForm = document.querySelector('.form-box.staff-login');
    const registerForm = document.querySelector('.form-box.register');

    function hideAllForms() {
        loginForm.classList.remove('active');
        staffLoginForm.classList.remove('active');
        registerForm.classList.remove('active');
    }

    function updateUIForAuthenticatedUser(userData) {
        console.log('Updating UI for user:', userData);
        userDropdown.style.display = 'block';
        document.getElementById('login-button-nav').style.display = 'none';

        if (userData.profilePicUrl) {
            profilePicture.src = userData.profilePicUrl;
        }

        wrapper.classList.remove('pop-active');
    }

    registerLink.addEventListener('click', (event) => {
        event.preventDefault();
        hideAllForms();
        registerForm.classList.add('active');
        wrapper.classList.add('link-active-register');
    });

    staffLoginLink.addEventListener('click', (event) => {
        event.preventDefault();
        hideAllForms();
        staffLoginForm.classList.add('active');
        wrapper.classList.add('link-active-staff');
    });

    loginLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            hideAllForms();
            loginForm.classList.add('active');
            wrapper.classList.remove('link-active-staff');
            wrapper.classList.remove('link-active-register');
        });
    });

    popupBtn.addEventListener('click', () => {
        wrapper.classList.add('pop-active');
        hideAllForms();
        loginForm.classList.add('active');
    });

    iconClose.addEventListener('click', () => {
        wrapper.classList.remove('pop-active');
        wrapper.classList.remove('link-active-staff');
        wrapper.classList.remove('link-active-register');
        hideAllForms();
    });

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
                body: JSON.stringify({ email, password })
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

    document.getElementById('staff-login-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const email = document.getElementById('staff-login-email').value;
        const password = document.getElementById('staff-password').value;

        try {
            const response = await fetch('/staffs/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const staffData = await response.json();
            localStorage.setItem('token', staffData.token);
            localStorage.setItem('staffData', JSON.stringify(staffData));
            console.log('Staff login successful:', staffData);
            alert('Staff login successful!');

            updateUIForAuthenticatedUser(staffData);

        } catch (error) {
            alert('Login failed. Invalid email or password.');
            console.error('Staff login error:', error);
        }
    });

    // Registration form submission event listener
    document.getElementById('register-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            const userData = await response.json();
            localStorage.setItem('token', userData.token);
            localStorage.setItem('userData', JSON.stringify(userData));
            console.log('Registration successful:', userData.user);
            alert('Registration successful!');

            updateUIForAuthenticatedUser(userData);

        } catch (error) {
            alert('Registration failed.');
            console.error('Registration error:', error);
        }
    });

    function checkAuthentication() {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        const staffData = localStorage.getItem('staffData');

        console.log('Checking authentication. Token:', token, 'UserData:', userData, 'StaffData:', staffData);

        if (token && (userData || staffData)) {
            const userOrStaffData = JSON.parse(userData || staffData);
            updateUIForAuthenticatedUser(userOrStaffData);
        }
    }

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('staffData');

        console.log('Logged out');

        userDropdown.style.display = 'none';
        document.getElementById('login-button-nav').style.display = 'block';

        return window.location.href = '../index.html'; // Redirect to login page if not authenticated
    });

    checkAuthentication();
});