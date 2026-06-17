/* ==========================================================================
   SQUISH SQUASH STUDIOS - INTERACTION & EXPERIENCE SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Mobile Navigation & Hamburger Menu
       ========================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a navigation item is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside header boundaries
        document.addEventListener('click', (event) => {
            const isClickInsideHeader = event.target.closest('.site-header');
            if (!isClickInsideHeader && navMenu.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }


    /* ==========================================
       2. Smooth Scrolling for Navigation
       ========================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.site-header').offsetHeight || 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    /* ==========================================
       3. Interactive Accordion (FAQs)
       ========================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const panel = item.querySelector('.faq-panel');

        if (trigger && panel) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other accordion items (optional for clean single-expanded flow)
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
                        otherItem.querySelector('.faq-panel').style.maxHeight = null;
                    }
                });

                // Toggle active state for current accordion item
                item.classList.toggle('active', !isActive);
                trigger.setAttribute('aria-expanded', !isActive);

                if (!isActive) {
                    panel.style.maxHeight = panel.scrollHeight + 'px';
                } else {
                    panel.style.maxHeight = null;
                }
            });
        }
    });


    /* ==========================================
       4. Premium Gallery Lightbox Modal
       ========================================== */
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentPhotoIndex = 0;
    const galleryPhotos = [];

    // Harvest photo URLs and alt details
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-img');
        if (img) {
            galleryPhotos.push({
                src: img.src,
                alt: img.alt
            });

            item.addEventListener('click', () => {
                currentPhotoIndex = index;
                openLightbox();
            });
        }
    });

    function openLightbox() {
        if (!lightboxModal) return;
        updateLightboxContent();
        lightboxModal.classList.add('show');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop page scrolling
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('show');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Resume page scrolling
    }

    function updateLightboxContent() {
        if (!lightboxImg || !lightboxCaption) return;
        const activePhoto = galleryPhotos[currentPhotoIndex];
        if (activePhoto) {
            lightboxImg.src = activePhoto.src;
            lightboxImg.alt = activePhoto.alt;
            lightboxCaption.textContent = activePhoto.alt;
        }
    }

    function showNextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % galleryPhotos.length;
        updateLightboxContent();
    }

    function showPrevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + galleryPhotos.length) % galleryPhotos.length;
        updateLightboxContent();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextPhoto);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevPhoto);

    // Close lightbox on clicking dark overlay background
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Keyboard support (Escape, Left, Right)
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('show')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextPhoto();
        } else if (e.key === 'ArrowLeft') {
            showPrevPhoto();
        }
    });


    /* ==========================================
       5. Interactive Booking Form Controller
       ========================================== */
    const bookingForm = document.getElementById('bookingForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            // Check form validity before submission
            if (!bookingForm.checkValidity()) {
                e.preventDefault();
                return;
            }

            // Web3Forms provides a static API where we can capture the standard post,
            // but we can also submit asynchronously for a seamless user experience!
            // Let's hook the submit asynchronously so the parent doesn't leave the page!
            e.preventDefault();

            const formData = new FormData(bookingForm);
            const submitButton = bookingForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Submitting Booking Request... ⏳';

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status == 200) {
                        // Success! Playful custom feedback card
                        showBookingFeedback(true, 'Hurrah! 🎉 Your booking request has been sent! We will WhatsApp or email you within 24 hours to secure your spot.');
                        bookingForm.reset();
                    } else {
                        console.log(response);
                        showBookingFeedback(false, json.message || 'Oops! 😔 Something went wrong. Please try again or click the WhatsApp button to chat directly!');
                    }
                })
                .catch(error => {
                    console.log(error);
                    showBookingFeedback(false, 'Connection error. 🌐 Please try again or click the WhatsApp button to contact us directly!');
                })
                .then(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                });
        });
    }

    function showBookingFeedback(isSuccess, messageText) {
        // Find or create an alert overlay card
        let alertBox = document.getElementById('bookingAlert');
        if (!alertBox) {
            alertBox = document.createElement('div');
            alertBox.id = 'bookingAlert';
            alertBox.style.position = 'fixed';
            alertBox.style.bottom = '40px';
            alertBox.style.left = '50%';
            alertBox.style.transform = 'translateX(-50%)';
            alertBox.style.padding = '20px 30px';
            alertBox.style.borderRadius = '16px';
            alertBox.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            alertBox.style.zIndex = '9999';
            alertBox.style.fontFamily = "'Fredoka', sans-serif";
            alertBox.style.fontWeight = '500';
            alertBox.style.maxWidth = '90%';
            alertBox.style.textAlign = 'center';
            alertBox.style.transition = 'all 0.3s ease';
            document.body.appendChild(alertBox);
        }

        alertBox.style.backgroundColor = isSuccess ? 'var(--color-green-light)' : 'var(--color-pink-light)';
        alertBox.style.color = isSuccess ? 'var(--color-green-primary)' : 'var(--color-pink-primary)';
        alertBox.style.border = `2px solid ${isSuccess ? 'var(--color-green-primary)' : 'var(--color-pink-primary)'}`;
        alertBox.textContent = messageText;

        // Animated entrance
        alertBox.style.opacity = '1';
        alertBox.style.transform = 'translateX(-50%) translateY(0)';

        // Auto-dismiss after 6 seconds
        setTimeout(() => {
            alertBox.style.opacity = '0';
            alertBox.style.transform = 'translateX(-50%) translateY(20px)';
        }, 6000);
    }


    /* ==========================================
       6. Premium Leaflet Map Initialization
       ========================================== */
    const mapContainer = document.getElementById('map');
    if (mapContainer && typeof L !== 'undefined') {
        // Precise coordinates for 56 Plataan Road, Durbanville, Cape Town
        const durbanvilleCoords = [-33.8341, 18.6492];

        // Initialize leaflet map with disabled scroll-wheel zoom to keep viewport scrolling fluid
        const map = L.map('map', {
            scrollWheelZoom: false
        }).setView(durbanvilleCoords, 16);

        // Standard OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add studio marker pin and auto-open popup
        L.marker(durbanvilleCoords).addTo(map)
            .bindPopup(`
                <div style="font-family: 'Fredoka', sans-serif; text-align: center; padding: 4px 2px;">
                    <h4 style="color: hsl(330, 85%, 60%); margin-bottom: 5px; font-size: 1.1rem;">Squish Squash Studios 🎨</h4>
                    <p style="font-size: 0.85rem; margin: 0; color: #475569; font-weight: 500;">56 Plataan Road, Durbanville</p>
                </div>
            `)
            .openPopup();
    }
});

// ================================
// EMAILJS BOOKING FORM
// ================================

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitButton = bookingForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML = "Sending... ⏳";

        try {
            const response = await emailjs.sendForm(
                "YOUR_SERVICE_ID",
                "YOUR_TEMPLATE_ID",
                bookingForm
            );

            console.log("SUCCESS!", response.status, response.text);

            alert("🎉 Booking request sent successfully! We'll contact you soon.");

            bookingForm.reset();
        } catch (error) {
            console.error("FAILED...", error);

            alert("❌ Sorry, something went wrong. Please try again or WhatsApp us directly.");
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}