document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const openMenu = () => {
        mobileNavOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeMenu = () => {
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMenu);
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMenu);
    }

    // Close menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Header Background on Scroll
    const header = document.querySelector('.header');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll);

    // Contact Form API Submission
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-submit');
            const originalText = btn.textContent;

            // Loading state
            btn.textContent = 'Sending...';
            btn.disabled = true;

            try {
                const formData = new FormData(contactForm);

                const response = await fetch('https://www.myinvoks.com/api/submit/cmmmhi5au00013qx68vcsqkyr', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactForm.reset();
                    formStatus.textContent = 'Thank you! Your request has been sent successfully.';
                    formStatus.className = 'form-status success';
                } else {
                    formStatus.textContent = 'There was a problem sending your message. Please try again.';
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                alert('Network error. Please check your connection and try again.');
            } finally {
                // Restore button state
                btn.textContent = originalText;
                btn.disabled = false;

                // Hide status message after 5 seconds
                if (formStatus.textContent) {
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                        // Reset style for next submission
                        setTimeout(() => {
                            formStatus.style.display = 'block';
                            formStatus.textContent = '';
                            formStatus.className = 'form-status';
                        }, 500);
                    }, 5000);
                }
            }
        });
    }

    // Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
