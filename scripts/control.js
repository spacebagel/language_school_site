document.addEventListener('DOMContentLoaded', function () {
    const menu = document.getElementById('menu-nav');
    const hamburgerMenu = document.querySelector('.hamburger-menu');

    hamburgerMenu.addEventListener('click', function () {
        menu.classList.toggle('active');
    });
});
