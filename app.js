// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        }
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.reveal');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name && email && message) {
                const subject = encodeURIComponent(`Portfolio Contact - Message from ${name}`);
                const body = encodeURIComponent(`Hello Eshwar,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`);
                const mailtoLink = `mailto:addurieshwar6@gmail.com?subject=${subject}&body=${body}`;
                
                // Open mailto link
                window.location.href = mailtoLink;
                
                // Reset form after a short delay
                setTimeout(() => {
                    contactForm.reset();
                }, 500);
            } else {
                alert('Please fill in all fields before submitting.');
            }
        });
    }

    // Handle all external links to open in new tabs
    function setupExternalLinks() {
        // Hero buttons
        const heroGitHubBtn = document.querySelector('.hero .btn[href*="github"]');
        const heroLinkedInBtn = document.querySelector('.hero .btn[href*="linkedin"]');
        
        if (heroGitHubBtn) {
            heroGitHubBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.open('https://github.com/EshwarAdduri', '_blank', 'noopener,noreferrer');
            });
        }
        
        if (heroLinkedInBtn) {
            heroLinkedInBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                window.open('https://linkedin.com/in/eshwaradduri', '_blank', 'noopener,noreferrer');
            });
        }

        // Project links
        const projectLinks = document.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const href = this.getAttribute('href');
                if (href && href.startsWith('http')) {
                    window.open(href, '_blank', 'noopener,noreferrer');
                }
            });
        });

        // Contact section links
        const contactLinks = document.querySelectorAll('.contact-link');
        contactLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('mailto:')) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = href;
                });
            } else if (href && (href.startsWith('http') || href.startsWith('https'))) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(href, '_blank', 'noopener,noreferrer');
                });
            }
        });
    }

    // Setup external links
    setupExternalLinks();

    // Active navigation highlighting based on scroll position
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
            
            if (scrollPos >= top && scrollPos <= bottom) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current nav link
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    // Throttle scroll events for better performance
    let scrollTimer = null;
    window.addEventListener('scroll', function() {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(updateActiveNav, 10);
    });

    // Initial call
    updateActiveNav();

    // Add hover effects for skill badges
    const skillBadges = document.querySelectorAll('.skill-badge');
    skillBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // Ensure page is properly loaded
    document.body.classList.add('loaded');
    
    console.log('Portfolio website loaded successfully!');
});