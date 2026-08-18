/* ==========================================
   0. GOOGLE ANALYTICS 4 DYNAMIC INITIALIZATION
   ========================================== */
const GA_MEASUREMENT_ID = 'G-DGTRKZ3N9X';

function initGoogleAnalytics() {
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID.trim() === '') return;

    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { send_page_view: true });
}

document.addEventListener('DOMContentLoaded', () => {
    initGoogleAnalytics();
    initMiniMapBadge();
    
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

// Scroll to Top functionality
const scrollToTopBtn = document.getElementById("scrollToTop");
if (scrollToTopBtn) {
    window.addEventListener("scroll", () => {
        const halfPageScroll = (document.documentElement.scrollHeight - window.innerHeight) / 2;
        if (window.scrollY > halfPageScroll) {
            scrollToTopBtn.classList.add("show");
        } else {
            scrollToTopBtn.classList.remove("show");
        }
    });

    scrollToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ==========================================
// LIVE RSS ANNOUNCEMENTS (METHOD 2)
// ==========================================
async function fetchAnnouncements() {
    // Find all announcement scroll containers (in case there are multiple or we are on a different page)
    const announcementTracks = document.querySelectorAll('.announcement-scroll');
    if (announcementTracks.length === 0) return;

    // We are using Moneycontrol's Business News RSS feed as a free, reliable proxy to demonstrate this.
    // In production, replace this URL with the specific RSS feed for BKM Industries.
    const rssFeedUrl = 'https://www.moneycontrol.com/rss/business.xml';
    
    // rss2json is a free API that converts XML RSS feeds into easy-to-use JSON
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssFeedUrl)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.status === 'ok' && data.items.length > 0) {
            // Get the latest 4 news items
            const topNews = data.items.slice(0, 4);
            
            let htmlContent = '';
            topNews.forEach(item => {
                // Clean up title and add a link
                htmlContent += `<span class="announcement-item"><strong>LIVE NEWS</strong>: <a href="${item.link}" target="_blank" style="color:inherit; text-decoration:underline;">${item.title}</a></span>`;
            });
            
            // Loop through all tracks and update them
            // We duplicate the htmlContent so the CSS seamless scrolling works perfectly without breaking
            announcementTracks.forEach(track => {
                track.innerHTML = htmlContent + htmlContent;
            });
        }
    } catch (error) {
        console.error("Failed to fetch live announcements:", error);
        // If it fails, the website just silently falls back to the hardcoded HTML announcements.
    }
}

// Initialize the fetch when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    fetchAnnouncements();
});

// ==========================================
// MINI MAP GRAPHIC BADGE (MUMBAI • SILVASSA • KOLKATA)
// ==========================================
function initMiniMapBadge() {
    const headerRights = document.querySelectorAll('.header-right');
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/') || window.location.pathname === '';

    headerRights.forEach(hr => {
        if (hr.querySelector('.mini-map-badge')) return; // Avoid duplicate insertion

        const getInTouchBtn = hr.querySelector('.btn-header');
        if (!getInTouchBtn) return;

        const mapBadge = document.createElement('div');
        mapBadge.className = 'mini-map-badge notranslate';
        mapBadge.setAttribute('translate', 'no');
        mapBadge.innerHTML = `
            <svg viewBox="0 0 612 696" class="india-mini-svg">
                <defs>
                    <linearGradient id="mapBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#0b112c"/>
                        <stop offset="100%" stop-color="#16204d"/>
                    </linearGradient>
                </defs>

                <!-- Background Base Card -->
                <rect width="612" height="696" rx="80" fill="url(#mapBgGrad)"/>

                <!-- Exact Official India Map (assets/india_map.svg) Background -->
                <image href="assets/india_map.svg" width="580" height="660" x="16" y="18" opacity="0.75" style="filter: brightness(0) invert(1);"/>
            </svg>

            <div class="map-network-tooltip">
                <span>Mumbai</span> • <span>Silvassa</span> • <span>Kolkata</span>
            </div>
        `;

        // Click handler to smooth scroll to map section on home page
        mapBadge.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = document.getElementById('contact');
            if (targetSection && (isHomePage || window.location.pathname.includes('index.html'))) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = 'index.html#contact';
            }
        });

        hr.insertBefore(mapBadge, getInTouchBtn);
    });
}
