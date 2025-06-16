<?php
/**
 * Plugin Name: Obsidian Page Builder
 * Description: AI-powered page builder with chat interface
 * Version: 1.0.0
 * Author: Obsidian Team
 * Text Domain: obsidian
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

define( 'OBSIDIAN_VERSION', '1.0.0' );
define( 'OBSIDIAN__FILE__', __FILE__ );
define( 'OBSIDIAN_PLUGIN_BASE', plugin_basename( OBSIDIAN__FILE__ ) );
define( 'OBSIDIAN_PATH', plugin_dir_path( OBSIDIAN__FILE__ ) );
define( 'OBSIDIAN_URL', plugins_url( '/', OBSIDIAN__FILE__ ) );
define( 'OBSIDIAN_ASSETS_PATH', OBSIDIAN_PATH . 'assets/' );
define( 'OBSIDIAN_ASSETS_URL', OBSIDIAN_URL . 'assets/' );

// Load the main plugin class
require_once OBSIDIAN_PATH . 'includes/plugin.php';

// Initialize the plugin
function obsidian_init() {
    \Obsidian\Plugin::instance();
}
add_action( 'plugins_loaded', 'obsidian_init' );