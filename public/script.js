document.addEventListener('DOMContentLoaded', () => {

    /* --- MOBILE MENU SELECTION --- */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navList = document.getElementById('nav-list');

    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    /* --- ACTIVE STATE HIGHLIGHTING FOR NAVIGATION --- */
    const mainLinks = document.querySelectorAll('#nav-list a');
    const sideLinks = document.querySelectorAll('.side-nav a');

    // MZCET logic applies primary highlight handling
    mainLinks.forEach(link => {
        link.addEventListener('click', function() {
            mainLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
            }
        });
    });

    /* --- SMOOTH SCROLLING --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 60, // Top navigation offset block
                    behavior: 'smooth'
                });
            }
        });
    });


});
