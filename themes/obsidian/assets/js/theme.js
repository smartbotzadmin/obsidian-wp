/**
 * Obsidian Theme JavaScript
 *
 * @package Obsidian
 * @since 1.0.0
 */

(function() {
    'use strict';

    // Theme object
    const ObsidianTheme = {
        
        /**
         * Initialize theme functionality
         */
        init: function() {
            this.setupAccessibility();
            this.setupSmoothScrolling();
            this.setupMobileMenu();
            this.setupSearchToggle();
            this.setupThemeAPI();
            this.setupLazyLoading();
            this.setupAnimations();
        },

        /**
         * Setup accessibility features
         */
        setupAccessibility: function() {
            // Skip link functionality
            const skipLink = document.querySelector('.screen-reader-text');
            if (skipLink) {
                skipLink.addEventListener('click', function(e) {
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.focus();
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            }

            // Focus management for dropdowns
            const dropdowns = document.querySelectorAll('.wp-block-navigation-submenu');
            dropdowns.forEach(dropdown => {
                const toggle = dropdown.querySelector('.wp-block-navigation-submenu__toggle');
                const submenu = dropdown.querySelector('.wp-block-navigation__submenu-container');
                
                if (toggle && submenu) {
                    toggle.addEventListener('keydown', function(e) {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            this.click();
                        }
                    });
                }
            });

            // Announce dynamic content changes
            this.createAriaLiveRegion();
        },

        /**
         * Create ARIA live region for announcements
         */
        createAriaLiveRegion: function() {
            const liveRegion = document.createElement('div');
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.className = 'screen-reader-text';
            liveRegion.id = 'obsidian-live-region';
            document.body.appendChild(liveRegion);
        },

        /**
         * Announce message to screen readers
         */
        announce: function(message) {
            const liveRegion = document.getElementById('obsidian-live-region');
            if (liveRegion) {
                liveRegion.textContent = message;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            }
        },

        /**
         * Setup smooth scrolling for anchor links
         */
        setupSmoothScrolling: function() {
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            
            anchorLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    if (href === '#') return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update URL without jumping
                        history.pushState(null, null, href);
                    }
                });
            });
        },

        /**
         * Setup mobile menu functionality
         */
        setupMobileMenu: function() {
            const mobileToggle = document.querySelector('.wp-block-navigation__responsive-container-open');
            const mobileClose = document.querySelector('.wp-block-navigation__responsive-container-close');
            const mobileContainer = document.querySelector('.wp-block-navigation__responsive-container');
            
            if (mobileToggle && mobileClose && mobileContainer) {
                mobileToggle.addEventListener('click', () => {
                    mobileContainer.classList.add('is-menu-open');
                    document.body.classList.add('obsidian-menu-open');
                    mobileClose.focus();
                    this.announce('Menu opened');
                });
                
                mobileClose.addEventListener('click', () => {
                    mobileContainer.classList.remove('is-menu-open');
                    document.body.classList.remove('obsidian-menu-open');
                    mobileToggle.focus();
                    this.announce('Menu closed');
                });
                
                // Close menu on escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && mobileContainer.classList.contains('is-menu-open')) {
                        mobileClose.click();
                    }
                });
            }
        },

        /**
         * Setup search toggle functionality
         */
        setupSearchToggle: function() {
            const searchToggles = document.querySelectorAll('.obsidian-search-toggle');
            const searchForms = document.querySelectorAll('.obsidian-search-form');
            
            searchToggles.forEach((toggle, index) => {
                const form = searchForms[index];
                if (form) {
                    toggle.addEventListener('click', (e) => {
                        e.preventDefault();
                        form.classList.toggle('is-open');
                        
                        if (form.classList.contains('is-open')) {
                            const searchInput = form.querySelector('input[type="search"]');
                            if (searchInput) {
                                searchInput.focus();
                            }
                            this.announce('Search opened');
                        } else {
                            this.announce('Search closed');
                        }
                    });
                }
            });
        },

        /**
         * Setup theme API functionality
         */
        setupThemeAPI: function() {
            // Listen for theme setting updates
            if (typeof obsidian_ajax !== 'undefined') {
                this.apiEndpoint = obsidian_ajax.rest_url;
                this.nonce = obsidian_ajax.nonce;
                
                // Setup real-time CSS variable updates
                this.setupRealTimeUpdates();
            }
        },

        /**
         * Setup real-time CSS variable updates
         */
        setupRealTimeUpdates: function() {
            // Listen for customizer changes
            if (typeof wp !== 'undefined' && wp.customize) {
                // Color updates
                const colors = ['primary', 'secondary', 'accent', 'background', 'text', 'muted'];
                colors.forEach(color => {
                    wp.customize(`obsidian_color_${color}`, (value) => {
                        value.bind((newval) => {
                            document.documentElement.style.setProperty(`--obsidian-color-${color}`, newval);
                        });
                    });
                });
                
                // Typography updates
                wp.customize('obsidian_font_primary_family', (value) => {
                    value.bind((newval) => {
                        document.documentElement.style.setProperty('--obsidian-font-primary-family', newval);
                    });
                });
                
                wp.customize('obsidian_font_secondary_family', (value) => {
                    value.bind((newval) => {
                        document.documentElement.style.setProperty('--obsidian-font-secondary-family', newval);
                    });
                });
                
                // Layout updates
                wp.customize('obsidian_layout_container_width', (value) => {
                    value.bind((newval) => {
                        document.documentElement.style.setProperty('--obsidian-layout-container-width', newval);
                    });
                });
            }
        },

        /**
         * Update theme settings via API
         */
        updateThemeSettings: function(settings) {
            if (!this.apiEndpoint) return;
            
            fetch(this.apiEndpoint + 'theme/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': this.nonce
                },
                body: JSON.stringify(settings)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.announce('Theme settings updated');
                    // Update CSS variables
                    this.applyCSSVariables(data.data);
                }
            })
            .catch(error => {
                console.error('Error updating theme settings:', error);
            });
        },

        /**
         * Apply CSS variables to document
         */
        applyCSSVariables: function(settings) {
            const root = document.documentElement;
            
            // Apply colors
            if (settings.colors) {
                Object.entries(settings.colors).forEach(([key, value]) => {
                    root.style.setProperty(`--obsidian-color-${key}`, value);
                });
            }
            
            // Apply typography
            if (settings.typography) {
                Object.entries(settings.typography).forEach(([key, value]) => {
                    root.style.setProperty(`--obsidian-font-${key}`, value);
                });
            }
            
            // Apply layout
            if (settings.layout) {
                Object.entries(settings.layout).forEach(([key, value]) => {
                    root.style.setProperty(`--obsidian-layout-${key}`, value);
                });
            }
        },

        /**
         * Setup lazy loading for images
         */
        setupLazyLoading: function() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.classList.remove('obsidian-lazy');
                                img.classList.add('obsidian-loaded');
                                observer.unobserve(img);
                            }
                        }
                    });
                });
                
                const lazyImages = document.querySelectorAll('img[data-src]');
                lazyImages.forEach(img => {
                    img.classList.add('obsidian-lazy');
                    imageObserver.observe(img);
                });
            }
        },

        /**
         * Setup scroll animations
         */
        setupAnimations: function() {
            if ('IntersectionObserver' in window) {
                const animationObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('obsidian-animate-in');
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                });
                
                const animatedElements = document.querySelectorAll('.obsidian-animate');
                animatedElements.forEach(el => {
                    animationObserver.observe(el);
                });
            }
        },

        /**
         * Utility function to debounce events
         */
        debounce: function(func, wait, immediate) {
            let timeout;
            return function executedFunction() {
                const context = this;
                const args = arguments;
                const later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        },

        /**
         * Utility function to throttle events
         */
        throttle: function(func, limit) {
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
    };

    // Initialize theme when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ObsidianTheme.init();
        });
    } else {
        ObsidianTheme.init();
    }

    // Make theme object globally available
    window.ObsidianTheme = ObsidianTheme;

})();

/**
 * Additional Theme Enhancements
 */
(function() {
    'use strict';

    // Back to top functionality
    function initBackToTop() {
        const backToTopButton = document.getElementById('obsidian-back-to-top');
        if (!backToTopButton) return;

        const button = backToTopButton.querySelector('button');
        
        // Show/hide button based on scroll position
        function toggleBackToTop() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('is-visible');
                backToTopButton.setAttribute('aria-hidden', 'false');
            } else {
                backToTopButton.classList.remove('is-visible');
                backToTopButton.setAttribute('aria-hidden', 'true');
            }
        }

        // Scroll to top when clicked
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Event listeners
        window.addEventListener('scroll', ObsidianTheme.throttle(toggleBackToTop, 100));
        button.addEventListener('click', scrollToTop);
    }

    // Enhanced mobile menu
    function initEnhancedMobileMenu() {
        const menuToggle = document.querySelector('.obsidian-menu-toggle');
        const navMenu = document.querySelector('.obsidian-nav-menu');
        
        if (!menuToggle || !navMenu) return;

        menuToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('is-open');
            
            if (isOpen) {
                navMenu.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('obsidian-menu-open');
            } else {
                navMenu.classList.add('is-open');
                menuToggle.setAttribute('aria-expanded', 'true');
                document.body.classList.add('obsidian-menu-open');
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('obsidian-menu-open');
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
                navMenu.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('obsidian-menu-open');
                menuToggle.focus();
            }
        });
    }

    // Enhanced search functionality
    function initEnhancedSearch() {
        const searchToggles = document.querySelectorAll('.obsidian-search-toggle');
        const searchForms = document.querySelectorAll('.obsidian-search-form');

        searchToggles.forEach((toggle, index) => {
            const form = searchForms[index];
            if (!form) return;

            toggle.addEventListener('click', function(e) {
                e.preventDefault();
                const isOpen = form.classList.contains('is-open');

                // Close all other search forms
                searchForms.forEach(f => f.classList.remove('is-open'));

                if (!isOpen) {
                    form.classList.add('is-open');
                    toggle.setAttribute('aria-expanded', 'true');
                    
                    // Focus on search input
                    const searchInput = form.querySelector('.obsidian-search-field');
                    if (searchInput) {
                        setTimeout(() => searchInput.focus(), 100);
                    }
                } else {
                    form.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close search when clicking outside
            document.addEventListener('click', function(e) {
                if (!toggle.contains(e.target) && !form.contains(e.target)) {
                    form.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close search on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && form.classList.contains('is-open')) {
                    form.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                    toggle.focus();
                }
            });
        });
    }

    // Keyboard navigation improvements
    function initKeyboardNavigation() {
        // Skip to content link
        const skipLink = document.querySelector('.screen-reader-text[href="#main"]');
        if (skipLink) {
            skipLink.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector('#main');
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Improve focus management for dropdowns
        const dropdownToggles = document.querySelectorAll('[aria-expanded]');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // Performance monitoring
    function initPerformanceMonitoring() {
        if ('performance' in window) {
            window.addEventListener('load', function() {
                setTimeout(function() {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData) {
                        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                        console.log('Obsidian Theme Load Time:', loadTime + 'ms');
                    }
                }, 0);
            });
        }
    }

    // Form enhancements
    function initFormEnhancements() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Add loading state to submit buttons
            form.addEventListener('submit', function() {
                const submitButton = form.querySelector('[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = submitButton.dataset.loading || 'Loading...';
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    if (this.validity.valid) {
                        this.classList.remove('error');
                        this.classList.add('valid');
                    } else {
                        this.classList.remove('valid');
                        this.classList.add('error');
                    }
                });
            });
        });
    }

    // Image optimization
    function initImageOptimization() {
        // Add loading="lazy" to images below the fold
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach((img, index) => {
            if (index > 2) { // Skip first 3 images (likely above fold)
                img.setAttribute('loading', 'lazy');
            }
        });

        // Handle image load errors
        images.forEach(img => {
            img.addEventListener('error', function() {
                this.style.display = 'none';
                console.warn('Failed to load image:', this.src);
            });
        });
    }

    // Color scheme detection
    function initColorSchemeDetection() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            function handleColorSchemeChange(e) {
                document.body.classList.toggle('dark-mode', e.matches);
                ObsidianTheme.announce(e.matches ? 'Dark mode enabled' : 'Light mode enabled');
            }

            darkModeQuery.addListener(handleColorSchemeChange);
            handleColorSchemeChange(darkModeQuery);
        }
    }

    // Initialize all enhancements
    function initEnhancements() {
        initBackToTop();
        initEnhancedMobileMenu();
        initEnhancedSearch();
        initKeyboardNavigation();
        initPerformanceMonitoring();
        initFormEnhancements();
        initImageOptimization();
        initColorSchemeDetection();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancements);
    } else {
        initEnhancements();
    }

})();