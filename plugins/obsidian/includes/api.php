<?php
namespace Obsidian;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * API class for handling REST endpoints
 */
class API {
    /**
     * Constructor
     */
    public function __construct() {
        add_action( 'rest_api_init', [ $this, 'register_routes' ] );
    }

    /**
     * Register REST API routes
     */
    public function register_routes() {
        register_rest_route( 'obsidian/v1', '/posts/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_post' ],
            'permission_callback' => [ $this, 'check_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        register_rest_route( 'obsidian/v1', '/posts/(?P<id>\d+)', [
            'methods' => 'POST',
            'callback' => [ $this, 'update_post' ],
            'permission_callback' => [ $this, 'check_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );
    }

    /**
     * Check permissions
     */
    public function check_permissions( $request ) {
        $post_id = $request->get_param( 'id' );
        return current_user_can( 'edit_post', $post_id );
    }

    /**
     * Get post data
     */
    public function get_post( $request ) {
        $post_id = $request->get_param( 'id' );
        $editor = Plugin::instance()->editor;
        
        $data = $editor->get_editor_data( $post_id );
        
        if ( ! $data ) {
            return new \WP_Error( 'post_not_found', 'Post not found', [ 'status' => 404 ] );
        }

        return rest_ensure_response( $data );
    }

    /**
     * Update post data
     */
    public function update_post( $request ) {
        $post_id = $request->get_param( 'id' );
        $content = $request->get_param( 'content' );
        $title = $request->get_param( 'title' );

        $post_data = [
            'ID' => $post_id,
        ];

        if ( $content !== null ) {
            $post_data['post_content'] = wp_kses_post( $content );
        }

        if ( $title !== null ) {
            $post_data['post_title'] = sanitize_text_field( $title );
        }

        $result = wp_update_post( $post_data );

        if ( is_wp_error( $result ) ) {
            return $result;
        }

        // Get updated data
        $editor = Plugin::instance()->editor;
        $updated_data = $editor->get_editor_data( $post_id );

        return rest_ensure_response( [
            'success' => true,
            'data' => $updated_data,
        ] );
    }
}