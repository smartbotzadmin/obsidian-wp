<?php
if (!defined('ABSPATH')) exit;

class ObsidianOnboarding {
    private $current_step;    private $steps = [
        'welcome' => 'Welcome',
        'signin' => 'Sign In',
        'ideation' => 'Describe Your Site'
    ];

    public function __construct() {
        add_action('admin_init', [$this, 'handle_onboarding_actions']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_scripts']);
    }

    public function enqueue_scripts($hook) {
        if ($hook !== 'toplevel_page_obsidian-generator') {
            return;
        }
        wp_enqueue_style('obsidian-onboarding', plugins_url('assets/onboarding.css', __FILE__));
        wp_enqueue_script('obsidian-onboarding', plugins_url('assets/onboarding.js', __FILE__), ['jquery'], '1.0', true);
        wp_localize_script('obsidian-onboarding', 'obsidianOnboarding', [
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('obsidian_onboarding_nonce')
        ]);
    }

    public function render_onboarding_page() {
        $this->current_step = isset($_GET['step']) ? sanitize_text_field($_GET['step']) : 'welcome';
        if (!array_key_exists($this->current_step, $this->steps)) {
            $this->current_step = 'welcome';
        }
        ?>
        <div class="obsidian-onboarding">
            <div class="obsidian-onboarding-header" style="background:none;box-shadow:none;padding:0;margin-bottom:32px;">
                <img src="<?php echo plugins_url('/assets/logo/image.png', __FILE__); ?>" class="obsidian-onboarding-logo" alt="Obsidian Logo" style="height:50px;width:auto;background:none;box-shadow:none;display:inline;" />
            </div>
            
            <div class="obsidian-onboarding-steps">
                <?php foreach ($this->steps as $step_key => $step_name) : ?>
                    <div class="obsidian-step <?php echo $step_key === $this->current_step ? 'active' : ''; ?>">
                        <div class="obsidian-step-number"><?php echo array_search($step_key, array_keys($this->steps)) + 1; ?></div>
                        <div class="obsidian-step-name"><?php echo $step_name; ?></div>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="obsidian-onboarding-content">
                <?php $this->render_step_content(); ?>
            </div>
        </div>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            var logoImg = document.getElementById('obsidian-onboarding-logo-img');
            if (logoImg) {
                logoImg.src = 'includes/assets/logo/image.png';
            }
        });
        </script>
        <?php
    }

    private function render_step_content() {
        switch ($this->current_step) {
            case 'welcome':
                $this->render_welcome_step();
                break;
            case 'signin':
                $this->render_signin_step();
                break;
            case 'ideation':
                $this->render_ideation_step();
                break;
            case 'customization':
                $this->render_customization_step();
                break;
        }
    }

    private function render_welcome_step() {
        ?>
        <div class="obsidian-welcome-step">
            <style>
                /* Add smooth fade-in animation for the onboarding welcome step */
                .obsidian-welcome-step {
                    animation: fadeIn 0.5s ease-in-out;
                }
                .obsidian-welcome-content {
                    animation: fadeIn 0.5s ease-in-out;
                }
                .obsidian-welcome-content h2,
                .obsidian-welcome-content p,
                .obsidian-welcome-features,
                .obsidian-feature {
                    animation: fadeIn 0.5s ease-in-out;
                }
                /* Add hover effect for feature cards */
                .obsidian-feature {
                    transition: transform 0.3s ease;
                }
                .obsidian-feature:hover {
                    transform: translateY(-5px);
                }
                /* Add hover effect for the 'Get Started' button */
                .obsidian-button-primary {
                    transition: background-color 0.3s ease;
                }
                .obsidian-button-primary:hover {
                    background-color: #0056b3;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            </style>
            <div class="obsidian-welcome-content">
                <h2>Welcome to Obsidian Site Generator</h2>
                <p class="obsidian-welcome-subtitle">Create a beautiful static website in minutes</p>
                <div class="obsidian-welcome-features">
                    <div class="obsidian-feature">
                        <div class="obsidian-feature-icon">⚡️</div>
                        <h3>Lightning Fast</h3>
                        <p>Generate static sites that load instantly</p>
                    </div>
                    <div class="obsidian-feature">
                        <div class="obsidian-feature-icon">🎨</div>
                        <h3>Beautiful Templates</h3>
                        <p>Choose from professionally designed templates</p>
                    </div>
                    <div class="obsidian-feature">
                        <div class="obsidian-feature-icon">🔒</div>
                        <h3>Secure & Reliable</h3>
                        <p>Built with modern security practices</p>
                    </div>
                </div>
                <a href="?page=obsidian-generator&step=signin" class="obsidian-button obsidian-button-primary">Get Started</a>
            </div>
        </div>
        <?php
    }

    private function render_signin_step() {
        $redirect_url = "http%3A%2F%2Fobsidian-wp-plugin.local%2Fwp-admin%2Fadmin.php%3Fpage%3Dobsidian-generator%26step%3Dideation";
        // $redirect_url = "http://localhost:3000";
        $auth_url = "http://localhost:8081/wp-auth?redirect_url=" . $redirect_url;
        ?>
        <div class="obsidian-signin-step">
            <style>
                .obsidian-signin-form {
                    max-width: 320px;
                    text-align: center;
                    background: transparent;
                    border-radius: 8px;
                    padding: 16px;
                    margin-top: 16px;
                }
                .obsidian-button-primary {
                    display: inline-block;
                    width: 100%;
                    padding: 12px;
                    background: #2563eb;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    font-size: 14px;
                }
                .obsidian-signup-link {
                    margin-top: 12px;
                    color: #9ca3af;
                    font-size: 13px;
                }
                .obsidian-signup-link a {
                    color: #2563eb;
                    text-decoration: none;
                }
                .obsidian-signup-link a:hover {
                    text-decoration: underline;
                }
                .obsidian-signin-content h2 {
                    font-size: 24px;
                    margin-bottom: 0;
                }
            </style>
            <div class="obsidian-signin-content">
                <h2>Sign in to Obsidian</h2>
                <p class="obsidian-signin-subtitle"></p>

                <div class="obsidian-signin-form">
                    <a href="<?php echo esc_url($auth_url); ?>" class="obsidian-button obsidian-button-primary">Continue with obsidian</a>
                    <!-- <div class="obsidian-signup-link">
                        Don't have an account? <a href="https://smartbotz.vercel.app" target="_blank">Sign up</a>
                    </div> -->
                </div>
            </div>
        </div>
        <?php
    }

    private function render_ideation_step() {
        ?>
        <div class="obsidian-ideation-step">
            <div class="obsidian-ideation-content">
                <h2>Describe Your Website</h2>
                <p class="obsidian-ideation-subtitle">What kind of static website do you want to generate? Be creative! for example</p>

                <div class="obsidian-example-chips">
                    <button type="button" class="obsidian-chip" onclick="fillPrompt('A modern fashion website for a boutique store')">
                        Fashion<br/>Website
                    </button>
                    <button type="button" class="obsidian-chip" onclick="fillPrompt('A clean dental website for a local clinic')">
                        Dental<br/>Website
                    </button>
                    <button type="button" class="obsidian-chip" onclick="fillPrompt('A portfolio for a photographer')">
                        Photographer<br/>Website
                    </button>
                </div>

                <form method="post" id="obsidian-ideation-form">
                    <?php wp_nonce_field('obsidian_onboarding_ideation', 'obsidian_onboarding_ideation_nonce'); ?>
                    <div class="obsidian-form-group">
                        <label for="obsidian_site_prompt">Your website idea</label>
                        <textarea 
                            id="obsidian_site_prompt" 
                            name="obsidian_site_prompt" 
                            maxlength="200" 
                            placeholder="e.g. A modern fashion website for a boutique store" 
                            required 
                            oninput="updateCharCount()"
                        ></textarea>
                        <div class="obsidian-form-footer">
                            <span id="charCount">0/200</span>
                            <button type="submit" name="obsidian_onboarding_action" value="submit_ideation" class="obsidian-button obsidian-button-primary">
                                Continue
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <script>
        function fillPrompt(text) {
            document.getElementById('obsidian_site_prompt').value = text;
            updateCharCount();
        }
        function updateCharCount() {
            const textarea = document.getElementById('obsidian_site_prompt');
            document.getElementById('charCount').innerText = `${textarea.value.length}/200`;
        }
        document.addEventListener('DOMContentLoaded', function() {
            updateCharCount();
        });
        </script>
        <?php
    }

    private function render_customization_step() {
        ?>
        <div class="obsidian-onboarding-step" id="obsidian-customization-step">
            <h2>Customize Your Site</h2>
            <form method="post" id="obsidian-customization-form">
                <?php wp_nonce_field('obsidian_customization', 'obsidian_customization_nonce'); ?>
                <div class="obsidian-form-group">
                    <label for="template-select">Template Style</label>
                    <select id="template-select" name="template" required>
                        <option value="default">Default Template</option>
                        <option value="modern">Modern Template</option>
                    </select>
                </div>
                <div class="obsidian-form-group">
                    <label for="color-scheme">Color Scheme</label>
                    <select id="color-scheme" name="color_scheme" required>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                    </select>
                </div>
                <div class="obsidian-form-group">
                    <label for="content-tone">Content Tone</label>
                    <select id="content-tone" name="content_tone" required>
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                    </select>
                </div>
                <div class="obsidian-form-actions">
                    <button type="submit" name="obsidian_onboarding_action" value="customization" class="obsidian-btn obsidian-btn-primary">Generate Site</button>
                </div>
            </form>
        </div>
        <script>
        jQuery(document).ready(function($) {
            $('#obsidian-customization-form').on('submit', function(e) {
                e.preventDefault();
                const form = $(this);
                const submitBtn = form.find('button[type="submit"]');
                
                submitBtn.prop('disabled', true).text('Generating...');
                
                $.ajax({
                    url: ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'obsidian_customization',
                        nonce: $('#obsidian_customization_nonce').val(),
                        template: $('#template-select').val(),
                        color_scheme: $('#color-scheme').val(),
                        content_tone: $('#content-tone').val()
                    },
                    success: function(response) {
                        if (response.success) {
                            window.location.href = response.data.redirect_url;
                        } else {
                            alert(response.data.message || 'Failed to save customization. Please try again.');
                            submitBtn.prop('disabled', false).text('Generate Site');
                        }
                    },
                    error: function() {
                        alert('An error occurred. Please try again.');
                        submitBtn.prop('disabled', false).text('Generate Site');
                    }
                });
            });
        });
        </script>
        <?php
    }

    public function handle_onboarding_actions() {
        if (!isset($_POST['obsidian_onboarding_action'])) {
            return;
        }

        $action = sanitize_text_field($_POST['obsidian_onboarding_action']);
        switch ($action) {
            case 'submit_ideation':
                check_admin_referer('obsidian_onboarding_ideation', 'obsidian_onboarding_ideation_nonce');
                $prompt = sanitize_text_field($_POST['obsidian_site_prompt']);
                update_user_meta(get_current_user_id(), 'obsidian_site_prompt', $prompt);
                wp_redirect(admin_url('admin.php?page=obsidian-generator&step=customization'));
                exit;

            case 'signin':
                check_admin_referer('obsidian_signin', 'obsidian_signin_nonce');
                $email = sanitize_email($_POST['email']);
                $password = $_POST['password'];
                
                // For demo purposes, accept any valid email format
                if (!is_email($email)) {
                    wp_send_json_error(['message' => 'Please enter a valid email address.']);
                }
                
                // Store the email in user meta
                update_user_meta(get_current_user_id(), 'obsidian_user_email', $email);
                
                wp_send_json_success(['message' => 'Sign in successful']);
                break;

            case 'customization':
                check_admin_referer('obsidian_customization', 'obsidian_customization_nonce');
                $template = sanitize_text_field($_POST['template']);
                $color_scheme = sanitize_text_field($_POST['color_scheme']);
                $content_tone = sanitize_text_field($_POST['content_tone']);
                
                // Store customization options
                $customization = [
                    'template' => $template,
                    'color_scheme' => $color_scheme,
                    'content_tone' => $content_tone
                ];
                update_user_meta(get_current_user_id(), 'obsidian_customization', $customization);
                
                // Trigger site generation
                $site_data = [
                    'prompt' => get_user_meta(get_current_user_id(), 'obsidian_site_prompt', true),
                    'customization' => $customization
                ];
                
                // Send to backend for generation
                $response = wp_remote_post('https://obsidianbackend.example.com/generate', [
                    'body' => json_encode($site_data),
                    'headers' => ['Content-Type' => 'application/json']
                ]);
                
                if (is_wp_error($response)) {
                    wp_send_json_error(['message' => 'Failed to generate site. Please try again.']);
                }
                
                $body = wp_remote_retrieve_body($response);
                $data = json_decode($body, true);
                
                if (!$data || !isset($data['download_url'])) {
                    wp_send_json_error(['message' => 'Invalid response from server.']);
                }
                
                // Store the download URL
                update_user_meta(get_current_user_id(), 'obsidian_download_url', $data['download_url']);
                
                wp_send_json_success([
                    'message' => 'Site generated successfully!',
                    'redirect_url' => admin_url('admin.php?page=obsidian-generator&step=download')
                ]);
                break;
        }
    }
}

// Add AJAX handlers
add_action('wp_ajax_obsidian_signin', function() {
    check_ajax_referer('obsidian_signin', 'nonce');
    $email = sanitize_email($_POST['email']);
    $password = $_POST['password'];
    
    if (!is_email($email)) {
        wp_send_json_error(['message' => 'Please enter a valid email address.']);
    }
    
    update_user_meta(get_current_user_id(), 'obsidian_user_email', $email);
    wp_send_json_success(['message' => 'Sign in successful']);
});

add_action('wp_ajax_obsidian_customization', function() {
    check_ajax_referer('obsidian_customization', 'nonce');
    $template = sanitize_text_field($_POST['template']);
    $color_scheme = sanitize_text_field($_POST['color_scheme']);
    $content_tone = sanitize_text_field($_POST['content_tone']);
    
    $customization = [
        'template' => $template,
        'color_scheme' => $color_scheme,
        'content_tone' => $content_tone
    ];
    update_user_meta(get_current_user_id(), 'obsidian_customization', $customization);
    
    wp_send_json_success([
        'message' => 'Customization saved successfully!',
        'redirect_url' => admin_url('admin.php?page=obsidian-generator&step=download')
    ]);
});

// Initialize the onboarding wizard
new ObsidianOnboarding();
new ObsidianOnboarding();