document.addEventListener('DOMContentLoaded', () => {
     // Initialize Typed.js for animated text
    new Typed('#welcomeText', {
        strings: [
            'Find Your Dream Job',
            'Connect with Employers',
            'Build Your Career',
        ],
        typeSpeed: 50,
        backSpeed: 30,
        loop: true,
        showCursor: false
    });

   
    // Add form validation
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        if (document.getElementById('signup-password').value !== 
            document.getElementById('signup-confirm').value) {
            alert('Passwords do not match!');
            return;
        }
    });

    // Add Supabase auth initialization (ADD IN)
    
    const SUPABASE_URL = 'https://luspwsueakmvkrnwkfhc.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1c3B3c3VlYWttdmtybndrZmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MTQ5NDAsImV4cCI6MjA2MzA5MDk0MH0.p370rJYHmVaDZSrjOcPvAiWi-Moq2E7G92OTBlqwkVQ';
    const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Auth form submissions
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        const { user, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) alert(error.message);
        else window.location.href = 'jobSearch.html';
    });

    document.getElementById('signupForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        const { user, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) alert(error.message);
        else alert('Confirmation email sent!');
    });
});

const swiper = new Swiper('.background-slider', {
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    speed: 1500,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    loop: true,
    parallax: true,
});

// GSAP animations for initial load
gsap.from('.auth-container', {
    duration: 1,
    y: 100,
    opacity: 0,
    ease: "power4.out"
});

// Update parallax effect on scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    gsap.to('.swiper-slide-active img', {
        y: -scrolled * 0.3,
        ease: "none"
    });
});