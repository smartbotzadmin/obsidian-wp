<?php
/**
 * Plugin Name: Obsidian WP
 * Description: A plugin to empower WordPress to create pages rapidly from pre-made templates/themes and fill them with AI-generated text content.
 * Version: 1.0.0
 * Author: Connor, Phillip, Skyking, Mjesbar
 * Text Domain: owp
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}


/**
 * Adds a custom button to the WordPress admin bar.
 * @param WP_Admin_Bar $admin_bar The WP_Admin_Bar instance.
 * @return void
 */
function owp_add_admin_bar_button( $admin_bar ) {
    $admin_bar->add_node( array(
        'id'    => 'owp-create-with-ai',
        'title' => 'Create with AI ObsidianWP',
        'href'  => admin_url( 'admin.php?page=owp-app' ),
        'meta'  => array(
            'target' => '_self',
            'class'  => 'owp-admin-bar-button',
        ),
    ) );
}
add_action( 'admin_bar_menu', 'owp_add_admin_bar_button', 999 );


/**
 * Adds custom admin pages for Obsidian WP.
 * @return void
 */
function owp_add_admin_pages() {
    // Pages option
    add_pages_page(
        __( 'New AI ObsidianWP', 'owp' ),
        __( 'New AI ObsidianWP', 'owp' ),
        'manage_options',
        'owp-start-redirect', // Use a unique slug for the redirect page
        'owp_render_app_page' // Temporarily set to render, redirect will handle it
    );
    // Middle admin page to redirect to owp-app
    add_submenu_page(
        null,
        __( 'Obsidian WP App', 'owp' ),
        __( 'Obsidian WP App', 'owp' ),
        'manage_options',
        'owp-app',
        'owp_render_app_page'
    );
}
add_action( 'admin_menu', 'owp_add_admin_pages' );


/**
 * Handles redirection to owp-app
 * @return void
 */
function owp_handle_pages_menu_redirect() {
    if ( is_admin() && isset( $_GET['page'] ) && 'owp-start-redirect' === $_GET['page'] ) {
        wp_redirect( admin_url( 'admin.php?page=owp-app' ) );
        exit;
    }
}
add_action( 'admin_init', 'owp_handle_pages_menu_redirect' );


/**
 * Renders owp-app
 * @return void
 */
function owp_render_app_page() {
    wp_enqueue_script(
        'owp-app-script',
        plugins_url( 'app/app.js', __FILE__ ),
        array(),
        null,
        true
    );
    echo '<owp-app></owp-app>';
}


/**
 * Renders the owp design previews, gutenberg sidebar & owp-app
 * with no top adminbar.
 * @return void
 */
add_action( 'init', 'owp_preview_hide_admin_bar' );
function owp_preview_hide_admin_bar() {
    if (
        (
            isset( $_GET['owp-preview'] ) &&
            $_GET['owp-preview'] === 'true'
        ) || (
            isset( $_GET['page'] ) &&
            $_GET['page'] === 'owp-app'
        )
        ) {
        add_filter( 'show_admin_bar', '__return_false' );
        wp_enqueue_style(
            'owp-hide-admin-bars',
            plugins_url( 'assets/css/hide-admin-bars.css', __FILE__ )
        );
    }
}


/**
 * Enqueues the tailwindcss output.css for global styles.
 * Enqueues all JS owp plugin pages.
 * Enqueues all JS owp plugin components.
* @return void
*/
function owp_enqueue_components() {
    // Enqueue global style conditionally
    if (
        ( isset( $_GET['page'] ) && $_GET['page'] === 'owp-app' ) ||
        ( isset( $_GET['action'] ) && $_GET['action'] === 'edit' && basename( $_SERVER['PHP_SELF'] ) === 'post.php' ) ||
        ( isset( $_GET['post_type'] ) && $_GET['post_type'] === 'page' && basename( $_SERVER['PHP_SELF'] ) === 'post-new.php' )
    ) {
        wp_enqueue_style(
            'owp-output-style',
            plugins_url( 'assets/css/output.css', __FILE__ )
        );

        // Enqueue Gutenberg Sidebar scripts
        wp_enqueue_script(
            'owp-gutenberg-sidebar',
            plugins_url( 'gutenberg/sidebar.js', __FILE__ ),
            array(),
            null,
            true
        );
        

        // Enqueue Page scripts
        $page_dir = plugin_dir_path( __FILE__ ) . 'app/pages/';
        $page_files = glob( $page_dir . '*.js' );
        
        foreach ( $page_files as $file ) {
            $handle = 'owp-page-' . sanitize_title( basename( $file, '.js' ) );
            $src = plugins_url( 'app/pages/' . basename( $file ), __FILE__ );
            wp_enqueue_script(
                $handle,
                $src,
                array(),
                null,
                true
            );
        }
        
        // Enqueue Web Components scripts
        $component_dir = plugin_dir_path( __FILE__ ) . 'components/';
        $component_files = glob( $component_dir . '*.js' );

        foreach ( $component_files as $file ) {
            $handle = 'owp-component-' . sanitize_title( basename( $file, '.js' ) );
            $src = plugins_url( 'components/' . basename( $file ), __FILE__ );
            wp_enqueue_script(
                $handle,
                $src,
                array(),
                null,
                true
            );
        }
    }
}
add_action( 'wp_enqueue_scripts', 'owp_enqueue_components' );
add_action( 'admin_enqueue_scripts', 'owp_enqueue_components' );
add_action( 'enqueue_block_editor_assets', 'owp_enqueue_components' );


/**
 * Register plugin API endpoints

* @return void
*/
function register_api_endpoints() {
    // get_designs
    register_rest_route( 'owp/api', '/designs', array(
            'methods'   => 'GET',
            'callback'  => 'get_designs',
            'permission_callback' => '__return_true'
        )
    );

    // create_page
    register_rest_route( 'owp/api', '/page', array(
            'methods'   => 'POST',
            'callback'  => 'create_page',
            'permission_callback' => '__return_true'
        )
    );
}
add_action( 'rest_api_init', 'register_api_endpoints' );

require_once plugin_dir_path( __FILE__ ) . 'api/design.php';
require_once plugin_dir_path( __FILE__ ) . 'api/page.php';