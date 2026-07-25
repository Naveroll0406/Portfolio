/* ==========================================================================
   Naveen Mamidala — Portfolio interactions
   Visual state is driven by CSS classes; JS only toggles state.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------------------------------------------------------------
       Mobile navigation
       --------------------------------------------------------------- */
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));

    const closeMenu = () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
    };

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            hamburger.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('nav-open', isOpen);
        });

        navLinks.forEach(link => link.addEventListener('click', closeMenu));

        document.addEventListener('click', (e) => {
            if (!navMenu.classList.contains('active')) return;
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    /* ---------------------------------------------------------------
       Scroll-driven UI: navbar state, progress bar, back-to-top
       (smooth scrolling + offsets are handled in CSS)
       --------------------------------------------------------------- */
    const navbar = document.querySelector('.navbar');
    const progressBar = document.getElementById('scrollProgress');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    let ticking = false;

    const onScroll = () => {
        const y = window.scrollY;

        if (navbar) navbar.classList.toggle('scrolled', y > 24);
        if (scrollToTopBtn) scrollToTopBtn.classList.toggle('show', y > 400);

        if (progressBar) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const ratio = max > 0 ? Math.min(y / max, 1) : 0;
            progressBar.style.transform = `scaleX(${ratio})`;
        }

        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScroll);
        }
    }, { passive: true });

    onScroll();

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------------------------------------------------------------
       Active nav link — tracks the section in view
       --------------------------------------------------------------- */
    const sections = Array.from(document.querySelectorAll('section[id]'));

    if (sections.length && 'IntersectionObserver' in window) {
        const setActive = (id) => {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        };

        const navObserver = new IntersectionObserver((entries) => {
            const visible = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible) setActive(visible.target.id);
        }, { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] });

        sections.forEach(section => navObserver.observe(section));
    }

    /* ---------------------------------------------------------------
       Reveal on scroll (staggered)
       --------------------------------------------------------------- */
    const revealTargets = document.querySelectorAll(
        '.skill-category, .project-card, .timeline-item, .stat-card, .achievement, .cert-item, .contact-item, .contact-form'
    );

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('reveal-in');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        // Stagger siblings within each group
        const groups = new Map();
        revealTargets.forEach(el => {
            const parent = el.parentElement;
            const index = groups.get(parent) || 0;
            groups.set(parent, index + 1);
            el.style.setProperty('--i', Math.min(index, 6));
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    }

    /* ---------------------------------------------------------------
       Hero role line — typewriter with caret
       --------------------------------------------------------------- */
    const roleLine = document.querySelector('.hero-text h2[data-typewriter]');

    if (roleLine && !prefersReducedMotion) {
        const text = roleLine.dataset.typewriter;
        const caret = document.createElement('span');
        caret.className = 'caret';

        roleLine.textContent = '';
        roleLine.appendChild(document.createTextNode(''));
        roleLine.appendChild(caret);

        let i = 0;
        const type = () => {
            if (i >= text.length) return;
            roleLine.firstChild.nodeValue += text.charAt(i);
            i += 1;
            setTimeout(type, 42);
        };

        setTimeout(type, 900);
    }

    /* ---------------------------------------------------------------
       Cursor-tracked spotlight on project cards
       --------------------------------------------------------------- */
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('pointermove', (e) => {
                const rect = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
                card.style.setProperty('--my', `${e.clientY - rect.top}px`);
            });
        });
    }

    /* ---------------------------------------------------------------
       Floating tech icons — offset the shared float animation
       --------------------------------------------------------------- */
    document.querySelectorAll('.tech-icon').forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.85}s`;
    });

    /* ---------------------------------------------------------------
       Achievement counters
       --------------------------------------------------------------- */
    const achievements = Array.from(document.querySelectorAll('.achievement-number'));
    const aboutSection = document.querySelector('.about');

    if (achievements.length && aboutSection && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);

                achievements.forEach(el => {
                    const finalValue = el.textContent.trim();
                    const target = parseInt(finalValue.replace(/\D/g, ''), 10);
                    if (!target) return;

                    const suffix = finalValue.replace(/[\d\s]/g, '');
                    const duration = prefersReducedMotion ? 0 : 1200;
                    const start = performance.now();

                    const tick = (now) => {
                        const progress = duration ? Math.min((now - start) / duration, 1) : 1;
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.round(target * eased) + suffix;
                        if (progress < 1) requestAnimationFrame(tick);
                        else el.textContent = finalValue;
                    };

                    requestAnimationFrame(tick);
                });
            });
        }, { threshold: 0.4 });

        counterObserver.observe(aboutSection);
    }

    /* ---------------------------------------------------------------
       Portrait fallback
       --------------------------------------------------------------- */
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.addEventListener('error', () => {
            profileImg.style.background = 'linear-gradient(135deg, #7c5cff, #22d3ee)';
        });
    }

    /* ---------------------------------------------------------------
       Contact form (EmailJS) with inline status
       --------------------------------------------------------------- */
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    const setStatus = (message, state) => {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = `form-status${state ? ` ${state}` : ''}`;
    };

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const data = Object.fromEntries(new FormData(contactForm).entries());

            if (!data.from_name || !data.from_email || !data.subject || !data.message) {
                setStatus('Please fill in all fields.', 'error');
                return;
            }

            if (typeof emailjs === 'undefined') {
                setStatus('Mail service unavailable. Please email me directly.', 'error');
                return;
            }

            const originalLabel = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending…';
            }
            setStatus('Sending your message…');

            emailjs.send('service_cgidhr8', 'template_c7p6wbs', data)
                .then(() => {
                    contactForm.reset();
                    setStatus('Message sent — I\'ll get back to you soon.', 'success');
                })
                .catch((err) => {
                    console.error(err);
                    setStatus('Something went wrong. Please try again or email me directly.', 'error');
                })
                .finally(() => {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = originalLabel;
                    }
                });
        });
    }
});
