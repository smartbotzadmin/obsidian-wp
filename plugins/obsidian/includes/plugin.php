<?php
namespace Obsidian;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Main plugin class
 */
class Plugin {
    /**
     * Instance
     */
    private static $instance = null;

    /**
     * Editor instance
     */
    public $editor;

    /**
     * App instance
     */
    public $app;

    /**
     * Get instance
     */
    public static function instance() {
        if ( is_null( self::$instance ) ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->init();
    }

    /**
     * Initialize plugin
     */
    private function init() {
        // Load dependencies
        $this->load_dependencies();
        
        // Initialize components
        $this->init_components();
        
        // Register hooks
        $this->register_hooks();
    }

    /**
     * Load dependencies
     */
    private function load_dependencies() {
        require_once OBSIDIAN_PATH . 'includes/editor.php';
        require_once OBSIDIAN_PATH . 'includes/api.php';
        require_once OBSIDIAN_PATH . 'includes/script-enqueuer.php';
        require_once OBSIDIAN_PATH . 'app/app.php';
    }

    /**
     * Initialize components
     */
    private function init_components() {
        $this->editor = new Editor();
        $this->api = new API();
        $this->script_enqueuer = new Script_Enqueuer();
        $this->app = new \Obsidian\App\App();
    }

    /**
     * Register hooks
     */
    private function register_hooks() {
        // Add post type support
        add_action( 'init', [ $this, 'add_post_type_support' ] );
        
        // Add edit button
        add_filter( 'page_row_actions', [ $this, 'add_edit_button' ], 10, 2 );
        add_filter( 'post_row_actions', [ $this, 'add_edit_button' ], 10, 2 );
        
        // Hide admin bar for Obsidian editor - add early
        add_action( 'wp_loaded', [ $this, 'maybe_hide_admin_bar' ] );
        add_filter( 'show_admin_bar', [ $this, 'hide_admin_bar' ] );
    }

    /**
     * Add post type support
     */
    public function add_post_type_support() {
        $post_types = [ 'page', 'post' ];
        foreach ( $post_types as $post_type ) {
            add_post_type_support( $post_type, 'obsidian' );
        }
    }

    /**
     * Add edit button to post/page list
     */
    public function add_edit_button( $actions, $post ) {
        if ( ! current_user_can( 'edit_post', $post->ID ) ) {
            return $actions;
        }

        $url = admin_url( 'admin.php?page=obsidian-app&post=' . $post->ID . '&action=obsidian' );
        
        $actions['edit_with_obsidian'] = sprintf(
            '<a href="%s">%s</a>',
            esc_url( $url ),
            __( 'Edit with Obsidian', 'obsidian' )
        );

        return $actions;
    }

    /**
     * Maybe hide admin bar early
     */
    public function maybe_hide_admin_bar() {
        if ( ( isset( $_GET['page'] ) && $_GET['page'] === 'obsidian-app' ) ||
             ( isset( $_GET['obsidian_preview'] ) && $_GET['obsidian_preview'] === '1' ) ) {
            add_filter( 'show_admin_bar', '__return_false', 999 );
        }
    }

    /**
     * Hide admin bar for Obsidian editor and preview
     */
    public function hide_admin_bar( $show ) {
        // Hide admin bar when in Obsidian editor
        if ( isset( $_GET['page'] ) && $_GET['page'] === 'obsidian-app' ) {
            return false;
        }
        
        // Hide admin bar when in Obsidian preview mode
        if ( isset( $_GET['obsidian_preview'] ) && $_GET['obsidian_preview'] === '1' ) {
            return false;
        }
        
        return $show;
    }
}