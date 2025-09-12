// DOM Elements
const bookingModal = document.getElementById('bookingModal');
const bookingForm = document.getElementById('bookingForm');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Lenis Scroll Instance
let lenis;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeLenisScroll();
    initializeCalendar();
    initializeFormValidation();
    initializeNavigation();
    initializeAnimations();
});

// Lenis Scroll Initialization
function initializeLenisScroll() {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Animation frame for Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Lenis scroll event for animations
    lenis.on('scroll', (e) => {
        // Update navbar on scroll
        updateNavbarOnScroll(e.scroll);
        
        // Trigger scroll animations
        triggerScrollAnimations();
    });

    // Stop Lenis when modal is open
    const originalOpenModal = openBookingModal;
    window.openBookingModal = function() {
        lenis.stop();
        originalOpenModal();
    };

    const originalCloseModal = closeBookingModal;
    window.closeBookingModal = function() {
        lenis.start();
        originalCloseModal();
    };
}

// Modal Functions
function openBookingModal() {
    bookingModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Stop Lenis scrolling
    if (lenis) {
        lenis.stop();
    }
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('eventDate').min = today;
}

function closeBookingModal() {
    bookingModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    bookingForm.reset();
    
    // Restart Lenis scrolling
    if (lenis) {
        lenis.start();
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === bookingModal) {
        closeBookingModal();
    }
});

// Package Selection
function selectPackage(packageType) {
    const packageSelect = document.getElementById('package');
    
    switch(packageType) {
        case 'caviar-stroll':
            packageSelect.value = 'caviar-stroll';
            break;
        case 'caviar-indulgence':
            packageSelect.value = 'caviar-indulgence';
            break;
        case 'custom-event':
            packageSelect.value = 'custom-event';
            break;
    }
    
    openBookingModal();
}

// Smooth Scrolling with Lenis
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section && lenis) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        lenis.scrollTo(offsetTop, {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
    }
}

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    hamburger?.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    
    // Navbar scroll effect is now handled by Lenis scroll event
}

// Calendar Functions
function initializeCalendar() {
    const eventDateInput = document.getElementById('eventDate');
    
    if (eventDateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        eventDateInput.min = today;
        
        // Disable past dates
        eventDateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                alert('Bitte wählen Sie ein Datum in der Zukunft.');
                this.value = '';
            }
        });
    }
}

// Form Validation and Submission
function initializeFormValidation() {
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitBookingForm();
            }
        });
    }
    
    // Real-time validation
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateForm() {
    let isValid = true;
    const requiredFields = bookingForm.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Additional validations
    const email = document.getElementById('email');
    if (email && email.value && !isValidEmail(email.value)) {
        showFieldError(email, 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        isValid = false;
    }
    
    const phone = document.getElementById('phone');
    if (phone && phone.value && !isValidPhone(phone.value)) {
        showFieldError(phone, 'Bitte geben Sie eine gültige Telefonnummer ein.');
        isValid = false;
    }
    
    const guestCount = document.getElementById('guestCount');
    if (guestCount && guestCount.value && parseInt(guestCount.value) < 10) {
        showFieldError(guestCount, 'Mindestens 10 Gäste erforderlich.');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Dieses Feld ist erforderlich.');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e74c3c';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.9rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Form Submission
async function submitBookingForm() {
    const submitButton = bookingForm.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<div class="loading"></div> Wird gesendet...';
    submitButton.disabled = true;
    
    try {
        // Collect form data
        const formData = new FormData(bookingForm);
        const bookingData = Object.fromEntries(formData.entries());
        
        // Add timestamp
        bookingData.timestamp = new Date().toISOString();
        
        // Simulate API call (replace with actual endpoint)
        await simulateApiCall(bookingData);
        
        // Show success message
        showSuccessMessage();
        
        // Close modal after delay
        setTimeout(() => {
            closeBookingModal();
        }, 2000);
        
    } catch (error) {
        console.error('Booking submission error:', error);
        showErrorMessage('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.');
    } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Simulate API call (replace with actual implementation)
async function simulateApiCall(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Log the booking data (in production, send to server)
            console.log('Booking Data:', data);
            
            // Simulate success (90% success rate for demo)
            if (Math.random() > 0.1) {
                resolve({ success: true, bookingId: 'LC' + Date.now() });
            } else {
                reject(new Error('Simulation error'));
            }
        }, 2000);
    });
}

function showSuccessMessage() {
    const modalBody = document.querySelector('.modal-body');
    modalBody.innerHTML = `
        <div class="success-message" style="text-align: center; padding: 2rem;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--primary-gold), var(--accent-gold)); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: white; font-size: 2rem;">
                <i class="fas fa-check"></i>
            </div>
            <h3 style="color: var(--primary-gold); margin-bottom: 1rem;">Buchungsanfrage Gesendet!</h3>
            <p style="color: var(--text-light); margin-bottom: 1rem;">
                Vielen Dank für Ihr Interesse an Luna Caviar. Wir haben Ihre Buchungsanfrage erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.
            </p>
            <p style="color: var(--text-light); font-size: 0.9rem;">
                Dieses Fenster schließt sich automatisch...
            </p>
        </div>
    `;
}

function showErrorMessage(message) {
    const modalBody = document.querySelector('.modal-body');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: #fee;
        border: 1px solid #fcc;
        color: #c66;
        padding: 1rem;
        border-radius: 10px;
        margin-bottom: 1rem;
        text-align: center;
    `;
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle" style="margin-right: 0.5rem;"></i>
        ${message}
    `;
    
    modalBody.insertBefore(errorDiv, modalBody.firstChild);
    
    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Navbar Update Function
function updateNavbarOnScroll(scrollY) {
    const navbar = document.querySelector('.navbar');
    if (scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Scroll Animations Trigger
function triggerScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const animatedTitles = document.querySelectorAll('.animated-title');
    
    // Regular scroll animations
    animateElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible && !el.classList.contains('animate-in')) {
            el.classList.add('animate-in');
        } else if (!isVisible && el.classList.contains('animate-in')) {
            el.classList.remove('animate-in');
        }
    });
    
    // Stripe animation for titles with enter/exit logic
    animatedTitles.forEach(title => {
        const rect = title.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.7 && rect.bottom > 0;
        
        if (isVisible && !title.classList.contains('animate-in')) {
            // Entering viewport - show stripe
            title.classList.remove('animate-out');
            title.classList.add('animate-in');
        } else if (!isVisible && title.classList.contains('animate-in')) {
            // Leaving viewport - hide stripe
            title.classList.remove('animate-in');
            title.classList.add('animate-out');
        }
    });
}

// Animation Functions
function initializeAnimations() {
    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.service-card, .feature-item, .stat-item, .contact-item');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    // Initial animation check
    triggerScrollAnimations();
    
    // Parallax effect for hero logo
    initializeParallaxEffects();
}

// Parallax Effects
function initializeParallaxEffects() {
    if (lenis) {
        lenis.on('scroll', (e) => {
            const caviarContainer = document.querySelector('.caviar-container');
            
            if (caviarContainer) {
                const scrollProgress = e.scroll / (document.documentElement.scrollHeight - window.innerHeight);
                const translateY = scrollProgress * 30;
                
                // Kaviar-Container bewegt sich subtil
                caviarContainer.style.transform = `translateY(${translateY * 0.3}px)`;
            }
        });
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

// Package Price Calculator
function calculatePackagePrice(packageType, guestCount, duration) {
    const basePrices = {
        'caviar-stroll': 3000,
        'caviar-indulgence': 5000,
        'custom-event': 0 // Quote based
    };
    
    let basePrice = basePrices[packageType] || 0;
    
    // Add guest count multiplier for large events
    if (guestCount > 50) {
        basePrice *= 1.2;
    } else if (guestCount > 100) {
        basePrice *= 1.5;
    }
    
    return basePrice;
}

// Social Media Integration
function shareOnSocialMedia(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Luna Caviar - Der Moment, in dem Luxus serviert wird');
    
    let shareUrl;
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'instagram':
            // Instagram doesn't support direct URL sharing
            navigator.clipboard.writeText(window.location.href);
            alert('Link wurde in die Zwischenablage kopiert. Teilen Sie ihn in Ihrer Instagram Story!');
            return;
        default:
            return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

// Contact Form (if needed)
function sendContactMessage(formData) {
    // Implementation for contact form submission
    console.log('Contact form data:', formData);
}

// Newsletter Subscription (if needed)
function subscribeNewsletter(email) {
    // Implementation for newsletter subscription
    console.log('Newsletter subscription:', email);
}

// Performance Optimization
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Service Worker Registration (for PWA functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        isValidEmail,
        isValidPhone,
        calculatePackagePrice,
        formatCurrency,
        formatDate
    };
}
