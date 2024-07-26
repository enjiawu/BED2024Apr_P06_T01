document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.getElementById('menu-btn');
    const navRight = document.getElementById('nav-right'); // Select nav-right element

    menuBtn.addEventListener('click', function () {
        navRight.classList.toggle('active'); // Toggle active class on nav-right
    });
});