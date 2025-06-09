/**
 * Obsidian Elementor-like Page Builder
 * Drag and drop page builder functionality
 */

class ObsidianBuilder {
    constructor() {
        this.elements = [];
        this.currentElement = null;
        this.isEditing = false;
        this.init();
    }

    init() {
        this.createBuilderInterface();
        this.bindEvents();
        this.loadPresets();
    }

    createBuilderInterface() {
        // Create builder panel
        const builderPanel = document.createElement('div');
        builderPanel.id = 'obsidian-builder';
        builderPanel.className = 'obsidian-builder-panel';
        builderPanel.innerHTML = `
            <div class="builder-header">
                <h3>Obsidian Page Builder</h3>
                <button class="builder-toggle" id="toggle-builder">
                    <span class="dashicons dashicons-edit"></span>
                </button>
            </div>
            <div class="builder-content">
                <div class="builder-tabs">
                    <button class="tab-btn active" data-tab="elements">Elements</button>
                    <button class="tab-btn" data-tab="templates">Templates</button>
                    <button class="tab-btn" data-tab="settings">Settings</button>
                </div>
                
                <div class="tab-content active" id="elements-tab">
                    <div class="element-category">
                        <h4>Basic Elements</h4>
                        <div class="element-grid">
                            <div class="element-item" data-type="heading">
                                <span class="dashicons dashicons-editor-textcolor"></span>
                                <span>Heading</span>
                            </div>
                            <div class="element-item" data-type="text">
                                <span class="dashicons dashicons-text"></span>
                                <span>Text</span>
                            </div>
                            <div class="element-item" data-type="image">
                                <span class="dashicons dashicons-format-image"></span>
                                <span>Image</span>
                            </div>
                            <div class="element-item" data-type="button">
                                <span class="dashicons dashicons-button"></span>
                                <span>Button</span>
                            </div>
                            <div class="element-item" data-type="video">
                                <span class="dashicons dashicons-video-alt3"></span>
                                <span>Video</span>
                            </div>
                            <div class="element-item" data-type="spacer">
                                <span class="dashicons dashicons-minus"></span>
                                <span>Spacer</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="element-category">
                        <h4>Layout Elements</h4>
                        <div class="element-grid">
                            <div class="element-item" data-type="section">
                                <span class="dashicons dashicons-layout"></span>
                                <span>Section</span>
                            </div>
                            <div class="element-item" data-type="column">
                                <span class="dashicons dashicons-columns"></span>
                                <span>Column</span>
                            </div>
                            <div class="element-item" data-type="container">
                                <span class="dashicons dashicons-grid-view"></span>
                                <span>Container</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="element-category">
                        <h4>Advanced Elements</h4>
                        <div class="element-grid">
                            <div class="element-item" data-type="slider">
                                <span class="dashicons dashicons-images-alt2"></span>
                                <span>Slider</span>
                            </div>
                            <div class="element-item" data-type="testimonial">
                                <span class="dashicons dashicons-format-quote"></span>
                                <span>Testimonial</span>
                            </div>
                            <div class="element-item" data-type="pricing">
                                <span class="dashicons dashicons-money-alt"></span>
                                <span>Pricing</span>
                            </div>
                            <div class="element-item" data-type="contact-form">
                                <span class="dashicons dashicons-email"></span>
                                <span>Contact Form</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="templates-tab">
                    <div class="template-grid">
                        <div class="template-item" data-template="hero">
                            <div class="template-preview">
                                <div class="preview-hero"></div>
                            </div>
                            <span>Hero Section</span>
                        </div>
                        <div class="template-item" data-template="features">
                            <div class="template-preview">
                                <div class="preview-features"></div>
                            </div>
                            <span>Features</span>
                        </div>
                        <div class="template-item" data-template="testimonials">
                            <div class="template-preview">
                                <div class="preview-testimonials"></div>
                            </div>
                            <span>Testimonials</span>
                        </div>
                        <div class="template-item" data-template="pricing">
                            <div class="template-preview">
                                <div class="preview-pricing"></div>
                            </div>
                            <span>Pricing Table</span>
                        </div>
                    </div>
                </div>
                
                <div class="tab-content" id="settings-tab">
                    <div class="settings-panel">
                        <h4>Page Settings</h4>
                        <div class="setting-group">
                            <label>Page Title</label>
                            <input type="text" id="page-title" placeholder="Enter page title">
                        </div>
                        <div class="setting-group">
                            <label>Background Color</label>
                            <input type="color" id="bg-color" value="#ffffff">
                        </div>
                        <div class="setting-group">
                            <label>Custom CSS</label>
                            <textarea id="custom-css" placeholder="Enter custom CSS"></textarea>
                        </div>
                        <button class="btn-primary" id="save-settings">Save Settings</button>
                    </div>
                </div>
            </div>
            
            <div class="builder-actions">
                <button class="btn-primary" id="save-page">Save Page</button>
                <button class="btn-secondary" id="preview-page">Preview</button>
                <button class="btn-secondary" id="clear-page">Clear All</button>
            </div>
        `;
        
        document.body.appendChild(builderPanel);
        
        // Create drop zones
        this.createDropZones();
    }

    createDropZones() {
        const content = document.querySelector('.site-content, #content, main');
        if (content) {
            content.innerHTML = `
                <div class="obsidian-canvas" id="page-canvas">
                    <div class="drop-zone" data-zone="main">
                        <div class="drop-placeholder">
                            <span class="dashicons dashicons-plus-alt"></span>
                            <p>Drag elements here to start building your page</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    bindEvents() {
        // Toggle builder panel
        document.addEventListener('click', (e) => {
            if (e.target.id === 'toggle-builder' || e.target.closest('#toggle-builder')) {
                this.toggleBuilder();
            }
        });

        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.switchTab(e.target.dataset.tab);
            }
        });

        // Element dragging
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('element-item')) {
                e.dataTransfer.setData('text/plain', e.target.dataset.type);
            }
        });

        // Drop zone handling
        document.addEventListener('dragover', (e) => {
            if (e.target.classList.contains('drop-zone')) {
                e.preventDefault();
                e.target.classList.add('drag-over');
            }
        });

        document.addEventListener('dragleave', (e) => {
            if (e.target.classList.contains('drop-zone')) {
                e.target.classList.remove('drag-over');
            }
        });

        document.addEventListener('drop', (e) => {
            if (e.target.classList.contains('drop-zone')) {
                e.preventDefault();
                e.target.classList.remove('drag-over');
                const elementType = e.dataTransfer.getData('text/plain');
                this.createElement(elementType, e.target);
            }
        });

        // Template insertion
        document.addEventListener('click', (e) => {
            if (e.target.closest('.template-item')) {
                const template = e.target.closest('.template-item').dataset.template;
                this.insertTemplate(template);
            }
        });

        // Save functionality
        document.addEventListener('click', (e) => {
            if (e.target.id === 'save-page') {
                this.savePage();
            } else if (e.target.id === 'preview-page') {
                this.previewPage();
            } else if (e.target.id === 'clear-page') {
                this.clearPage();
            }
        });
    }

    toggleBuilder() {
        const panel = document.getElementById('obsidian-builder');
        panel.classList.toggle('active');
        this.isEditing = !this.isEditing;
        
        if (this.isEditing) {
            document.body.classList.add('obsidian-editing');
        } else {
            document.body.classList.remove('obsidian-editing');
        }
    }

    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    createElement(type, dropZone) {
        const elementId = 'element-' + Date.now();
        let elementHTML = '';

        switch (type) {
            case 'heading':
                elementHTML = `
                    <div class="obsidian-element heading-element" data-type="heading" id="${elementId}">
                        <h2 contenteditable="true">Your Heading Here</h2>
                        <div class="element-controls">
                            <button class="edit-btn" title="Edit"><span class="dashicons dashicons-edit"></span></button>
                            <button class="delete-btn" title="Delete"><span class="dashicons dashicons-trash"></span></button>
                        </div>
                    </div>
                `;
                break;
            case 'text':
                elementHTML = `
                    <div class="obsidian-element text-element" data-type="text" id="${elementId}">
                        <p contenteditable="true">Your text content goes here. Click to edit this text and make it your own.</p>
                        <div class="element-controls">
                            <button class="edit-btn" title="Edit"><span class="dashicons dashicons-edit"></span></button>
                            <button class="delete-btn" title="Delete"><span class="dashicons dashicons-trash"></span></button>
                        </div>
                    </div>
                `;
                break;
            case 'image':
                elementHTML = `
                    <div class="obsidian-element image-element" data-type="image" id="${elementId}">
                        <img src="https://via.placeholder.com/600x300?text=Click+to+change+image" alt="Placeholder">
                        <div class="element-controls">
                            <button class="edit-btn" title="Edit"><span class="dashicons dashicons-edit"></span></button>
                            <button class="delete-btn" title="Delete"><span class="dashicons dashicons-trash"></span></button>
                        </div>
                    </div>
                `;
                break;
            case 'button':
                elementHTML = `
                    <div class="obsidian-element button-element" data-type="button" id="${elementId}">
                        <a href="#" class="obsidian-btn" contenteditable="true">Click Me</a>
                        <div class="element-controls">
                            <button class="edit-btn" title="Edit"><span class="dashicons dashicons-edit"></span></button>
                            <button class="delete-btn" title="Delete"><span class="dashicons dashicons-trash"></span></button>
                        </div>
                    </div>
                `;
                break;
            case 'section':
                elementHTML = `
                    <div class="obsidian-element section-element" data-type="section" id="${elementId}">
                        <div class="section-content">
                            <div class="drop-zone" data-zone="section">
                                <div class="drop-placeholder">
                                    <span class="dashicons dashicons-plus-alt"></span>
                                    <p>Drop elements here</p>
                                </div>
                            </div>
                        </div>
                        <div class="element-controls">
                            <button class="edit-btn" title="Edit"><span class="dashicons dashicons-edit"></span></button>
                            <button class="delete-btn" title="Delete"><span class="dashicons dashicons-trash"></span></button>
                        </div>
                    </div>
                `;
                break;
        }

        // Remove placeholder if it exists
        const placeholder = dropZone.querySelector('.drop-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        // Add element to drop zone
        dropZone.insertAdjacentHTML('beforeend', elementHTML);
        
        // Bind element events
        this.bindElementEvents(elementId);
    }

    bindElementEvents(elementId) {
        const element = document.getElementById(elementId);
        
        // Delete functionality
        element.querySelector('.delete-btn').addEventListener('click', () => {
            element.remove();
        });

        // Edit functionality
        element.querySelector('.edit-btn').addEventListener('click', () => {
            this.editElement(element);
        });
    }

    insertTemplate(templateType) {
        const canvas = document.getElementById('page-canvas');
        const dropZone = canvas.querySelector('.drop-zone[data-zone="main"]');
        
        let templateHTML = '';
        
        switch (templateType) {
            case 'hero':
                templateHTML = `
                    <div class="obsidian-template hero-template">
                        <div class="hero-section" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 100px 0; text-align: center; color: white;">
                            <div class="container">
                                <h1 style="font-size: 3rem; margin-bottom: 1rem;" contenteditable="true">Welcome to Your Amazing Website</h1>
                                <p style="font-size: 1.25rem; margin-bottom: 2rem;" contenteditable="true">Create something extraordinary with our powerful tools and beautiful designs</p>
                                <a href="#" class="obsidian-btn hero-btn" style="background: #ff6b6b; color: white; padding: 15px 30px; border-radius: 5px; text-decoration: none; display: inline-block;" contenteditable="true">Get Started Today</a>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'features':
                templateHTML = `
                    <div class="obsidian-template features-template">
                        <div class="features-section" style="padding: 80px 0; background: #f8f9fa;">
                            <div class="container">
                                <h2 style="text-align: center; margin-bottom: 3rem; font-size: 2.5rem;" contenteditable="true">Amazing Features</h2>
                                <div class="features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                                    <div class="feature-item" style="text-align: center; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                                        <div class="feature-icon" style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
                                        <h3 contenteditable="true">Fast Performance</h3>
                                        <p contenteditable="true">Lightning fast loading times and optimized performance for the best user experience.</p>
                                    </div>
                                    <div class="feature-item" style="text-align: center; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                                        <div class="feature-icon" style="font-size: 3rem; margin-bottom: 1rem;">🎨</div>
                                        <h3 contenteditable="true">Beautiful Design</h3>
                                        <p contenteditable="true">Stunning visual designs that captivate your audience and enhance your brand.</p>
                                    </div>
                                    <div class="feature-item" style="text-align: center; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.1);">
                                        <div class="feature-icon" style="font-size: 3rem; margin-bottom: 1rem;">📱</div>
                                        <h3 contenteditable="true">Mobile Responsive</h3>
                                        <p contenteditable="true">Perfect display on all devices, from desktop to mobile phones.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
        }
        
        // Remove placeholder
        const placeholder = dropZone.querySelector('.drop-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        dropZone.insertAdjacentHTML('beforeend', templateHTML);
    }

    savePage() {
        const canvas = document.getElementById('page-canvas');
        const pageData = {
            html: canvas.innerHTML,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage for now (in real implementation, save to database)
        localStorage.setItem('obsidian_page_data', JSON.stringify(pageData));
        
        // Show success message
        this.showNotification('Page saved successfully!', 'success');
    }

    previewPage() {
        document.body.classList.remove('obsidian-editing');
        document.getElementById('obsidian-builder').classList.remove('active');
        this.showNotification('Preview mode activated', 'info');
    }

    clearPage() {
        if (confirm('Are you sure you want to clear all content?')) {
            this.createDropZones();
            this.showNotification('Page cleared', 'info');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `obsidian-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    loadPresets() {
        // Load saved page data if exists
        const savedData = localStorage.getItem('obsidian_page_data');
        if (savedData) {
            const pageData = JSON.parse(savedData);
            const canvas = document.getElementById('page-canvas');
            if (canvas) {
                canvas.innerHTML = pageData.html;
            }
        }
    }
}

// Initialize builder when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('admin-bar')) {
        new ObsidianBuilder();
    }
});