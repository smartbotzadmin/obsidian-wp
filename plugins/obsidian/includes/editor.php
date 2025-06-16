<?php
namespace Obsidian;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Editor class
 */
class Editor {
    /**
     * Constructor
     */
    public function __construct() {
        add_action( 'init', [ $this, 'init' ] );
    }

    /**
     * Initialize editor
     */
    public function init() {
        // Check if we're in editor mode
        if ( $this->is_editor_active() ) {
            add_action( 'template_redirect', [ $this, 'redirect_to_editor' ] );
        }
    }

    /**
     * Check if editor is active
     */
    public function is_editor_active() {
        return isset( $_GET['action'] ) && 'obsidian' === $_GET['action'] && isset( $_GET['post'] );
    }

    /**
     * Redirect to editor
     */
    public function redirect_to_editor() {
        $post_id = absint( $_GET['post'] );
        
        if ( ! current_user_can( 'edit_post', $post_id ) ) {
            wp_die( __( 'You do not have permission to edit this post.', 'obsidian' ) );
        }

        // Redirect to our app page
        wp_redirect( admin_url( 'admin.php?page=obsidian-app&post=' . $post_id ) );
        exit;
    }

    /**
     * Get editor data for a post
     */
    public function get_editor_data( $post_id ) {
        $post = get_post( $post_id );
        
        if ( ! $post ) {
            return false;
        }

        return [
            'id' => $post->ID,
            'title' => $post->post_title,
            'content' => $post->post_content,
            'status' => $post->post_status,
            'type' => $post->post_type,
            'permalink' => get_permalink( $post ),
            'preview_url' => add_query_arg( [
                'preview' => 'true',
                'obsidian_preview' => '1'
            ], get_permalink( $post ) ),
        ];
    }
}