/**
 * Example AI Agent Workflow for Obsidian Plugin
 * 
 * This demonstrates how an AI agent would use the Obsidian API
 * to create dynamic components based on user requests.
 */

class ObsidianAIAgent {
    constructor(baseUrl, nonce) {
        this.baseUrl = baseUrl;
        this.nonce = nonce;
    }

    /**
     * Example: User says "Add a team carousel with 4 members"
     */
    async createTeamCarousel(postId, teamMembers) {
        try {
            // Step 1: Generate custom JavaScript for the carousel
            const carouselScript = this.generateCarouselScript(teamMembers.length);
            const carouselCSS = this.generateCarouselCSS();

            // Step 2: Create the dynamic component
            const componentResponse = await this.apiCall('POST', '/generate-script', {
                component_type: 'team-carousel',
                requirements: `Responsive carousel for ${teamMembers.length} team members with auto-play and navigation`,
                script_content: carouselScript,
                css_content: carouselCSS
            });

            if (!componentResponse.success) {
                throw new Error('Failed to generate component');
            }

            // Step 3: Generate HTML for the specific team members
            const htmlContent = this.generateTeamHTML(teamMembers);

            // Step 4: Add component to the page
            const addResponse = await this.apiCall('POST', `/posts/${postId}/add-dynamic-component`, {
                component_handle: componentResponse.component.handle,
                html_content: htmlContent,
                position: 'end',
                config: {
                    autoplay: true,
                    speed: 4000,
                    showDots: true,
                    showArrows: true
                }
            });

            return {
                success: true,
                message: 'Team carousel added successfully',
                component: componentResponse.component
            };

        } catch (error) {
            console.error('Error creating team carousel:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Example: User says "Add a contact form with validation"
     */
    async createContactForm(postId, fields = ['name', 'email', 'message']) {
        try {
            // Generate custom form script with validation
            const formScript = this.generateFormScript(fields);
            const formCSS = this.generateFormCSS();

            // Create the component
            const componentResponse = await this.apiCall('POST', '/generate-script', {
                component_type: 'contact-form',
                requirements: `Contact form with ${fields.join(', ')} fields and client-side validation`,
                script_content: formScript,
                css_content: formCSS
            });

            // Generate form HTML
            const htmlContent = this.generateFormHTML(fields);

            // Add to page
            const addResponse = await this.apiCall('POST', `/posts/${postId}/add-dynamic-component`, {
                component_handle: componentResponse.component.handle,
                html_content: htmlContent,
                position: 'end',
                config: {
                    ajax_submit: true,
                    validation: true,
                    success_message: 'Thank you for your message!'
                }
            });

            return {
                success: true,
                message: 'Contact form added successfully',
                component: componentResponse.component
            };

        } catch (error) {
            console.error('Error creating contact form:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate custom carousel JavaScript
     */
    generateCarouselScript(memberCount) {
        return `
(function($) {
    'use strict';
    
    class ObsidianTeamCarousel {
        constructor(element, config = {}) {
            this.element = element;
            this.config = {
                autoplay: true,
                speed: 4000,
                showDots: true,
                showArrows: true,
                ...config
            };
            this.currentIndex = 0;
            this.items = this.element.querySelectorAll('.team-member');
            this.totalItems = this.items.length;
            
            if (this.totalItems > 1) {
                this.init();
            }
        }
        
        init() {
            this.createNavigation();
            this.bindEvents();
            this.showItem(0);
            
            if (this.config.autoplay) {
                this.startAutoplay();
            }
        }
        
        createNavigation() {
            if (this.config.showArrows) {
                const prevBtn = document.createElement('button');
                prevBtn.className = 'carousel-prev';
                prevBtn.innerHTML = '‹';
                prevBtn.setAttribute('aria-label', 'Previous team member');
                
                const nextBtn = document.createElement('button');
                nextBtn.className = 'carousel-next';
                nextBtn.innerHTML = '›';
                nextBtn.setAttribute('aria-label', 'Next team member');
                
                this.element.appendChild(prevBtn);
                this.element.appendChild(nextBtn);
                
                prevBtn.addEventListener('click', () => this.prev());
                nextBtn.addEventListener('click', () => this.next());
            }
            
            if (this.config.showDots) {
                const dotsContainer = document.createElement('div');
                dotsContainer.className = 'carousel-dots';
                
                for (let i = 0; i < this.totalItems; i++) {
                    const dot = document.createElement('button');
                    dot.className = 'carousel-dot';
                    dot.setAttribute('aria-label', \`Go to team member \${i + 1}\`);
                    dot.addEventListener('click', () => this.goTo(i));
                    dotsContainer.appendChild(dot);
                }
                
                this.element.appendChild(dotsContainer);
            }
        }
        
        showItem(index) {
            this.items.forEach((item, i) => {
                item.style.display = i === index ? 'block' : 'none';
            });
            
            const dots = this.element.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            this.currentIndex = index;
        }
        
        next() {
            const nextIndex = (this.currentIndex + 1) % this.totalItems;
            this.showItem(nextIndex);
        }
        
        prev() {
            const prevIndex = this.currentIndex === 0 ? this.totalItems - 1 : this.currentIndex - 1;
            this.showItem(prevIndex);
        }
        
        goTo(index) {
            this.showItem(index);
        }
        
        startAutoplay() {
            this.autoplayInterval = setInterval(() => {
                if (!this.element.matches(':hover')) {
                    this.next();
                }
            }, this.config.speed);
        }
        
        bindEvents() {
            this.element.addEventListener('mouseenter', () => {
                if (this.autoplayInterval) {
                    clearInterval(this.autoplayInterval);
                }
            });
            
            this.element.addEventListener('mouseleave', () => {
                if (this.config.autoplay) {
                    this.startAutoplay();
                }
            });
        }
    }
    
    // Initialize all team carousels
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.obsidian-dynamic-component[data-component="team-carousel"]').forEach(element => {
            const config = JSON.parse(element.getAttribute('data-config') || '{}');
            new ObsidianTeamCarousel(element, config);
        });
    });
    
})(jQuery);`;
    }

    /**
     * Generate carousel CSS
     */
    generateCarouselCSS() {
        return `
.obsidian-dynamic-component[data-component="team-carousel"] {
    position: relative;
    max-width: 800px;
    margin: 2rem auto;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.team-member {
    display: none;
    text-align: center;
    padding: 2rem;
}

.team-member.active {
    display: block;
}

.team-member img {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
}

.team-member h3 {
    margin: 0.5rem 0;
    color: #333;
    font-size: 1.5rem;
}

.team-member p {
    color: #666;
    font-size: 1rem;
    margin: 0;
}

.carousel-prev,
.carousel-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.carousel-prev:hover,
.carousel-next:hover {
    background: rgba(0, 0, 0, 0.7);
}

.carousel-prev {
    left: 1rem;
}

.carousel-next {
    right: 1rem;
}

.carousel-dots {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    background: #f8f9fa;
}

.carousel-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background: #ccc;
    cursor: pointer;
    transition: background-color 0.3s;
}

.carousel-dot.active,
.carousel-dot:hover {
    background: #007cba;
}

@media (max-width: 768px) {
    .carousel-prev,
    .carousel-next {
        display: none;
    }
    
    .team-member {
        padding: 1rem;
    }
    
    .team-member img {
        width: 120px;
        height: 120px;
    }
}`;
    }

    /**
     * Generate team HTML
     */
    generateTeamHTML(teamMembers) {
        const membersHTML = teamMembers.map((member, index) => `
            <div class="team-member ${index === 0 ? 'active' : ''}">
                <img src="${member.photo}" alt="${member.name}" loading="lazy">
                <h3>${member.name}</h3>
                <p>${member.title}</p>
                ${member.bio ? `<p class="bio">${member.bio}</p>` : ''}
            </div>
        `).join('');

        return `<div class="team-carousel">${membersHTML}</div>`;
    }

    /**
     * Generate form script (simplified example)
     */
    generateFormScript(fields) {
        return `
(function($) {
    'use strict';
    
    class ObsidianContactForm {
        constructor(element, config = {}) {
            this.element = element;
            this.config = {
                ajax_submit: true,
                validation: true,
                success_message: 'Thank you for your message!',
                ...config
            };
            
            this.init();
        }
        
        init() {
            this.bindEvents();
        }
        
        bindEvents() {
            this.element.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (this.config.validation && !this.validateForm()) {
                    return;
                }
                
                if (this.config.ajax_submit) {
                    this.submitForm();
                }
            });
        }
        
        validateForm() {
            let isValid = true;
            const requiredFields = this.element.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    this.showFieldError(field, 'This field is required');
                    isValid = false;
                } else {
                    this.clearFieldError(field);
                }
            });
            
            // Email validation
            const emailField = this.element.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    this.showFieldError(emailField, 'Please enter a valid email address');
                    isValid = false;
                }
            }
            
            return isValid;
        }
        
        showFieldError(field, message) {
            this.clearFieldError(field);
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
            field.classList.add('error');
        }
        
        clearFieldError(field) {
            const existingError = field.parentNode.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
            field.classList.remove('error');
        }
        
        async submitForm() {
            const formData = new FormData(this.element);
            const submitBtn = this.element.querySelector('button[type="submit"]');
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            try {
                // Here you would typically send to your form handler
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
                
                this.showSuccessMessage();
                this.element.reset();
            } catch (error) {
                this.showErrorMessage('Failed to send message. Please try again.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            }
        }
        
        showSuccessMessage() {
            const message = document.createElement('div');
            message.className = 'form-success';
            message.textContent = this.config.success_message;
            this.element.parentNode.insertBefore(message, this.element);
            
            setTimeout(() => message.remove(), 5000);
        }
        
        showErrorMessage(text) {
            const message = document.createElement('div');
            message.className = 'form-error';
            message.textContent = text;
            this.element.parentNode.insertBefore(message, this.element);
            
            setTimeout(() => message.remove(), 5000);
        }
    }
    
    // Initialize all contact forms
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.obsidian-dynamic-component[data-component="contact-form"]').forEach(element => {
            const config = JSON.parse(element.getAttribute('data-config') || '{}');
            new ObsidianContactForm(element.querySelector('form'), config);
        });
    });
    
})(jQuery);`;
    }

    /**
     * Generate form CSS
     */
    generateFormCSS() {
        return `
.obsidian-dynamic-component[data-component="contact-form"] {
    max-width: 600px;
    margin: 2rem auto;
}

.contact-form {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #007cba;
}

.form-group input.error,
.form-group textarea.error {
    border-color: #dc3545;
}

.field-error {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

.form-submit {
    background: #007cba;
    color: white;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
}

.form-submit:hover:not(:disabled) {
    background: #005a87;
}

.form-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.form-success {
    background: #d4edda;
    color: #155724;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid #c3e6cb;
}

.form-error {
    background: #f8d7da;
    color: #721c24;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    border: 1px solid #f5c6cb;
}`;
    }

    /**
     * Generate form HTML
     */
    generateFormHTML(fields) {
        const fieldsHTML = fields.map(field => {
            switch (field) {
                case 'name':
                    return `
                        <div class="form-group">
                            <label for="contact-name">Name *</label>
                            <input type="text" id="contact-name" name="name" required>
                        </div>`;
                case 'email':
                    return `
                        <div class="form-group">
                            <label for="contact-email">Email *</label>
                            <input type="email" id="contact-email" name="email" required>
                        </div>`;
                case 'message':
                    return `
                        <div class="form-group">
                            <label for="contact-message">Message *</label>
                            <textarea id="contact-message" name="message" rows="5" required></textarea>
                        </div>`;
                default:
                    return `
                        <div class="form-group">
                            <label for="contact-${field}">${field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input type="text" id="contact-${field}" name="${field}">
                        </div>`;
            }
        }).join('');

        return `
            <form class="contact-form">
                ${fieldsHTML}
                <button type="submit" class="form-submit">Send Message</button>
            </form>`;
    }

    /**
     * Make API call
     */
    async apiCall(method, endpoint, data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-WP-Nonce': this.nonce
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        return await response.json();
    }
}

// Example usage:
// const agent = new ObsidianAIAgent('/wp-json/obsidian/v1', wpNonce);
// 
// // Create team carousel
// agent.createTeamCarousel(123, [
//     { name: 'John Doe', title: 'CEO', photo: '/images/john.jpg' },
//     { name: 'Jane Smith', title: 'CTO', photo: '/images/jane.jpg' }
// ]);
//
// // Create contact form
// agent.createContactForm(123, ['name', 'email', 'phone', 'message']);