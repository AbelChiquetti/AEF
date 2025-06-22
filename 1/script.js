// AEF Painting Services - Main JavaScript File
// Optimized for performance and user experience

(function() {
    'use strict';

    // DOM Elements
    const navbar = document.getElementById('navbar');
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const navLinks = document.querySelectorAll('.nav-link');
    const galleryVideos = document.querySelectorAll('.gallery-item video');
    const playButtons = document.querySelectorAll('.play-button');

    // State variables
    let isScrolling = false;
    let currentSection = 'home';

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    // Initialize all functionality
    function initializeApp() {
        setupNavigation();
        setupScrollEffects();
        setupMobileMenu();
        setupLazyLoading();
        setupVideoGallery();
        setupAnimations();
        setupPerformanceOptimizations();
        
        // Show content with fade-in effect
        document.body.classList.add('loaded');
    }

    // Navigation Setup
    function setupNavigation() {
        // Smooth scroll for navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu.classList.contains('active')) {
                        toggleMobileMenu();
                    }
                    
                    // Update active link
                    updateActiveNavLink(targetId);
                }
            });
        });

        // Update active navigation link based on scroll position
        window.addEventListener('scroll', throttle(updateNavigationOnScroll, 100));
    }

    // Mobile Menu Setup
    function setupMobileMenu() {
        if (mobileMenu) {
            mobileMenu.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });

        // Close mobile menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Scroll Effects Setup
    function setupScrollEffects() {
        window.addEventListener('scroll', throttle(handleScroll, 16)); // ~60fps
        
        // Scroll to top button
        if (scrollToTopBtn) {
            scrollToTopBtn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Handle scroll events
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar scroll effect
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Show/hide scroll to top button
        if (scrollToTopBtn) {
            if (scrollTop > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
        
        // Update active navigation
        updateNavigationOnScroll();
    }

    // Update navigation based on scroll position
    function updateNavigationOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                if (currentSection !== sectionId) {
                    currentSection = sectionId;
                    updateActiveNavLink(sectionId);
                }
            }
        });
    }

    // Update active navigation link
    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    // Lazy Loading Setup
    function setupLazyLoading() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        if (img.tagName === 'IMG') {
                            // For images
                            img.src = img.dataset.src || img.src;
                            img.classList.add('loaded');
                        } else if (img.tagName === 'VIDEO') {
                            // For videos
                            const sources = img.querySelectorAll('source[data-src]');
                            sources.forEach(source => {
                                source.src = source.dataset.src;
                            });
                            img.load();
                            img.classList.add('loaded');
                        }
                        
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            // Observe all images and videos
            const lazyImages = document.querySelectorAll('img[loading="lazy"], video[loading="lazy"]');
            lazyImages.forEach(img => {
                img.classList.add('loading');
                imageObserver.observe(img);
            });
        }
    }

    // Video Gallery Setup
    function setupVideoGallery() {
        playButtons.forEach(button => {
            button.addEventListener('click', function() {
                const videoItem = this.closest('.video-item');
                const video = videoItem.querySelector('video');
                
                if (video) {
                    if (video.paused) {
                        // Pause all other videos
                        galleryVideos.forEach(v => {
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
        galleryVideos.forEach(video => {
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

    // Animation Setup
    function setupAnimations() {
        // Scroll-triggered animations
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements for animations
            const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .gallery-item, .feature');
            animateElements.forEach(el => {
                el.classList.add('animate-element');
                animationObserver.observe(el);
            });
        }

        // Add CSS for animations
        addAnimationStyles();
    }

    // Add animation styles dynamically
    function addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-element {
                opacity: 0;
                transform: translateY(30px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-element.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .animate-element:nth-child(2) { transition-delay: 0.1s; }
            .animate-element:nth-child(3) { transition-delay: 0.2s; }
            .animate-element:nth-child(4) { transition-delay: 0.3s; }
            .animate-element:nth-child(5) { transition-delay: 0.4s; }
            .animate-element:nth-child(6) { transition-delay: 0.5s; }
        `;
        document.head.appendChild(style);
    }

    // Performance Optimizations
    function setupPerformanceOptimizations() {
        // Preload critical resources
        preloadCriticalResources();
        
        // Optimize images
        optimizeImages();
        
        // Setup service worker for caching (if needed)
        setupServiceWorker();
        
        // Monitor performance
        monitorPerformance();
    }

    // Preload critical resources
    function preloadCriticalResources() {
        // Preload hero image
        const heroImage = document.querySelector('.hero-image');
        if (heroImage && heroImage.src) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = heroImage.src;
            document.head.appendChild(link);
        }

        // Preload logo
        const logo = document.querySelector('.nav-logo img');
        if (logo && logo.src) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = logo.src;
            document.head.appendChild(link);
        }
    }

    // Optimize images
    function optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading attribute if not present
            if (!img.hasAttribute('loading') && !img.classList.contains('eager')) {
                img.loading = 'lazy';
            }
            
            // Add decode attribute for better performance
            img.decoding = 'async';
        });
    }

    // Setup Service Worker (basic implementation)
    function setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                // Service worker registration would go here
                // navigator.serviceWorker.register('/sw.js');
            });
        }
    }

    // Monitor performance
    function monitorPerformance() {
        // Log performance metrics if available
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        console.log('Page Load Performance:', {
                            'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                            'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
                            'Total Load Time': perfData.loadEventEnd - perfData.fetchStart
                        });
                    }
                }, 0);
            });
        }
    }

    // Utility Functions
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // WhatsApp and Contact Helpers
    function initializeContactHelpers() {
        // Track WhatsApp button clicks
        const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
        whatsappButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Analytics tracking could go here
                console.log('WhatsApp button clicked');
            });
        });

        // Track phone number clicks
        const phoneButtons = document.querySelectorAll('a[href^="tel:"]');
        phoneButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Analytics tracking could go here
                console.log('Phone button clicked');
            });
        });
    }

    // Initialize contact helpers when DOM is ready
    document.addEventListener('DOMContentLoaded', initializeContactHelpers);

    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // Could send error reports to analytics service
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        // Could send error reports to analytics service
    });

    // Expose some functions globally for external use
    window.AEFPainting = {
        scrollToSection: function(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                const offsetTop = section.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        },
        
        openWhatsApp: function(message = '') {
            const phone = '16035570706';
            const encodedMessage = encodeURIComponent(message || "Hi, I'm interested in getting a quote for painting services.");
            window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
        },
        
        callPhone: function() {
            window.location.href = 'tel:+16035570706';
        }
    };

})(); 