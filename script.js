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
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, { send_page_view: true });
}

document.addEventListener('DOMContentLoaded', () => {
    initGoogleAnalytics();
    initMiniMapBadge();
    protectUntranslatableElements();
    initLanguageSelector();
    loadGoogleTranslateScript();
    initPDFAnalyticsTracking();
    initInvestorQueryForm();

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
        // India geographical boundary
        const indiaBounds = L.latLngBounds(
            L.latLng(7.5, 68.0),  // South-West (Kanyakumari / Gujarat)
            L.latLng(35.5, 96.5)  // North-East (Kashmir / Arunachal)
        );

        // Initialize the map framed strictly on India
        const map = L.map('bkm-map', {
            zoomControl: false,
            scrollWheelZoom: false,
            minZoom: 4.8,
            maxZoom: 18,
            maxBounds: L.latLngBounds(L.latLng(5.0, 62.0), L.latLng(38.0, 102.0)),
            maxBoundsViscosity: 1.0
        }).fitBounds(indiaBounds, { padding: [10, 10] });

        // Clean, minimalist Light Gray map layer without terrain or visual clutter (100% free, no API key required)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            attribution: '&copy; <a href="https://www.esri.com/">Esri</a>, DeLorme, NAVTEQ',
            maxZoom: 16
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

            // Loop through all tracks and update them
            // We duplicate the items so the CSS seamless scrolling works perfectly without breaking
            announcementTracks.forEach(track => {
                track.innerHTML = ''; // Clear existing fallback content

                // We create the elements twice for the seamless scrolling effect
                for (let i = 0; i < 2; i++) {
                    topNews.forEach(item => {
                        const span = document.createElement('span');
                        span.className = 'announcement-item';

                        const strong = document.createElement('strong');
                        strong.textContent = 'LIVE NEWS';
                        span.appendChild(strong);
                        span.appendChild(document.createTextNode(': '));

                        const a = document.createElement('a');
                        a.href = item.link;
                        a.target = '_blank';
                        a.style.color = 'inherit';
                        a.style.textDecoration = 'underline';
                        a.textContent = item.title;
                        span.appendChild(a);

                        track.appendChild(span);
                    });
                }
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
            const targetSection = document.getElementById('presence');
            if (targetSection && (isHomePage || window.location.pathname.includes('index.html'))) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = 'index.html#presence';
            }
        });

        hr.insertBefore(mapBadge, getInTouchBtn);
    });
}

// ==========================================
// UNTRANSLATABLE ELEMENTS PROTECTION
// ==========================================
function protectUntranslatableElements() {
    // Protect stock tickers and company logos from translation
    document.querySelectorAll('.ticker-label, .logo, .stock-ticker').forEach(el => {
        el.classList.add('notranslate');
        el.setAttribute('translate', 'no');
    });

    // Protect specific metric numbers (e.g., ISO 9001, 25mm - 31.5mm, 1.8 Billion+)
    document.querySelectorAll('.biz-metric-num').forEach(el => {
        const text = el.textContent || '';
        if (text.includes('ISO') || text.includes('mm') || text.includes('Billion') || text.includes('%') || text.includes('PSI')) {
            el.classList.add('notranslate');
            el.setAttribute('translate', 'no');
        }
    });

    // Wrap inline "ISO" and "ISO 9001" occurrences in a notranslate span
    document.querySelectorAll('p, td, li, h1, h2, h3, h4, span').forEach(el => {
        if (el.classList.contains('notranslate') || el.closest('.notranslate') || el.children.length > 0) return;
        const text = el.innerHTML;
        if (/\bISO(?:\s*\d+)?\b/i.test(text) && !text.includes('class="notranslate"')) {
            el.innerHTML = text.replace(/\b(ISO(?:\s*\d+)?)\b/gi, '<span class="notranslate" translate="no">$1</span>');
        }
    });
}

// ==========================================
// DYNAMIC LANGUAGE SELECTOR (ENGLISH & HINDI)
// ==========================================
function initLanguageSelector() {
    const langSelectors = document.querySelectorAll('.lang-selector');
    if (langSelectors.length === 0) return;

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const currentLang = getCookie('googtrans')?.includes('/hi') ? 'hi' : 'en';

    langSelectors.forEach(selector => {
        selector.style.position = 'relative';
        selector.style.cursor = 'pointer';
        selector.innerHTML = `
            <i class="fas fa-globe"></i> <span>${currentLang === 'hi' ? 'हिंदी' : 'English'}</span> <i class="fas fa-chevron-down"></i>
            <div class="lang-dropdown" style="display: none; position: absolute; top: 100%; right: 0; background: #0b112c; border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); z-index: 9999; margin-top: 5px; min-width: 130px; overflow: hidden;">
                <div class="lang-option ${currentLang === 'en' ? 'active' : ''}" data-lang="en" style="padding: 8px 16px; color: #fff; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; transition: background 0.2s;">
                    <span>English</span>
                </div>
                <div class="lang-option ${currentLang === 'hi' ? 'active' : ''}" data-lang="hi" style="padding: 8px 16px; color: #fff; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; transition: background 0.2s;">
                    <span>हिंदी (Hindi)</span>
                </div>
            </div>
        `;

        const dropdown = selector.querySelector('.lang-dropdown');
        selector.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        const options = selector.querySelectorAll('.lang-option');
        options.forEach(opt => {
            opt.addEventListener('click', (e) => {
                e.stopPropagation();
                const selectedLang = opt.getAttribute('data-lang');
                if (selectedLang === 'hi') {
                    document.cookie = "googtrans=/en/hi; path=/;";
                    document.cookie = "googtrans=/en/hi; path=/; domain=" + window.location.hostname;
                } else {
                    document.cookie = "googtrans=/en/en; path=/;";
                    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
                }
                location.reload();
            });

            opt.addEventListener('mouseenter', () => {
                opt.style.background = 'rgba(59, 130, 246, 0.25)';
            });
            opt.addEventListener('mouseleave', () => {
                opt.style.background = 'transparent';
            });
        });
    });

    document.addEventListener('click', () => {
        document.querySelectorAll('.lang-dropdown').forEach(d => d.style.display = 'none');
    });
}

function loadGoogleTranslateScript() {
    if (document.getElementById('google-translate-script')) return;

    const gtContainer = document.createElement('div');
    gtContainer.id = 'google_translate_element';
    gtContainer.style.display = 'none';
    document.body.appendChild(gtContainer);

    window.googleTranslateElementInit = function () {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false
        }, 'google_translate_element');
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
}

// ==========================================
// AUTOMATIC PDF, LEAD & CONTACT GA4 TRACKING
// ==========================================
function initPDFAnalyticsTracking() {
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a');
        if (!link) return;
        const href = link.getAttribute('href') || '';
        const onclick = link.getAttribute('onclick') || '';
        const text = link.innerText ? link.innerText.trim() : '';

        // 1. PDF Download & Preview Tracking
        let pdfName = '';
        if (href.toLowerCase().endsWith('.pdf')) {
            pdfName = href.split('/').pop();
        } else if (onclick.includes('previewPDF')) {
            const match = onclick.match(/previewPDF\(['"](.*?)['"]\)/);
            if (match && match[1]) {
                pdfName = match[1].split('/').pop();
            }
        }

        if (pdfName && typeof window.gtag === 'function') {
            window.gtag('event', 'file_download', {
                'file_name': decodeURIComponent(pdfName),
                'file_extension': 'pdf',
                'link_url': href || 'modal_preview',
                'page_location': window.location.href
            });
        }

        // 2. "Get In Touch" Lead Button Tracking
        if (text.toLowerCase().includes('get in touch') || link.classList.contains('btn-header')) {
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'generate_lead', {
                    'lead_type': 'Get In Touch Button',
                    'link_url': href,
                    'page_location': window.location.href
                });
            }
        }

        // 3. Email Contact Link Tracking (mailto:)
        if (href.startsWith('mailto:')) {
            const emailAddr = href.replace('mailto:', '');
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'contact_email_click', {
                    'email_address': emailAddr,
                    'page_location': window.location.href
                });
                window.gtag('event', 'generate_lead', {
                    'lead_type': 'Email Contact',
                    'email_address': emailAddr,
                    'page_location': window.location.href
                });
            }
        }

        // 4. Phone Call Contact Link Tracking (tel:)
        if (href.startsWith('tel:')) {
            const phoneNum = href.replace('tel:', '');
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'contact_phone_click', {
                    'phone_number': phoneNum,
                    'page_location': window.location.href
                });
                window.gtag('event', 'generate_lead', {
                    'lead_type': 'Phone Contact',
                    'phone_number': phoneNum,
                    'page_location': window.location.href
                });
            }
        }
    });

    // 5. Contact Form Submission Tracking
    document.addEventListener('submit', function (e) {
        const form = e.target;
        if (form && typeof window.gtag === 'function') {
            window.gtag('event', 'generate_lead', {
                'lead_type': 'Contact Form Submission',
                'form_id': form.id || 'contact_form',
                'page_location': window.location.href
            });
            window.gtag('event', 'form_submission', {
                'form_id': form.id || 'contact_form',
                'page_location': window.location.href
            });
        }
    });
}

// ==========================================
// PRECISE SMOOTH SCROLL & CAREER SELECTION FOR #CONTACT
// ==========================================
function scrollToContact() {
    const contactElem = document.getElementById('contact');
    if (contactElem) {
        contactElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function selectCareerCategoryAndScroll(e) {
    if (e && e.preventDefault) {
        e.preventDefault();
    }
    const catSelect = document.getElementById('queryCategory');
    if (catSelect) {
        catSelect.value = 'Career Query';
        catSelect.dispatchEvent(new Event('change'));
    }
    scrollToContact();
    if (window.history && window.history.pushState) {
        window.history.pushState(null, null, '#contact');
    }
    setTimeout(() => {
        if (catSelect) {
            catSelect.focus();
            catSelect.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
            catSelect.style.borderColor = 'var(--secondary-color, #1365C4)';
            catSelect.style.boxShadow = '0 0 0 4px rgba(19, 101, 196, 0.3)';
            setTimeout(() => {
                catSelect.style.borderColor = '';
                catSelect.style.boxShadow = '';
            }, 2000);
        }
    }, 450);
}

document.addEventListener('DOMContentLoaded', () => {
    // Dynamic placeholder on category change
    const catSelect = document.getElementById('queryCategory');
    const msgTextarea = document.getElementById('queryMessage');
    if (catSelect && msgTextarea) {
        catSelect.addEventListener('change', () => {
            if (catSelect.value === 'Career Query') {
                msgTextarea.placeholder = 'Please mention your background, role of interest, qualification, or career inquiry...';
            } else {
                msgTextarea.placeholder = 'Please state your inquiry...';
            }
        });
    }

    // Handle in-page links to #contact
    document.querySelectorAll('a[href$="#contact"], a[href*="#contact"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
            const isCareerBtn = this.id === 'btnExploreCareers' || this.textContent.trim().toLowerCase().includes('explore career');
            
            if (isHome && (href === '#contact' || href.endsWith('/#contact') || href.endsWith('index.html#contact'))) {
                e.preventDefault();
                if (isCareerBtn) {
                    selectCareerCategoryAndScroll(e);
                } else {
                    scrollToContact();
                    if (window.history && window.history.pushState) {
                        window.history.pushState(null, null, '#contact');
                    }
                }
            }
        });
    });

    // Handle initial direct load with #contact or career hash
    if (window.location.hash === '#contact-careers' || window.location.hash.includes('career')) {
        setTimeout(() => selectCareerCategoryAndScroll(), 300);
    } else if (window.location.hash === '#contact') {
        setTimeout(scrollToContact, 300);
    }
});

// ==========================================
// CLIENT-SIDE SANITIZATION & SECURITY UTILITIES
// ==========================================
function escapeClientHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}

function sanitizeClientInput(str, maxLength = 255) {
    if (typeof str !== 'string') return '';
    // Strip control characters & null bytes (prevent injection attacks)
    const cleaned = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
    return cleaned.slice(0, maxLength);
}

// ==========================================
// INVESTOR QUERY FORM SUBMISSION TO JSON FILE
// ==========================================
function initInvestorQueryForm() {
    const form = document.getElementById('investorQueryForm');
    if (!form) return;

    const submitBtn = document.getElementById('btnSubmitQuery') || form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const fullNameInput = document.getElementById('queryFullName') || form.querySelector('input[name="fullName"]');
        const emailInput = document.getElementById('queryEmail') || form.querySelector('input[name="email"]');
        const folioInput = document.getElementById('queryFolio') || form.querySelector('input[name="folioNo"]');
        const categoryInput = document.getElementById('queryCategory') || form.querySelector('select[name="category"]');
        const messageInput = document.getElementById('queryMessage') || form.querySelector('textarea[name="message"]');

        const fullName = sanitizeClientInput(fullNameInput ? fullNameInput.value : '', 100);
        const email = sanitizeClientInput(emailInput ? emailInput.value : '', 254);
        const folioNo = sanitizeClientInput(folioInput ? folioInput.value : '', 50);
        const rawCategory = sanitizeClientInput(categoryInput ? categoryInput.value : '', 100);
        const message = sanitizeClientInput(messageInput ? messageInput.value : '', 2000);

        const allowedCategories = [
            'Dividend Query',
            'Demat / Share Transfer',
            'Financial Results & Reports',
            'Institutional Investor Inquiry',
            'Career Query',
            'Other Inquiry',
            'General Inquiry'
        ];
        const category = allowedCategories.includes(rawCategory) ? rawCategory : 'General Inquiry';

        if (!fullName || fullName.length < 2) {
            alert('Please enter a valid Full Name (minimum 2 characters).');
            if (fullNameInput) fullNameInput.focus();
            return;
        }

        const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        if (!email || !emailPattern.test(email)) {
            alert('Please enter a valid email address (e.g., name@domain.com).');
            if (emailInput) emailInput.focus();
            return;
        }

        if (!message || message.length < 5) {
            alert('Please enter a message containing at least 5 characters.');
            if (messageInput) messageInput.focus();
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
        }

        const payload = {
            fullName,
            email,
            folioNo,
            category,
            message
        };

        // Post to server with JSON Content-Type
        let serverSuccess = false;
        try {
            const res = await fetch('/api/investor-query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                serverSuccess = true;
            } else if (res.status === 429) {
                alert('Too many requests submitted. Please wait a minute before submitting again.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Investor Query';
                }
                return;
            }
        } catch (err) {
            // Local fallback if accessed via file:// or offline
        }

        // Persist sanitized & escaped record in localStorage
        try {
            const queryRecord = {
                query: {
                    fullName: escapeClientHtml(fullName),
                    email: escapeClientHtml(email),
                    folioNo: escapeClientHtml(folioNo),
                    category: escapeClientHtml(category),
                    message: escapeClientHtml(message),
                    time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', timeZoneName: 'short' })
                }
            };
            const existing = JSON.parse(localStorage.getItem('investor_queries') || '[]');
            const list = Array.isArray(existing) ? existing : [];
            list.unshift(queryRecord);
            // Cap at 100 entries in localStorage
            if (list.length > 100) list.length = 100;
            localStorage.setItem('investor_queries', JSON.stringify(list, null, 2));
        } catch (storageErr) {
            // Non-blocking
        }

        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Investor Query';
        }

        // Show inline confirmation message
        const successBox = document.getElementById('querySuccessAlert');
        if (successBox) {
            successBox.style.display = 'flex';
            setTimeout(() => {
                successBox.style.display = 'none';
            }, 6000);
        }

        form.reset();
    });
}
