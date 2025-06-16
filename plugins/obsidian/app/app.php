<?php
namespace Obsidian\App;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * App class - handles the React application
 */
class App {
    const PAGE_ID = 'obsidian-app';

    /**
     * Constructor
     */
    public function __construct() {
        add_action( 'admin_menu', [ $this, 'register_admin_menu' ] );
        
        if ( $this->is_current() ) {
            add_action( 'admin_init', [ $this, 'admin_init' ] );
        }
    }

    /**
     * Register admin menu
     */
    public function register_admin_menu() {
        add_submenu_page(
            null, // Hidden page
            __( 'Obsidian Editor', 'obsidian' ),
            __( 'Obsidian Editor', 'obsidian' ),
            'edit_posts',
            self::PAGE_ID,
            [ $this, 'render' ]
        );
    }

    /**
     * Check if current page is our app
     */
    public function is_current() {
        return isset( $_GET['page'] ) && self::PAGE_ID === $_GET['page'];
    }

    /**
     * Admin init
     */
    public function admin_init() {
        // Enqueue assets
        $this->enqueue_assets();
        
        // Remove admin notices
        remove_all_actions( 'admin_notices' );
        remove_all_actions( 'all_admin_notices' );
        
        // Render the app
        $this->render();
        exit;
    }

    /**
     * Enqueue assets
     */
    private function enqueue_assets() {
        // Enqueue React and ReactDOM
        wp_enqueue_script( 'react' );
        wp_enqueue_script( 'react-dom' );
        
        // Enqueue our app CSS
        wp_enqueue_style(
            'obsidian-app',
            OBSIDIAN_ASSETS_URL . 'css/app.css',
            [],
            OBSIDIAN_VERSION
        );
        
        // Enqueue our app JS
        wp_enqueue_script(
            'obsidian-app',
            OBSIDIAN_ASSETS_URL . 'js/app.js',
            [ 'react', 'react-dom', 'wp-api-fetch', 'wp-i18n' ],
            OBSIDIAN_VERSION,
            true
        );
        
        // Localize script with data
        wp_localize_script( 'obsidian-app', 'obsidianData', $this->get_app_data() );
    }

    /**
     * Get app data
     */
    private function get_app_data() {
        $post_id = isset( $_GET['post'] ) ? absint( $_GET['post'] ) : 0;
        $editor = \Obsidian\Plugin::instance()->editor;
        
        return [
            'apiUrl' => rest_url( 'obsidian/v1/' ),
            'nonce' => wp_create_nonce( 'wp_rest' ),
            'postId' => $post_id,
            'editorData' => $post_id ? $editor->get_editor_data( $post_id ) : null,
            'homeUrl' => home_url(),
            'adminUrl' => admin_url(),
            'assetsUrl' => OBSIDIAN_ASSETS_URL,
        ];
    }

    /**
     * Render the app
     */
    public function render() {
        require OBSIDIAN_PATH . 'app/view.php';
    }
}