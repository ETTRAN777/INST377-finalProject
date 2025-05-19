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

    // Add form validation and connect to backend
    document.getElementById('signupForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        // Check reCAPTCHA
        const captchaResponse = grecaptcha.getResponse();
        if (!captchaResponse) {
            alert('Please complete the reCAPTCHA.');
            return;
        }
        const username = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        if (password !== confirm) {
            alert('Passwords do not match!');
            return;
        }
        // Call backend to create user (do not send captcha)
        try {
            const response = await fetch('/user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.error || 'Sign up failed.');
            } else {
                alert('Account created! You can now log in.');
                document.getElementById('loginBox').style.display = 'block';
                document.getElementById('signupBox').style.display = 'none';
            }
        } catch (err) {
            alert('Sign up failed.');
        }
        // Optionally reset reCAPTCHA after submission
        grecaptcha.reset();
    });

    document.getElementById('loginForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();
        // Call backend to check user
        try {
            const response = await fetch('/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.ok && data.success) {
                // Save credentials (or just username) in localStorage for bookmarks page
                localStorage.setItem('jobJunctionUser', JSON.stringify({ username, password }));
                window.location.href = 'jobSearch.html';
            } else {
                alert(data.error || 'Invalid username or password.');
            }
        } catch (err) {
            alert('Login failed.');
        }
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

function logout() {
    localStorage.removeItem('jobJunctionUser');
}