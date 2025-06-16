<?php
// Admin UI and menu registration
// ...existing code...

function obsidian_render_admin_page() {
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have sufficient permissions.'));
    }
    ?>
    <style>
    /* Smartbotz-inspired admin UI styles */
    .obsidian-admin-bg {
        background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
        min-height: 100vh;
        padding: 40px 0;
    }
    .obsidian-admin-card {
        background: #fff;
        border-radius: 18px;
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.12);
        max-width: 540px;
        margin: 0 auto;
        padding: 2.5rem 2rem 2rem 2rem;
        position: relative;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    }
    .obsidian-admin-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
    }
    .obsidian-admin-logo {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: #2563eb;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 2rem;
        font-weight: bold;
        box-shadow: 0 2px 8px rgba(37,99,235,0.08);
    }
    .obsidian-admin-title {
        font-size: 1.7rem;
        font-weight: 700;
        color: #22223b;
        letter-spacing: -1px;
    }
    .obsidian-admin-form label {
        display: block;
        font-weight: 500;
        color: #374151;
        margin-bottom: 0.3rem;
        margin-top: 1.2rem;
    }
    .obsidian-admin-form input[type="text"],
    .obsidian-admin-form input[type="email"],
    .obsidian-admin-form input[type="password"],
    .obsidian-admin-form textarea,
    .obsidian-admin-form select {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 1.5px solid #cbd5e1;
        border-radius: 10px;
        font-size: 1rem;
        background: #f8fafc;
        color: #22223b;
        margin-bottom: 0.2rem;
        transition: border 0.2s;
        font-family: inherit;
    }
    .obsidian-admin-form input[type="text"]:focus,
    .obsidian-admin-form input[type="email"]:focus,
    .obsidian-admin-form input[type="password"]:focus,
    .obsidian-admin-form textarea:focus,
    .obsidian-admin-form select:focus {
        border-color: #2563eb;
        outline: none;
        background: #fff;
    }
    .obsidian-admin-form textarea {
        min-height: 90px;
        resize: vertical;
    }
    .obsidian-admin-form .obsidian-admin-btn {
        display: inline-block;
        width: 100%;
        margin-top: 2rem;
        padding: 0.9rem 0;
        background: linear-gradient(90deg, #2563eb 0%, #4f8cff 100%);
        color: #fff;
        font-size: 1.1rem;
        font-weight: 600;
        border: none;
        border-radius: 10px;
        box-shadow: 0 2px 8px rgba(37,99,235,0.08);
        cursor: pointer;
        transition: background 0.2s, transform 0.1s;
    }
    .obsidian-admin-form .obsidian-admin-btn:hover {
        background: linear-gradient(90deg, #1e40af 0%, #2563eb 100%);
        transform: translateY(-2px) scale(1.01);
    }
    .obsidian-admin-form .obsidian-admin-section {
        margin-bottom: 1.5rem;
    }
    .char-count {
        text-align: right;
        font-size: 0.875rem;
        color: #6b7280;
        margin-top: 0.5rem;
    }
    .example-options {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;
        flex-wrap: wrap;
    }
    .example-chip {
        background: #f3f4f6;
        border: none;
        border-radius: 9999px;
        padding: 0.5rem 1.2rem;
        font-size: 0.98rem;
        color: #22223b;
        cursor: pointer;
        transition: background 0.2s;
    }
    .example-chip:hover {
        background: #e0e7ef;
    }
    .step-indicator {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        position: relative;
    }
    .step-indicator::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 2px;
        background: #e5e7eb;
        z-index: 1;
    }
    .step {
        position: relative;
        z-index: 2;
        background: #fff;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        color: #6b7280;
        border: 2px solid #e5e7eb;
    }
    .step.active {
        background: #2563eb;
        color: #fff;
        border-color: #2563eb;
    }
    .step.completed {
        background: #10b981;
        color: #fff;
        border-color: #10b981;
    }
    .step-label {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #6b7280;
        white-space: nowrap;
    }
    .step.active .step-label {
        color: #2563eb;
        font-weight: 500;
    }
    .step.completed .step-label {
        color: #10b981;
    }
    #obsidian-progress {
        text-align: center;
        padding: 2rem;
        background: #f8fafc;
        border-radius: 12px;
        margin: 2rem 0;
    }
    #obsidian-download {
        text-align: center;
        padding: 2.5rem;
        background: #f0fdf4;
        border-radius: 16px;
        margin: 2rem 0;
        border: 1px solid #dcfce7;
    }
    #obsidian-download p {
        font-size: 1.2rem;
        color: #166534;
        margin-bottom: 1.5rem;
        font-weight: 500;
    }
    .form-section {
        display: none;
    }
    .form-section.active {
        display: block;
    }
    @media (max-width: 600px) {
        .obsidian-admin-card {
            padding: 1.2rem 0.5rem 1.5rem 0.5rem;
        }
        .obsidian-admin-header {
            flex-direction: column;
            align-items: flex-start;
        }
        .example-options {
            flex-direction: column;
        }
        .example-chip {
            width: 100%;
            text-align: center;
        }
    }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <div class="obsidian-admin-bg">
        <div class="obsidian-admin-card">
            <div class="obsidian-admin-header">
                <img src="includes/assets/logo/image.png" class="obsidian-admin-logo" alt="Obsidian Logo" style="height:48px;width:auto;" />
            </div>

            <div class="step-indicator">
                <div class="step active" data-step="welcome">
                    <span>1</span>
                    <span class="step-label">Welcome</span>
                </div>
                <div class="step" data-step="signin">
                    <span>2</span>
                    <span class="step-label">Sign In</span>
                </div>
                <div class="step" data-step="ideation">
                    <span>3</span>
                    <span class="step-label">Ideation</span>
                </div>
                <div class="step" data-step="generate">
                    <span>4</span>
                    <span class="step-label">Generate</span>
                </div>
            </div>

            <form class="obsidian-admin-form" method="post" id="obsidian-generate-form">
                <?php wp_nonce_field('obsidian_generate_site', 'obsidian_generate_site_nonce'); ?>
                
                <!-- Welcome Step -->
                <div class="form-section active" id="welcome-section">
                    <h2>Welcome to Obsidian Site Generator</h2>
                    <p>Create beautiful static websites with AI in minutes. Let's get started!</p>
                    <button type="button" class="obsidian-admin-btn" onclick="nextStep('signin')">Get Started</button>
                </div>

                <!-- Sign In Step -->
                <div class="form-section" id="signin-section">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" name="email" required placeholder="Enter your email">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required placeholder="Enter your password">
                    </div>
                    <p>Don't have an account? <a href="#" onclick="showSignUp()">Sign up</a></p>
                    <button type="button" class="obsidian-admin-btn" onclick="nextStep('ideation')">Continue</button>
                </div>

                <!-- Ideation Step -->
                <div class="form-section" id="ideation-section">
                    <div class="form-group">
                        <label for="site_idea">Describe your website idea</label>
                        <textarea id="site_idea" name="site_idea" maxlength="200" required placeholder="Describe your website idea..."></textarea>
                        <div class="char-count"><span id="charCount">0</span>/200</div>
                        <div class="example-options">
                            <button type="button" class="example-chip" onclick="fillPrompt('A modern fashion website for a boutique store')">Fashion Website</button>
                            <button type="button" class="example-chip" onclick="fillPrompt('A clean dental website for a local clinic')">Dental Website</button>
                            <button type="button" class="example-chip" onclick="fillPrompt('A portfolio for a photographer')">Photographer Portfolio</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="template">Template Style</label>
                        <select id="template" name="template" required>
                            <option value="default">Default Template</option>
                            <option value="modern">Modern Template</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="color_scheme">Color Scheme</label>
                        <select id="color_scheme" name="color_scheme" required>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="content_tone">Content Tone</label>
                        <select id="content_tone" name="content_tone" required>
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                        </select>
                    </div>

                    <button type="button" class="obsidian-admin-btn" onclick="nextStep('generate')">Continue</button>
                </div>

                <!-- Generate Step -->
                <div class="form-section" id="generate-section">
                    <h2>Review Your Choices</h2>
                    <div id="review-choices"></div>
                    <button type="submit" class="obsidian-admin-btn">Generate Site</button>
                </div>
            </form>

            <div id="obsidian-progress" style="display: none;">
                <p>Generating your static site... Please wait.</p>
            </div>
            
            <div id="obsidian-download" style="display: none;">
                <p>Your static site is ready!</p>
                <button id="download-site" class="obsidian-admin-btn">Download Static Site</button>
            </div>
        </div>
    </div>
    <script>
    jQuery(document).ready(function($) {
        // Handle character count
        $('#site_idea').on('input', function() {
            const maxLength = 200;
            const currentLength = $(this).val().length;
            $('#charCount').text(currentLength);
            
            if (currentLength > maxLength) {
                $(this).val($(this).val().substring(0, maxLength));
                $('#charCount').text(maxLength);
            }
        });

        // Handle form submission
        $('#obsidian-generate-form').on('submit', function(e) {
            e.preventDefault();
            
            // Show progress
            $('#obsidian-progress').show();
            $('.obsidian-admin-btn').prop('disabled', true);
            
            // Collect form data
            const formData = {
                email: $('#email').val(),
                site_idea: $('#site_idea').val(),
                template: $('#template').val(),
                color_scheme: $('#color_scheme').val(),
                content_tone: $('#content_tone').val()
            };
            
            // Send AJAX request to WordPress plugin
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'obsidian_generate_site',
                    nonce: $('#obsidian_generate_site_nonce').val(),
                    ...formData
                },
                success: function(response) {
                    if (response.success) {
                        // Hide progress and show download option
                        $('#obsidian-progress').hide();
                        $('#obsidian-download').show();
                        
                        // Set download URL from backend response
                        if (response.data && response.data.download_url) {
                            $('#download-site').data('url', response.data.download_url);
                        } else {
                            alert('Error: No download URL received from server');
                            $('.obsidian-admin-btn').prop('disabled', false);
                        }
                    } else {
                        alert('Error: ' + (response.data || 'Unknown error occurred'));
                        $('#obsidian-progress').hide();
                        $('.obsidian-admin-btn').prop('disabled', false);
                    }
                },
                error: function(xhr, status, error) {
                    alert('Error generating site: ' + error);
                    $('#obsidian-progress').hide();
                    $('.obsidian-admin-btn').prop('disabled', false);
                }
            });
        });

        // Handle download
        $('#download-site').on('click', function() {
            const downloadUrl = $(this).data('url');
            if (downloadUrl) {
                window.location.href = downloadUrl;
            } else {
                alert('Download URL not available. Please try generating the site again.');
            }
        });
    });

    // Fill prompt with example
    function fillPrompt(text) {
        document.getElementById('site_idea').value = text;
        document.getElementById('charCount').textContent = text.length;
    }

    // Step navigation
    function nextStep(step) {
        // Hide all sections
        $('.form-section').removeClass('active');
        
        // Show selected section
        $(`#${step}-section`).addClass('active');
        
        // Update step indicators
        $('.step').removeClass('active completed');
        const steps = ['welcome', 'signin', 'ideation', 'generate'];
        const currentIndex = steps.indexOf(step);
        
        steps.forEach((s, index) => {
            if (index < currentIndex) {
                $(`.step[data-step="${s}"]`).addClass('completed');
            } else if (index === currentIndex) {
                $(`.step[data-step="${s}"]`).addClass('active');
            }
        });

        // If we're on the generate step, show review
        if (step === 'generate') {
            const review = `
                <p><strong>Email:</strong> ${$('#email').val()}</p>
                <p><strong>Website Idea:</strong> ${$('#site_idea').val()}</p>
                <p><strong>Template:</strong> ${$('#template').val()}</p>
                <p><strong>Color Scheme:</strong> ${$('#color_scheme').val()}</p>
                <p><strong>Content Tone:</strong> ${$('#content_tone').val()}</p>
            `;
            $('#review-choices').html(review);
        }
    }

    function showSignUp() {
        // TODO: Implement sign up functionality
        alert('Sign up functionality coming soon!');
    }
    </script>
    <?php
}

add_action('admin_menu', function () {
    // Only register the onboarding wizard as the main entry point
    remove_menu_page('obsidian-generator'); // Remove any previous menu
    add_menu_page(
        'Obsidian Site Generator',
        'Obsidian Generator',
        'manage_options',
        'obsidian-generator',
        [$GLOBALS['obsidian_onboarding'], 'render_onboarding_page'],
        'dashicons-admin-site',
        100
    );
    add_submenu_page(
        'obsidian-generator',
        'API Docs',
        'API Docs',
        'manage_options',
        'obsidian-api-docs',
        'obsidian_render_api_docs_page'
    );
});

function obsidian_render_api_docs_page() {
    ?>
    <div class="wrap" style="max-width: 900px; margin: 40px auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(31,38,135,0.08); padding: 2.5rem 2rem;">
        <h1 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">Obsidian API Documentation</h1>
        <p style="color: #6b7280; margin-bottom: 2rem;">Use these endpoints to programmatically create, edit, delete, and list pages from an external agent or backend. All requests require a valid Bearer token in the Authorization header.</p>
        <h2 style="font-size: 1.3rem; margin-top: 2rem;">Authentication</h2>
        <pre class="api-doc-block"><code>Authorization: Bearer &lt;your-token&gt;</code></pre>
        <h2 style="font-size: 1.3rem; margin-top: 2rem;">Endpoints</h2>
        <div class="api-doc-section">
            <h3>1. Create Page</h3>
            <pre class="api-doc-block"><code>POST /wp-json/obsidian/v1/page
Content-Type: application/json

{
  "title": "My AI Page",
  "slug": "my-ai-page",
  "content": "&lt;h1&gt;Hello from the agent!&lt;/h1&gt;",
  "status": "publish"
}</code></pre>
            <button class="api-copy-btn" onclick="copyApiDoc(this)">Copy</button>
            <div class="api-doc-response">
                <strong>Response:</strong>
                <pre class="api-doc-block"><code>{ "success": true, "id": 123 }</code></pre>
            </div>
        </div>
        <div class="api-doc-section">
            <h3>2. Edit Page</h3>
            <pre class="api-doc-block"><code>PUT /wp-json/obsidian/v1/page/123
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "&lt;h1&gt;Updated content&lt;/h1&gt;"
}</code></pre>
            <button class="api-copy-btn" onclick="copyApiDoc(this)">Copy</button>
            <div class="api-doc-response">
                <strong>Response:</strong>
                <pre class="api-doc-block"><code>{ "success": true, "id": 123 }</code></pre>
            </div>
        </div>
        <div class="api-doc-section">
            <h3>3. Delete Page</h3>
            <pre class="api-doc-block"><code>DELETE /wp-json/obsidian/v1/page/123
Authorization: Bearer &lt;your-token&gt;</code></pre>
            <button class="api-copy-btn" onclick="copyApiDoc(this)">Copy</button>
            <div class="api-doc-response">
                <strong>Response:</strong>
                <pre class="api-doc-block"><code>{ "success": true, "id": 123 }</code></pre>
            </div>
        </div>
        <div class="api-doc-section">
            <h3>4. List Pages</h3>
            <pre class="api-doc-block"><code>GET /wp-json/obsidian/v1/pages
Authorization: Bearer &lt;your-token&gt;</code></pre>
            <button class="api-copy-btn" onclick="copyApiDoc(this)">Copy</button>
            <div class="api-doc-response">
                <strong>Response:</strong>
                <pre class="api-doc-block"><code>{
  "success": true,
  "pages": [
    { "id": 123, "title": "My AI Page", "slug": "my-ai-page", "status": "publish", "content": "&lt;h1&gt;Hello from the agent!&lt;/h1&gt;" },
    ...
  ]
}</code></pre>
            </div>
        </div>
        <style>
        .api-doc-block { background: #f8f9fa; border-radius: 8px; padding: 1rem; font-size: 0.98rem; margin-bottom: 0.5rem; overflow-x: auto; }
        .api-doc-section { margin-bottom: 2.5rem; }
        .api-copy-btn { background: #6e3aff; color: #fff; border: none; border-radius: 6px; padding: 0.4rem 1.2rem; font-size: 0.98rem; cursor: pointer; margin-bottom: 1rem; transition: background 0.2s; }
        .api-copy-btn:hover { background: #3a7aff; }
        .api-doc-response { margin-top: 0.5rem; }
        </style>
        <script>
        function copyApiDoc(btn) {
            const code = btn.previousElementSibling.querySelector('code').innerText;
            navigator.clipboard.writeText(code);
            btn.innerText = 'Copied!';
            setTimeout(() => { btn.innerText = 'Copy'; }, 1200);
        }
        </script>
    </div>
    <?php
}

// ...existing code...

