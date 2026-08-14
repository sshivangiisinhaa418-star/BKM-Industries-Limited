/* ==========================================================================
   BKM Industries Limited - Premium Corporate Interactions Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. HEADER SCROLL EFFECT
    // ==========================================
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 10px 30px rgba(13, 13, 57, 0.1)';
        } else {
            header.style.padding = '18px 0';
            header.style.boxShadow = '0 2px 4px rgba(13, 13, 57, 0.05)';
        }
    });

    // ==========================================
    // 2. MOBILE MENU DRAWER
    // ==========================================
    const mobileToggle = document.getElementById('mobileToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileToggle && mobileMenu) {
        const toggleIcon = mobileToggle.querySelector('i');

        mobileToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const isOpen = mobileMenu.classList.contains('open');
            
            // Swap hamburger and times icon
            if (isOpen) {
                toggleIcon.classList.remove('fa-bars');
                toggleIcon.classList.add('fa-times');
            } else {
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            });
        });
    }

    // ==========================================
    // 3. HERO SLIDER LOGIC
    // ==========================================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    let currentSlide = 0;
    let slideInterval;
    const SLIDE_DURATION = 6000; // 6 seconds

    function showSlide(index) {
        // Reset active states
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Handle bounds
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;

        // Apply active states
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Auto cycle setup
    function startSlideShow() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }

    // Event listeners for arrows
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startSlideShow(); // Reset timer
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startSlideShow(); // Reset timer
        });
    }

    // Event listeners for dots
    if (dots.length > 0) {
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                showSlide(index);
                startSlideShow(); // Reset timer
            });
        });
    }

    // Initial Start
    if (slides.length > 0) {
        startSlideShow();
    }

    // ==========================================
    // 4. ANIMATED STATISTICS COUNTER
    // ==========================================
    const statsSection = document.querySelector('.overview-section');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function startCounting() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / target), 15);
            let current = 0;
            
            const timer = setInterval(() => {
                current += Math.ceil(target / (duration / stepTime));
                if (current >= target) {
                    stat.innerText = target + (target === 4 || target === 25 || target === 500 || target === 10 ? '+' : '');
                    clearInterval(timer);
                } else {
                    stat.innerText = current;
                }
            }, stepTime);
        });
    }

    // Trigger animations when the section enters viewport
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    startCounting();
                    animated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        if (statsSection) {
            observer.observe(statsSection);
        }
    } else if (statsSection) {
        // Fallback for older browsers
        window.addEventListener('scroll', () => {
            const rect = statsSection.getBoundingClientRect();
            const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
            if (!(rect.bottom < 0 || rect.top - viewHeight >= 0) && !animated) {
                startCounting();
                animated = true;
            }
        });
    }

    // ==========================================
    // 5. HERO PARALLAX & FADE EFFECT
    // ==========================================
    const heroSlider = document.getElementById('heroSlider');
    const heroContents = document.querySelectorAll('.slide-content');
    
    window.addEventListener('scroll', () => {
        if (!heroSlider) return;
        const scrollY = window.scrollY;
        
        // Only run if we are near the top (optimization)
        if (scrollY < window.innerHeight) {
            // Parallax the background slightly
            heroSlider.style.transform = `translateY(${scrollY * 0.4}px)`;
            
            // Fade and scale down the text content
            heroContents.forEach(content => {
                const opacity = Math.max(1 - (scrollY / 500), 0);
                const scale = Math.max(1 - (scrollY / 2000), 0.9);
                const translateY = scrollY * 0.2;
                content.style.opacity = opacity;
                content.style.transform = `translateY(${translateY}px) scale(${scale})`;
            });
        }
    });

    // ==========================================
    // 6. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    if ('IntersectionObserver' in window && revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: stop observing once revealed
                    // observer.unobserve(entry.target); 
                }
            });
        }, {
            root: null,
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback: immediately show all elements if IntersectionObserver is not supported
        revealElements.forEach(el => el.classList.add('visible'));
    }

});


// ----------------------------------------------------
// LEAFLET MAP INITIALIZATION
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('bkm-map');
    if (mapElement && typeof L !== 'undefined') {
        // Initialize the map centered on India
        const map = L.map('bkm-map', {
            zoomControl: false, // Keep it clean visually
            scrollWheelZoom: false // Prevent scrolling past the map from getting trapped
        }).setView([21.1458, 79.0882], 4.4); // Center of India

        // Add a clean, premium Light tile layer (CartoDB Positron) matching the aesthetic
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Define our custom pulsing icon HTML to preserve existing marker styling
        const createCustomIcon = (label) => {
            return L.divIcon({
                className: 'custom-leaflet-marker',
                html: `
                    <div class="leaflet-pin">
                        <div class="pulse-ring"></div>
                        <div class="pin-center"></div>
                        <div class="pin-label">${label}</div>
                    </div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10] // Center the icon precisely on the coordinate
            });
        };

        // Reusable locations array per Requirement 11
        const locations = [
            {
                name: 'Kolkata (HQ)',
                latitude: 22.5726,
                longitude: 88.3639
            },
            {
                name: 'Silvassa (Plant)',
                latitude: 20.2763,
                longitude: 73.0083
            },
            {
                name: 'Mumbai (Sales)',
                latitude: 19.0760,
                longitude: 72.8777
            }
        ];

        // Dynamically plot all markers using geographic coordinates (Y=lat, X=lng)
        locations.forEach(loc => {
            L.marker([loc.latitude, loc.longitude], { 
                icon: createCustomIcon(loc.name) 
            }).addTo(map);
        });
    }
});
