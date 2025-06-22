// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Contact Modal Functionality
const modal = document.getElementById('contact-modal');
const getQuoteBtn = document.getElementById('get-quote-btn');
const whatsappBtn = document.getElementById('whatsapp-btn');
const smsBtn = document.getElementById('sms-btn');
const modalWhatsapp = document.getElementById('modal-whatsapp');
const modalSms = document.getElementById('modal-sms');
const closeModal = document.querySelector('.close');

// Phone number for contact
const phoneNumber = '+16035570706';
const formattedPhone = '+1 (603) 557-0706';

// Open modal when clicking get quote button
getQuoteBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Open modal when clicking contact buttons
whatsappBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

smsBtn.addEventListener('click', () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// WhatsApp functionality
function openWhatsApp() {
    const message = encodeURIComponent("Hi! I'm interested in your painting services. Could you please provide me with more information and a free quote?");
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// SMS functionality
function openSMS() {
    const message = encodeURIComponent("Hi! I'm interested in your painting services. Could you please provide me with more information?");
    const smsUrl = `sms:${phoneNumber}?body=${message}`;
    
    // Try to open SMS app
    try {
        window.location.href = smsUrl;
    } catch (error) {
        // Fallback: show instructions
        alert(`Please send a text message to ${formattedPhone}\n\nSample message: "Hi! I'm interested in your painting services. Could you please provide me with more information?"`);
    }
}

// Modal button event listeners
modalWhatsapp.addEventListener('click', () => {
    openWhatsApp();
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

modalSms.addEventListener('click', () => {
    openSMS();
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Contact form functionality
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Create message for WhatsApp/SMS
    const contactMessage = `New inquiry from ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Service: ${service}
Message: ${message}`;
    
    // Show options to send via WhatsApp or SMS
    const userChoice = confirm("Would you like to send this inquiry via WhatsApp? Click OK for WhatsApp or Cancel for SMS.");
    
    if (userChoice) {
        // Send via WhatsApp
        const whatsappMessage = encodeURIComponent(contactMessage);
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');
    } else {
        // Send via SMS
        const smsMessage = encodeURIComponent(contactMessage);
        const smsUrl = `sms:${phoneNumber}?body=${smsMessage}`;
        
        try {
            window.location.href = smsUrl;
        } catch (error) {
            alert(`Please send this information via text to ${formattedPhone}:\n\n${contactMessage}`);
        }
    }
    
    // Reset form
    contactForm.reset();
    
    // Show success message
    showNotification('Thank you! Your message has been prepared. Please send it via your preferred method.', 'success');
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        .notification-close:hover {
            opacity: 0.8;
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Header scroll effect
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    animateOnScroll();
    handleHeaderScroll();
    setupVideoGallery();
    
    // Add click handlers for all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Utility function to detect mobile device
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Enhanced SMS functionality for mobile devices
function enhancedSMS() {
    if (isMobileDevice()) {
        const message = encodeURIComponent("Hi! I'm interested in your painting services. Could you please provide me with more information?");
        window.location.href = `sms:${phoneNumber}?body=${message}`;
    } else {
        // For desktop, show instructions
        const instructions = `
To send us a text message:

📱 Phone: ${formattedPhone}

💬 Sample message:
"Hi! I'm interested in your painting services. Could you please provide me with more information?"

You can copy this number and message to your phone's messaging app.
        `;
        alert(instructions);
    }
}

// Update SMS button functionality
document.addEventListener('DOMContentLoaded', () => {
    // Override the SMS functionality for better user experience
    const smsButtons = document.querySelectorAll('#sms-btn, #modal-sms');
    smsButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            enhancedSMS();
        });
    });
});

// Add loading states for buttons
function addLoadingState(button) {
    button.classList.add('loading');
    button.disabled = true;
    
    setTimeout(() => {
        button.classList.remove('loading');
        button.disabled = false;
    }, 2000);
}

// Enhanced button interactions
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('btn-secondary')) {
                addLoadingState(this);
            }
        });
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close modal with Escape key
    if (e.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Performance optimization: Lazy load images
// Video functionality for portfolio
function setupVideoGallery() {
    const videoItems = document.querySelectorAll('.video-item');
    const playButtons = document.querySelectorAll('.play-button');
    
    playButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const videoItem = this.closest('.video-item');
            const video = videoItem.querySelector('video');
            
            if (video) {
                if (video.paused) {
                    // Pause all other videos
                    document.querySelectorAll('.video-item video').forEach(v => {
                        if (v !== video && !v.paused) {
                            v.pause();
                            v.closest('.video-item').querySelector('.play-button').style.display = 'flex';
                        }
                    });
                    
                    video.play();
                    this.style.display = 'none';
                } else {
                    video.pause();
                    this.style.display = 'flex';
                }
            }
        });
    });
    
    // Handle video events
    document.querySelectorAll('.video-item video').forEach(video => {
        video.addEventListener('ended', function() {
            const playButton = this.closest('.video-item').querySelector('.play-button');
            if (playButton) {
                playButton.style.display = 'flex';
            }
        });
        
        video.addEventListener('click', function() {
            const playButton = this.closest('.video-item').querySelector('.play-button');
            if (this.paused) {
                this.play();
                if (playButton) playButton.style.display = 'none';
            } else {
                this.pause();
                if (playButton) playButton.style.display = 'flex';
            }
        });
    });
}

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

