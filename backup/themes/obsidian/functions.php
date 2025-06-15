<?php
/**
 * Obsidian functions and definitions
 *
 * @package Obsidian
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function obsidian_minimal_setup() {
    // Make theme available for translation
    load_theme_textdomain('obsidian-minimal', get_template_directory() . '/languages');

    // Add default posts and comments RSS feed links to head
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails on posts and pages
    add_theme_support('post-thumbnails');

    // Add support for HTML5 markup
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ));

    // Add support for core custom logo
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-width'  => true,
        'flex-height' => true,
    ));

    // Add support for block styles
    add_theme_support('wp-block-styles');
    add_theme_support('responsive-embeds');
    add_theme_support('editor-styles');
}
add_action('after_setup_theme', 'obsidian_minimal_setup');

/**
 * Set the content width in pixels
 */
function obsidian_minimal_content_width() {
    $GLOBALS['content_width'] = apply_filters('obsidian_minimal_content_width', 1200);
}
add_action('after_setup_theme', 'obsidian_minimal_content_width', 0);

// === THEME OPTIONS FOR USER-EDITABLE VARIABLES ===

// 1. Add Theme Options Page
add_action('admin_menu', function() {
    add_theme_page(
        __('Obsidian Theme Options', 'obsidian'),
        __('Obsidian Theme Options', 'obsidian'),
        'edit_theme_options',
        'obsidian-theme-options',
        'obsidian_theme_options_page'
    );
});

// 2. Register Settings
add_action('admin_init', function() {
    register_setting('obsidian_theme_options_group', 'obsidian_theme_options');
});

// 3. Options Page Callback
function obsidian_theme_options_page() {
    $options = get_option('obsidian_theme_options', [
        'primary_color' => '#2271b1',
        'font_family' => 'Arial, Helvetica, sans-serif',
    ]);
    ?>
    <div class="wrap">
        <h1><?php _e('Obsidian Theme Options', 'obsidian'); ?></h1>
        <form method="post" action="options.php">
            <?php settings_fields('obsidian_theme_options_group'); ?>
            <table class="form-table">
                <tr valign="top">
                    <th scope="row"><?php _e('Primary Color', 'obsidian'); ?></th>
                    <td><input type="text" name="obsidian_theme_options[primary_color]" value="<?php echo esc_attr($options['primary_color']); ?>" class="regular-text" /></td>
                </tr>
                <tr valign="top">
                    <th scope="row"><?php _e('Font Family', 'obsidian'); ?></th>
                    <td><input type="text" name="obsidian_theme_options[font_family]" value="<?php echo esc_attr($options['font_family']); ?>" class="regular-text" /></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

// 4. Output CSS Variables in <head>
add_action('wp_head', function() {
    $options = get_option('obsidian_theme_options', [
        'primary_color' => '#2271b1',
        'font_family' => 'Arial, Helvetica, sans-serif',
    ]);
    echo '<style>:root {';
    echo '--obsidian-primary-color: ' . esc_attr($options['primary_color']) . ';';
    echo '--obsidian-font-family: ' . esc_attr($options['font_family']) . ';';
    echo '}</style>';
});

// 5. Expose Variables via REST API
add_action('rest_api_init', function() {
    register_rest_route('obsidian/v1', '/theme-variables', [
        'methods' => 'GET',
        'callback' => function() {
            $options = get_option('obsidian_theme_options', [
                'primary_color' => '#2271b1',
                'font_family' => 'Arial, Helvetica, sans-serif',
            ]);
            return rest_ensure_response($options);
        },
        'permission_callback' => '__return_true',
    ]);
}); 