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

// Main plugin class or functions will go here

/**
 * Enqueues TailwindCSS output.css for admin pages and Gutenberg editor.
 *
 * @return void
 */
function owp_enqueue_tailwind_styles() {
    wp_enqueue_style(
        'owp-tailwind-output',
        plugins_url( 'assets/css/output.css', __FILE__ ),
        array(),
        null
    );
}
add_action( 'admin_enqueue_scripts', 'owp_enqueue_tailwind_styles' );
add_action( 'enqueue_block_editor_assets', 'owp_enqueue_tailwind_styles' );


/**
 * Adds custom admin pages for Obsidian WP.
 *
 * @return void
 */
function owp_add_admin_pages() {
    add_submenu_page(
        null,
        __( 'Description', 'owp' ),
        __( 'Description', 'owp' ),
        'manage_options',
        'owp-description',
        'owp_render_description_page'
    );

    add_submenu_page(
        null,
        __( 'Pictures', 'owp' ),
        __( 'Pictures', 'owp' ),
        'manage_options',
        'owp-pictures',
        'owp_render_pictures_page'
    );

    add_submenu_page(
        null,
        __( 'Contact', 'owp' ),
        __( 'Contact', 'owp' ),
        'manage_options',
        'owp-contact',
        'owp_render_contact_page'
    );

    add_submenu_page(
        null,
        __( 'Design', 'owp' ),
        __( 'Design', 'owp' ),
        'manage_options',
        'owp-design',
        'owp_render_design_page'
    );

    add_pages_page(
        __( 'New AI ObsidianWP', 'owp' ),
        __( 'New AI ObsidianWP', 'owp' ),
        'manage_options',
        'owp-description-redirect', // Use a unique slug for the redirect page
        'owp_render_description_page' // Temporarily set to render, redirect will handle it
    );
}
add_action( 'admin_menu', 'owp_add_admin_pages' );


/**
 * Handles redirection for the "New AI ObsidianWP" page menu item.
 *
 * @return void
 */
function owp_handle_pages_menu_redirect() {
    if ( is_admin() && isset( $_GET['page'] ) && 'owp-description-redirect' === $_GET['page'] ) {
        wp_redirect( admin_url( 'admin.php?page=owp-description' ) );
        exit;
    }
}
add_action( 'admin_init', 'owp_handle_pages_menu_redirect' );


/**
 * Renders the description page content.
 *
 * @return void
 */
function owp_render_description_page() {
    owp_render_page_content( 'description' );
}


/**
 * Renders the pictures page content.
 *
 * @return void
 */
function owp_render_pictures_page() {
    owp_render_page_content( 'pictures' );
}


/**
 * Renders the contact page content.
 *
 * @return void
 */
function owp_render_contact_page() {
    owp_render_page_content( 'contact' );
}


/**
 * Renders the design page content.
 *
 * @return void
 */
function owp_render_design_page() {
    owp_render_page_content( 'design' );
}


/**
 * Renders the content for a given OWP admin page.
 *
 * @param string $page_slug The slug of the page to render (e.g., 'description', 'pictures').
 * @return void
 */
function owp_render_page_content( $page_slug ) {
    $plugin_path = plugin_dir_path( __FILE__ );
    $html_file = $plugin_path . 'pages/' . $page_slug . '/' . $page_slug . '.html';
    $js_file = plugins_url( 'pages/' . $page_slug . '/' . $page_slug . '.js', __FILE__ );

    // Define the slugs for pages where admin bars should be hidden
    $hide_admin_bar_pages = array( 'description', 'pictures', 'contact', 'design' );

    // Conditionally hide admin bar and sidebar for specific pages
    if ( in_array( $page_slug, $hide_admin_bar_pages ) ) {
        add_filter( 'show_admin_bar', '__return_false' );
        wp_enqueue_style( 'owp-hide-admin-bars', plugins_url( 'assets/css/hide-admin-bars.css', __FILE__ ) );
    }

    // Enqueue page-specific JavaScript
    wp_enqueue_script( 'owp-' . $page_slug . '-script', $js_file, array(), null, true );


    if ( file_exists( $html_file ) ) {
        include $html_file;
    } else {
        echo '<p>Content for ' . esc_html( $page_slug ) . ' page not found.</p>';
    }
}


/**
 * Enqueues scripts for the Gutenberg editor.
 *
 * @return void
 */
function owp_enqueue_gutenberg_assets() {
    wp_enqueue_script(
        'owp-gutenberg-sidebar',
        plugins_url( 'gutenberg/sidebar.js', __FILE__ ),
        array( 'wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data' ),
        null,
        true
    );

}
add_action( 'enqueue_block_editor_assets', 'owp_enqueue_gutenberg_assets' );


/**
 * Enqueues all custom components as modules.
 *
 * @return void
 */
function owp_enqueue_components() {
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
            array( 'in_footer' => true, 'type' => 'module' )
        );
    }
}
add_action( 'wp_enqueue_scripts', 'owp_enqueue_components' );
add_action( 'admin_enqueue_scripts', 'owp_enqueue_components' );
add_action( 'enqueue_block_editor_assets', 'owp_enqueue_components' );


/**
 * Adds a custom button to the WordPress admin bar.
 *
 * @param WP_Admin_Bar $admin_bar The WP_Admin_Bar instance.
 * @return void
 */
function owp_add_admin_bar_button( $admin_bar ) {
    $admin_bar->add_node( array(
        'id'    => 'owp-create-with-ai',
        'title' => 'Create with AI ObsidianWP',
        'href'  => admin_url( 'admin.php?page=owp-description' ),
        'meta'  => array(
            'target' => '_self',
            'class'  => 'owp-admin-bar-button',
        ),
    ) );
}
add_action( 'admin_bar_menu', 'owp_add_admin_bar_button', 999 );