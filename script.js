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
    initializeTheme();
    initializeLanguage();
    initializeMobileNavbar();
    initializeMobileKaviarAnimation();
    initializeCounterAnimation();
});

// Initialize mobile navbar functionality
function initializeMobileNavbar() {
    // Reset navbar state on window resize
    window.addEventListener('resize', function() {
        const navbar = document.querySelector('.navbar');
        if (window.innerWidth > 768 && navbar) {
            // Reset navbar state on desktop
            navbar.classList.remove('hidden', 'visible');
        }
    });
    
    // Ensure navbar is visible on page load
    const navbar = document.querySelector('.navbar');
    if (navbar && window.innerWidth <= 768) {
        navbar.classList.add('visible');
    }
    
    // Add additional scroll listener for mobile navbar (backup)
    let ticking = false;
    function updateNavbarOnScrollEvent() {
        if (!ticking) {
            requestAnimationFrame(function() {
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;
                if (window.innerWidth <= 768) {
                    handleMobileNavbarVisibility(scrollY);
                }
                ticking = false;
            });
            ticking = true;
        }
    }
    
    // Listen to both wheel and touch events for better mobile support
    window.addEventListener('scroll', updateNavbarOnScrollEvent, { passive: true });
    window.addEventListener('wheel', updateNavbarOnScrollEvent, { passive: true });
    window.addEventListener('touchmove', updateNavbarOnScrollEvent, { passive: true });
    
    // Debug: Add test functions to window for manual testing
    window.testNavbarHide = function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.add('hidden');
            console.log('Navbar hidden manually');
        }
    };
    
    window.testNavbarShow = function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.classList.remove('hidden');
            navbar.classList.add('visible');
            console.log('Navbar shown manually');
        }
    };
    
    window.testScrollDetection = function() {
        console.log('Current scroll position:', window.pageYOffset);
        console.log('Window width:', window.innerWidth);
        console.log('Is mobile:', window.innerWidth <= 768);
        console.log('Lenis instance:', lenis);
    };
    
    window.simulateScroll = function(direction) {
        const currentScroll = window.pageYOffset;
        const newScroll = direction === 'down' ? currentScroll + 200 : Math.max(0, currentScroll - 200);
        window.scrollTo(0, newScroll);
        console.log('Simulated scroll to:', newScroll);
    };
    
    window.testKaviarAnimation = function() {
        const caviarContainer = document.querySelector('.caviar-container');
        if (caviarContainer) {
            caviarContainer.classList.toggle('animate-mobile');
            console.log('Kaviar animation toggled manually');
        }
    };
}

// Initialize mobile kaviar animation
function initializeMobileKaviarAnimation() {
    // Only run on mobile devices
    if (window.innerWidth > 768) return;
    
    const caviarContainer = document.querySelector('.caviar-container');
    if (!caviarContainer) return;
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Kaviar is in center of viewport - trigger animation
                caviarContainer.classList.add('animate-mobile');
                console.log('Kaviar animation triggered on mobile');
            } else {
                // Kaviar is out of viewport - remove animation
                caviarContainer.classList.remove('animate-mobile');
                console.log('Kaviar animation stopped on mobile');
            }
        });
    }, {
        // Trigger when element is 50% visible (center of screen)
        threshold: 0.5,
        // Add some margin to trigger earlier
        rootMargin: '0px 0px -20% 0px'
    });
    
    // Start observing the caviar container
    observer.observe(caviarContainer);
    
    // Re-initialize on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            // Re-observe on mobile
            observer.observe(caviarContainer);
        } else {
            // Stop observing on desktop
            observer.unobserve(caviarContainer);
            caviarContainer.classList.remove('animate-mobile');
        }
    });
}

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

// Mobile Navigation Functions
function initializeMobileNavigation() {
    // Initialize mobile menu
    initMobileNavigation();
    
    // Smooth scroll for desktop navigation
    document.querySelectorAll('.desktop-nav .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                const sectionId = href.substring(1);
                scrollToSection(sectionId);
            }
        });
    });
    
    // Smooth scroll for mobile navigation
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                const sectionId = href.substring(1);
                scrollToSection(sectionId);
            }
        });
    });
}

// Initialize mobile sidebar system
function initMobileNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
    const mobileSidebar = document.getElementById('mobileSidebar');
    
    if (!mobileMenuBtn || !mobileSidebarOverlay || !mobileSidebar) return;
    
    // ESC key to close sidebar
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSidebar.classList.contains('show')) {
            closeMobileMenu();
        }
    });
    
    // Click outside to close sidebar
    mobileSidebarOverlay.addEventListener('click', function(e) {
        if (e.target === mobileSidebarOverlay) {
            closeMobileMenu();
        }
    });
    
    // Prevent body scroll when sidebar is open
    const originalBodyOverflow = document.body.style.overflow;
}

// Toggle mobile sidebar
function toggleMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
    const mobileSidebar = document.getElementById('mobileSidebar');
    
    if (!mobileMenuBtn || !mobileSidebarOverlay || !mobileSidebar) return;
    
    if (mobileSidebar.classList.contains('show')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// Open mobile sidebar
function openMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
    const mobileSidebar = document.getElementById('mobileSidebar');
    
    if (!mobileMenuBtn || !mobileSidebarOverlay || !mobileSidebar) return;
    
    // Show navbar when opening mobile menu
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.remove('hidden');
        navbar.classList.add('visible');
    }
    
    // Add active classes
    mobileMenuBtn.classList.add('active');
    mobileSidebarOverlay.classList.add('show');
    mobileSidebar.classList.add('show');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Stop Lenis scrolling
    if (lenis) {
        lenis.stop();
    }
    
    // Update sidebar theme icon and language flag
    updateSidebarThemeIcon();
    updateSidebarLanguageFlag();
    
    // Add entrance animation to sidebar items
    animateSidebarItems();
}

// Close mobile sidebar
function closeMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileSidebarOverlay = document.getElementById('mobileSidebarOverlay');
    const mobileSidebar = document.getElementById('mobileSidebar');
    
    if (!mobileMenuBtn || !mobileSidebarOverlay || !mobileSidebar) return;
    
    // Remove active classes
    mobileMenuBtn.classList.remove('active');
    mobileSidebarOverlay.classList.remove('show');
    mobileSidebar.classList.remove('show');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Restart Lenis scrolling
    if (lenis) {
        lenis.start();
    }
}

// Handle sidebar link clicks with smooth scroll
function handleSidebarLinkClick(sectionId, event) {
    // Prevent default link behavior
    if (event) {
        event.preventDefault();
    }
    
    // Close menu first
    closeMobileMenu();
    
    // Wait for menu to close, then scroll smoothly
    setTimeout(() => {
        scrollToSection(sectionId);
    }, 500); // Longer delay to ensure menu is fully closed and Lenis is restarted
}

// Update sidebar theme icon
function updateSidebarThemeIcon() {
    const sidebarThemeIcon = document.getElementById('sidebar-theme-icon');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (sidebarThemeIcon) {
        if (currentTheme === 'dark') {
            sidebarThemeIcon.className = 'fas fa-sun';
        } else {
            sidebarThemeIcon.className = 'fas fa-moon';
        }
    }
}

// Animate sidebar items on open
function animateSidebarItems() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sidebarActions = document.querySelectorAll('.sidebar-action-btn');
    
    // Reset animations
    [...sidebarLinks, ...sidebarActions].forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(20px)';
        item.style.transition = 'all 0.3s ease';
    });
    
    // Animate items in sequence
    [...sidebarLinks, ...sidebarActions].forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, 100 + (index * 50));
    });
}

// Legacy function for backward compatibility
function initializeNavigation() {
    initializeMobileNavigation();
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
    
    // Mobile navbar hide/show functionality
    handleMobileNavbarVisibility(scrollY);
    
    // Debug: Log scroll position on mobile
    if (window.innerWidth <= 768) {
        console.log('Scroll Y:', scrollY, 'Window width:', window.innerWidth);
    }
}

// Mobile Navbar Hide/Show Logic
let lastScrollY = 0;
let isScrollingDown = false;
let scrollTimeout;

function handleMobileNavbarVisibility(scrollY) {
    // Only apply on mobile devices
    if (window.innerWidth > 768) return;
    
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    // Determine scroll direction - more sensitive detection
    const scrollDifference = scrollY - lastScrollY;
    isScrollingDown = scrollDifference > 0; // Any downward movement
    
    // Clear existing timeout
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    // Show navbar when scrolling up (any upward movement) or at top
    if (scrollY <= 50 || scrollDifference < 0) {
        navbar.classList.remove('hidden');
        navbar.classList.add('visible');
        console.log('Navbar: Showing (scroll up or at top) - ScrollY:', scrollY, 'Difference:', scrollDifference);
    } else if (isScrollingDown && scrollY > 100) {
        // Hide navbar when scrolling down - immediate response
        navbar.classList.remove('visible');
        navbar.classList.add('hidden');
        console.log('Navbar: Hiding (scroll down) - ScrollY:', scrollY, 'Difference:', scrollDifference);
    }
    
    lastScrollY = scrollY;
}

// Scroll Animations Trigger
function triggerScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const animatedTitles = document.querySelectorAll('.animated-title');
    const statItems = document.querySelectorAll('.stat-item');
    
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
    
    // Counter animation for statistics
    statItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible && !item.classList.contains('animate-in') && !item.classList.contains('animation-triggered')) {
            // Mark as triggered to prevent multiple animations
            item.classList.add('animation-triggered');
            
            // Add staggered animation delay
            setTimeout(() => {
                item.classList.add('animate-in');
                animateCounter(item);
            }, index * 200);
        }
    });
}

// Animation Functions
function initializeAnimations() {
    // Add animation classes to elements
    const animateElements = document.querySelectorAll('.service-card, .feature-item, .contact-item');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    // Initial animation check
    triggerScrollAnimations();
    
    // Parallax effect for hero logo
    initializeParallaxEffects();
}

// Initialize Counter Animation
function initializeCounterAnimation() {
    // Counter animation will be triggered by scroll animations
    console.log('Counter animation initialized');
}

// Animate Counter Function
function animateCounter(statItem) {
    const counterElement = statItem.querySelector('.stat-number');
    if (!counterElement) return;
    
    // Check if animation already completed
    if (counterElement.classList.contains('animation-completed')) {
        return;
    }
    
    const target = parseInt(counterElement.getAttribute('data-target'));
    const suffix = counterElement.getAttribute('data-suffix') || '';
    const text = counterElement.getAttribute('data-text');
    
    // If it's a text-based counter (like "Premium"), just show the text
    if (text) {
        counterElement.textContent = text;
        counterElement.classList.add('animation-completed');
        return;
    }
    
    // If it's a number-based counter, animate it
    if (target && !isNaN(target)) {
        // Clear any existing animation
        if (counterElement.animationTimer) {
            clearInterval(counterElement.animationTimer);
        }
        
        let current = 0;
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        counterElement.animationTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Use easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            current = Math.floor(target * easeOutQuart);
            
            counterElement.textContent = current + suffix;
            
            if (progress >= 1) {
                clearInterval(counterElement.animationTimer);
                counterElement.textContent = target + suffix;
                counterElement.classList.add('animation-completed');
            }
        }, 16); // ~60fps
    }
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

// Language Toggle Functions
function initializeLanguage() {
    // Check for saved language preference or default to German
    const savedLanguage = localStorage.getItem('language') || 'de';
    setLanguage(savedLanguage);
}

function toggleLanguage() {
    const currentLanguage = document.documentElement.getAttribute('data-language');
    const newLanguage = currentLanguage === 'en' ? 'de' : 'en';
    setLanguage(newLanguage);
    
    // Update sidebar language flag
    updateSidebarLanguageFlag();
}

function setLanguage(language) {
    document.documentElement.setAttribute('data-language', language);
    localStorage.setItem('language', language);
    
    // Update all elements with data attributes
    const elements = document.querySelectorAll('[data-de][data-en]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${language}`);
        if (text) {
            element.innerHTML = text;
        }
    });
    
    // Update select options
    const selectOptions = document.querySelectorAll('option[data-de][data-en]');
    selectOptions.forEach(option => {
        const text = option.getAttribute(`data-${language}`);
        if (text) {
            option.textContent = text;
        }
    });
    
    // Update textarea placeholders
    const textareas = document.querySelectorAll('textarea[data-de][data-en]');
    textareas.forEach(textarea => {
        const placeholder = textarea.getAttribute(`data-${language}`);
        if (placeholder) {
            textarea.placeholder = placeholder;
        }
    });
    
    // Update flag icons
    const flags = document.querySelectorAll('#language-flag, #sidebar-language-flag');
    flags.forEach(flag => {
        if (language === 'en') {
            flag.className = 'fi fi-gb flag-icon';
        } else {
            flag.className = 'fi fi-de flag-icon';
        }
    });
    
    // Update page title
    document.title = language === 'en' ? 'Luna Caviar - Exclusive Mobile Caviar Service' : 'Luna Caviar - Exklusiver Mobiler Caviar-Service';
}

function updateSidebarLanguageFlag() {
    const sidebarLanguageFlag = document.getElementById('sidebar-language-flag');
    const currentLanguage = document.documentElement.getAttribute('data-language');
    
    if (sidebarLanguageFlag) {
        if (currentLanguage === 'en') {
            sidebarLanguageFlag.className = 'fi fi-gb flag-icon';
        } else {
            sidebarLanguageFlag.className = 'fi fi-de flag-icon';
        }
    }
}

// Scroll to Top Function
function scrollToTop(event) {
    event.preventDefault();
    
    // Smooth scroll to top with easing
    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    const duration = 1200; // 1.2 seconds for smooth animation
    
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }
    
    function animateScroll(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutCubic(progress);
        
        window.scrollTo(0, startPosition * (1 - ease));
        
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    }
    
    requestAnimationFrame(animateScroll);
}

// Theme Toggle Functions
function initializeTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Update sidebar theme icon
    updateSidebarThemeIcon();
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme icon
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }
    
    // Update logo based on theme
    const logo = document.querySelector('.logo-img');
    if (logo) {
        if (theme === 'dark') {
            logo.src = './Luna-Caviar-Logo-Weiss.png';
        } else {
            logo.src = './Luna-Caviar-Logo-Schwarz.png';
        }
    }
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        isValidEmail,
        isValidPhone,
        calculatePackagePrice,
        formatCurrency,
        formatDate,
        toggleTheme,
        setTheme
    };
}
