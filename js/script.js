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

    // -----------------------------------------------------
    // GALLERY 3D ROTATING CAROUSEL
    // -----------------------------------------------------
    const galleryViewport = document.getElementById('galleryViewport');
    const galleryPrevBtn = document.getElementById('galleryPrevBtn');
    const galleryNextBtn = document.getElementById('galleryNextBtn');
    const galleryIndicators = document.getElementById('galleryIndicators');

    if (galleryViewport) {
        const galleryImages = [
            'fotos/ELK/1.webp', 'fotos/ELK/2.webp', 'fotos/ELK/3.webp', 
            'fotos/ELK/4.webp', 'fotos/ELK/5.webp', 'fotos/ELK/6.webp',
            'fotos/ELK/7.webp', 'fotos/ELK/8.webp', 'fotos/ELK/9.webp',
            'fotos/ELK/10.webp', 'fotos/ELK/11.webp', 'fotos/ELK/12.webp',
            'fotos/ELK/13.webp', 'fotos/ELK/14.webp', 'fotos/ELK/15.webp'
        ];

        const numImages = galleryImages.length;
        const angleStep = 360 / numImages; // degrees between each image
        // translateZ distance — radius of the 3D ring
        const radius = 800;
        let currentAngle = 0;
        let currentIndex = 0;
        let isTransitioning = false;

        const initCarousel = () => {
            galleryImages.forEach((src, i) => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = `Gallery Image ${i + 1}`;
                img.className = 'gallery-carousel-face';
                // Place each image around the ring
                const angle = i * angleStep;
                img.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
                galleryViewport.appendChild(img);
            });

            // Create indicator dots
            galleryImages.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = `indicator-dot ${index === 0 ? 'active' : ''}`;
                dot.addEventListener('click', () => goToSlide(index));
                galleryIndicators.appendChild(dot);
            });

            updateFrontFace();
        };

        const updateFrontFace = () => {
            const faces = galleryViewport.querySelectorAll('.gallery-carousel-face');
            faces.forEach((face, i) => {
                face.classList.remove('front-face');
                if (i === currentIndex) face.classList.add('front-face');
            });
        };

        const updateIndicators = (index) => {
            const dots = galleryIndicators.querySelectorAll('.indicator-dot');
            dots.forEach(dot => dot.classList.remove('active'));
            if(dots[index]) dots[index].classList.add('active');
        };

        const goToSlide = (targetIndex) => {
            if (isTransitioning || targetIndex === currentIndex) return;
            isTransitioning = true;

            // Determine the shortest rotation path
            let diff = targetIndex - currentIndex;
            // Wrap around for shortest path
            if (diff > numImages / 2) diff -= numImages;
            if (diff < -numImages / 2) diff += numImages;

            currentAngle -= diff * angleStep;
            currentIndex = targetIndex;
            
            galleryViewport.style.transform = `rotateY(${currentAngle}deg)`;
            updateIndicators(currentIndex);
            updateFrontFace();

            setTimeout(() => { isTransitioning = false; }, 1000);
        };

        // Navigation Listeners
        if (galleryPrevBtn) {
            galleryPrevBtn.addEventListener('click', () => {
                if (isTransitioning) return;
                let targetIndex = currentIndex - 1;
                if (targetIndex < 0) targetIndex = numImages - 1;
                goToSlide(targetIndex);
            });
        }

        if (galleryNextBtn) {
            galleryNextBtn.addEventListener('click', () => {
                if (isTransitioning) return;
                let targetIndex = currentIndex + 1;
                if (targetIndex >= numImages) targetIndex = 0;
                goToSlide(targetIndex);
            });
        }

        initCarousel();
    }

    // -----------------------------------------------------
    // SERVICES TIMELINE ANIMATION
    // -----------------------------------------------------
    const servicesTimeline = document.getElementById('servicesTimeline');
    const timelineBranch = document.getElementById('timelineBranch');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (servicesTimeline && timelineBranch) {
        const drawTimelineOnScroll = () => {
            const timelineRect = servicesTimeline.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // We want the line to start drawing when the top of the timeline reaches 60% of viewport height
            // and finish drawing when the bottom of the timeline reaches 60% of viewport height.
            const triggerPoint = viewportHeight * 0.6;
            const timelineTop = timelineRect.top;
            const timelineHeight = timelineRect.height;
            
            // Distance scrolled past the trigger point
            const scrollDistance = triggerPoint - timelineTop;
            
            // Calculate percentage (0 to 100)
            let branchPercentage = (scrollDistance / timelineHeight) * 100;
            branchPercentage = Math.max(0, Math.min(branchPercentage, 100)); // Clamp between 0 and 100
            
            // Apply to the branch height
            timelineBranch.style.height = `${branchPercentage}%`;

            // Trigger individual timeline items based on the branch height
            timelineItems.forEach((item) => {
                const itemRect = item.getBoundingClientRect();
                // If the trigger point has reached the vertical center of the card
                if (itemRect.top + (itemRect.height / 2) < triggerPoint) {
                    item.classList.add('active');
                } else {
                    // Optional: remove class to animate out when scrolling back up
                    // item.classList.remove('active'); 
                }
            });
        };

        // Throttle for performance
        let isTicking = false;
        window.addEventListener('scroll', () => {
            if (!isTicking) {
                window.requestAnimationFrame(() => {
                    drawTimelineOnScroll();
                    isTicking = false;
                });
                isTicking = true;
            }
        });
        
        // Initial setup check
        drawTimelineOnScroll();
    }
});
