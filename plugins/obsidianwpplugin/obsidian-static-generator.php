<?php
/*
Plugin Name: Obsidian Static Site Generator
Plugin URI: https://obsidian.space
Description: Generate static websites from your WordPress content or custom inputs.
Version: 1.0
Author: Obsidian Team
License: GPL2
*/

if (!defined('ABSPATH')) exit; // Exit if accessed directly

// Include settings and logs modules
// require_once plugin_dir_path(__FILE__) . 'includes/settings.php';
// require_once plugin_dir_path(__FILE__) . 'includes/logs.php';
require_once plugin_dir_path(__FILE__) . 'includes/admin-ui.php';
require_once plugin_dir_path(__FILE__) . 'includes/onboarding.php';

// Initialize the onboarding wizard
$GLOBALS['obsidian_onboarding'] = new ObsidianOnboarding();

// Add AJAX handlers for onboarding
add_action('wp_ajax_obsidian_create_pages', function() {
    check_ajax_referer('obsidian_onboarding_nonce', 'nonce');
    
    // Temporarily disable permission check
    // if (!current_user_can('manage_options')) {
    //     wp_send_json_error('Insufficient permissions');
    // }

    $pages = isset($_POST['pages']) ? array_map('sanitize_text_field', $_POST['pages']) : [];
    $template = isset($_POST['template']) ? sanitize_text_field($_POST['template']) : 'business';
    
    // Always create home page
    $home_page = wp_insert_post([
        'post_title' => 'Home',
        'post_name' => 'home',
        'post_status' => 'draft',
        'post_type' => 'page'
    ]);

    if (is_wp_error($home_page)) {
        wp_send_json_error('Error creating home page');
    }

    foreach ($pages as $page_slug) {
        if ($page_slug === 'home') continue;
        $title = ucfirst($page_slug);
        $page = wp_insert_post([
            'post_title' => $title,
            'post_name' => $page_slug,
            'post_status' => 'draft',
            'post_type' => 'page',
            'post_content' => "This is a draft page for {$title}. Edit this content to customize your page."
        ]);

        if (is_wp_error($page)) {
            wp_send_json_error("Error creating {$title} page");
        }
    }

    wp_send_json_success();
});

add_action('wp_ajax_obsidian_publish_site', function() {
    check_ajax_referer('obsidian_onboarding_nonce', 'nonce');
    
    // Temporarily disable permission check
    // if (!current_user_can('manage_options')) {
    //     wp_send_json_error('Insufficient permissions');
    // }

    $publish_option = isset($_POST['publish_option']) ? sanitize_text_field($_POST['publish_option']) : 'now';
    
    // Get all draft pages
    $draft_pages = get_pages(['post_status' => 'draft']);
    
    if (empty($draft_pages)) {
        wp_send_json_error('No draft pages found');
    }

    // Prepare site data
    $site_data = [
        'title' => get_bloginfo('name'),
        'type' => 'multi',
        'pages' => [],
        'settings' => [
            'seo' => [
                'title' => get_bloginfo('name'),
                'description' => get_bloginfo('description')
            ],
            'analytics' => [
                'google_analytics_id' => '',
                'facebook_pixel_id' => ''
            ]
        ]
    ];

    foreach ($draft_pages as $page) {
        $site_data['pages'][] = [
            'title' => $page->post_title,
            'slug' => $page->post_name,
            'content' => $page->post_content,
            'template' => 'default'
        ];
    }

    // Initialize the generator
    $generator = new ObsidianSiteGenerator();
    $result = $generator->generate_site($site_data);

    if (is_wp_error($result)) {
        wp_send_json_error($result->get_error_message());
    }

    wp_send_json_success(['download_url' => $result]);
});

// Handle AJAX request to generate static site
add_action('wp_ajax_obsidian_generate_site', 'obsidian_generate_site_callback');
function obsidian_generate_site_callback() {
    check_ajax_referer('obsidian_generate_site', 'nonce');
    
    // Temporarily disable permission check
    // if (!current_user_can('manage_options')) {
    //     wp_send_json_error('Insufficient permissions');
    // }

    // Collect all user inputs
    $site_data = array(
        'email' => sanitize_email($_POST['email']),
        'site_idea' => sanitize_text_field($_POST['site_idea']),
        'customization' => array(
            'template' => sanitize_text_field($_POST['template']),
            'color_scheme' => sanitize_text_field($_POST['color_scheme']),
            'content_tone' => sanitize_text_field($_POST['content_tone'])
        )
    );

    // Send data to external backend service
    $backend_url = get_option('obsidian_backend_url', 'https://obsidianbackend.example.com');
    $backend_response = wp_remote_post($backend_url . '/generate', array(
        'body' => json_encode($site_data),
        'headers' => array(
            'Content-Type' => 'application/json',
            'Accept' => 'application/json'
        ),
        'timeout' => 300 // 5 minutes timeout for generation
    ));

    if (is_wp_error($backend_response)) {
        wp_send_json_error('Failed to communicate with backend service');
        return;
    }

    $response_code = wp_remote_retrieve_response_code($backend_response);
    if ($response_code !== 200) {
        wp_send_json_error('Backend service returned error code: ' . $response_code);
        return;
    }

    $body = wp_remote_retrieve_body($backend_response);
    $data = json_decode($body, true);

    if (!$data || !isset($data['download_url'])) {
        wp_send_json_error('Invalid response from backend service');
        return;
    }

    // Store the site data and download URL in user meta for future reference
    $user_id = get_current_user_id();
    update_user_meta($user_id, 'obsidian_last_site_data', $site_data);
    update_user_meta($user_id, 'obsidian_last_download_url', $data['download_url']);

    // Return success with download URL
    wp_send_json_success(array(
        'download_url' => $data['download_url'],
        'message' => 'Site generated successfully!'
    ));
}

// Register REST API endpoints for external service integration
add_action('rest_api_init', function() {
    register_rest_route('obsidian/v1', '/page', [
        'methods' => 'POST',
        'callback' => 'obsidian_api_create_page',
        'permission_callback' => 'obsidian_api_token_permission_callback'
    ]);
    register_rest_route('obsidian/v1', '/page/(?P<id>\\d+)', [
        'methods' => 'PUT',
        'callback' => 'obsidian_api_edit_page',
        'permission_callback' => 'obsidian_api_token_permission_callback'
    ]);
    register_rest_route('obsidian/v1', '/page/(?P<id>\\d+)', [
        'methods' => 'DELETE',
        'callback' => 'obsidian_api_delete_page',
        'permission_callback' => 'obsidian_api_token_permission_callback'
    ]);
    register_rest_route('obsidian/v1', '/pages', [
        'methods' => 'GET',
        'callback' => 'obsidian_api_list_pages',
        'permission_callback' => 'obsidian_api_token_permission_callback'
    ]);
});

// API token validation
function obsidian_api_token_permission_callback() {
    $headers = getallheaders();
    $auth = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');
    if (!$auth || stripos($auth, 'Bearer ') !== 0) {
        return false;
    }
    $token = trim(str_ireplace('Bearer', '', $auth));
    $valid_token = get_option('obsidian_api_token');
    return $valid_token && hash_equals($valid_token, $token);
}

// REST API endpoint handlers
function obsidian_api_create_page($request) {
    $params = $request->get_json_params();
    $title = sanitize_text_field($params['title'] ?? 'Untitled');
    $slug = sanitize_title($params['slug'] ?? '');
    $content = wp_kses_post($params['content'] ?? '');
    $status = $params['status'] === 'publish' ? 'publish' : 'draft';
    
    $page_id = wp_insert_post([
        'post_title' => $title,
        'post_name' => $slug,
        'post_content' => $content,
        'post_status' => $status,
        'post_type' => 'page',
    ]);

    if (is_wp_error($page_id)) {
        return new WP_Error('create_failed', 'Failed to create page', ['status' => 500]);
    }
    return ['success' => true, 'id' => $page_id];
}

function obsidian_api_edit_page($request) {
    $id = intval($request['id']);
    $params = $request->get_json_params();
    $args = ['ID' => $id];
    
    if (isset($params['title'])) $args['post_title'] = sanitize_text_field($params['title']);
    if (isset($params['content'])) $args['post_content'] = wp_kses_post($params['content']);
    if (isset($params['slug'])) $args['post_name'] = sanitize_title($params['slug']);
    
    $result = wp_update_post($args, true);
    if (is_wp_error($result)) {
        return new WP_Error('edit_failed', 'Failed to edit page', ['status' => 500]);
    }
    return ['success' => true, 'id' => $id];
}

function obsidian_api_delete_page($request) {
    $id = intval($request['id']);
    $result = wp_delete_post($id, true);
    if (!$result) {
        return new WP_Error('delete_failed', 'Failed to delete page', ['status' => 500]);
    }
    return ['success' => true, 'id' => $id];
}

function obsidian_api_list_pages($request) {
    $pages = get_pages(['post_type' => 'page']);
    $result = array_map(function($page) {
        return [
            'id' => $page->ID,
            'title' => $page->post_title,
            'slug' => $page->post_name,
            'status' => $page->post_status,
            'content' => $page->post_content
        ];
    }, $pages);
    return ['success' => true, 'pages' => $result];
}

// Add settings page for backend configuration
add_action('admin_menu', function() {
    add_submenu_page(
        'obsidian-generator',
        'Settings',
        'Settings',
        'manage_options',
        'obsidian-settings',
        'obsidian_render_settings_page'
    );
});

function obsidian_render_settings_page() {
    if (!current_user_can('manage_options')) {
        return;
    }

    if (isset($_POST['obsidian_settings_nonce']) && wp_verify_nonce($_POST['obsidian_settings_nonce'], 'obsidian_settings')) {
        update_option('obsidian_backend_url', sanitize_text_field($_POST['backend_url']));
        update_option('obsidian_api_token', sanitize_text_field($_POST['api_token']));
        echo '<div class="notice notice-success"><p>Settings saved successfully!</p></div>';
    }

    $backend_url = get_option('obsidian_backend_url', 'https://obsidianbackend.example.com');
    $api_token = get_option('obsidian_api_token', '');
    ?>
    <div class="wrap">
        <h1>Obsidian Settings</h1>
        <form method="post">
            <?php wp_nonce_field('obsidian_settings', 'obsidian_settings_nonce'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="backend_url">Backend Service URL</label></th>
                    <td>
                        <input type="url" name="backend_url" id="backend_url" value="<?php echo esc_attr($backend_url); ?>" class="regular-text">
                        <p class="description">The URL of your Obsidian backend service</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="api_token">API Token</label></th>
                    <td>
                        <input type="password" name="api_token" id="api_token" value="<?php echo esc_attr($api_token); ?>" class="regular-text">
                        <p class="description">The API token for external service authentication</p>
                    </td>
                </tr>
            </table>
            <?php submit_button('Save Settings'); ?>
        </form>
    </div>
    <?php
}
