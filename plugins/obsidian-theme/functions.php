<?php
/**
 * Obsidian Minimal functions and definitions (Hello Elementor style)
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