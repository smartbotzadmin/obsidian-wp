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
        add_action( 'init', [ $this, 'register_post_meta' ] );
    }

    /**
     * Register post meta for custom scripts
     */
    public function register_post_meta() {
        register_post_meta( 'page', '_obsidian_custom_scripts', [
            'type' => 'array',
            'description' => 'Custom scripts enqueued for this page',
            'single' => true,
            'show_in_rest' => [
                'schema' => [
                    'type' => 'array',
                    'items' => [
                        'type' => 'object',
                        'properties' => [
                            'handle' => [
                                'type' => 'string',
                            ],
                            'src' => [
                                'type' => 'string',
                            ],
                            'deps' => [
                                'type' => 'array',
                                'items' => [
                                    'type' => 'string',
                                ],
                            ],
                            'ver' => [
                                'type' => 'string',
                            ],
                            'in_footer' => [
                                'type' => 'boolean',
                            ],
                            'condition' => [
                                'type' => 'string',
                            ],
                        ],
                    ],
                ],
            ],
            'auth_callback' => function() {
                return current_user_can( 'edit_posts' );
            }
        ] );

        register_post_meta( 'post', '_obsidian_custom_scripts', [
            'type' => 'array',
            'description' => 'Custom scripts enqueued for this post',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => function() {
                return current_user_can( 'edit_posts' );
            }
        ] );
    }

    /**
     * Register REST API routes
     */
    public function register_routes() {
        // Post management routes
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

        register_rest_route( 'obsidian/v1', '/posts/(?P<id>\d+)/revisions', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_post_revisions' ],
            'permission_callback' => [ $this, 'check_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        register_rest_route( 'obsidian/v1', '/posts/(?P<id>\d+)/revisions/(?P<revision_id>\d+)/restore', [
            'methods' => 'POST',
            'callback' => [ $this, 'restore_revision' ],
            'permission_callback' => [ $this, 'check_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
                'revision_id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        register_rest_route( 'obsidian/v1', '/posts/(?P<id>\d+)/save', [
            'methods' => 'POST',
            'callback' => [ $this, 'save_post' ],
            'permission_callback' => [ $this, 'check_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        register_rest_route( 'obsidian/v1', '/posts/(?P<id>\d+)/publish', [
            'methods' => 'POST',
            'callback' => [ $this, 'publish_post' ],
            'permission_callback' => [ $this, 'check_publish_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        // Draft management routes
        register_rest_route( 'obsidian/v1', '/drafts', [
            'methods' => 'POST',
            'callback' => [ $this, 'create_draft' ],
            'permission_callback' => [ $this, 'check_edit_permissions' ],
        ] );

        register_rest_route( 'obsidian/v1', '/drafts', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_drafts' ],
            'permission_callback' => [ $this, 'check_edit_permissions' ],
        ] );

        // Site identity management routes
        register_rest_route( 'obsidian/v1', '/site/settings', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_site_settings' ],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( 'obsidian/v1', '/site/settings', [
            'methods' => 'POST',
            'callback' => [ $this, 'update_site_settings' ],
            'permission_callback' => [ $this, 'check_site_permissions' ],
        ] );

        // Menu management routes
        register_rest_route( 'obsidian/v1', '/menus', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_menus' ],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( 'obsidian/v1', '/menus/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_menu' ],
            'permission_callback' => '__return_true',
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        register_rest_route( 'obsidian/v1', '/menus/(?P<id>\d+)', [
            'methods' => 'POST',
            'callback' => [ $this, 'update_menu' ],
            'permission_callback' => [ $this, 'check_menu_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        register_rest_route( 'obsidian/v1', '/menus', [
            'methods' => 'POST',
            'callback' => [ $this, 'create_menu' ],
            'permission_callback' => [ $this, 'check_menu_permissions' ],
        ] );

        // Block/Section management routes
        register_rest_route( 'obsidian/v1', '/posts/(?P<id>\d+)/blocks', [
            'methods' => 'POST',
            'callback' => [ $this, 'add_block_to_post' ],
            'permission_callback' => [ $this, 'check_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        register_rest_route( 'obsidian/v1', '/posts/(?P<id>\d+)/enqueue-script', [
            'methods' => 'POST',
            'callback' => [ $this, 'enqueue_custom_script' ],
            'permission_callback' => [ $this, 'check_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        // Dynamic script generation routes
        register_rest_route( 'obsidian/v1', '/generate-script', [
            'methods' => 'POST',
            'callback' => [ $this, 'generate_dynamic_script' ],
            'permission_callback' => [ $this, 'check_edit_permissions' ],
        ] );

        register_rest_route( 'obsidian/v1', '/posts/(?P<id>\d+)/add-dynamic-component', [
            'methods' => 'POST',
            'callback' => [ $this, 'add_dynamic_component' ],
            'permission_callback' => [ $this, 'check_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        // Theme integration routes
        register_rest_route( 'obsidian/v1', '/theme/apply', [
            'methods' => 'POST',
            'callback' => [ $this, 'apply_theme_to_post' ],
            'permission_callback' => [ $this, 'check_permissions' ],
        ] );

        register_rest_route( 'obsidian/v1', '/theme/settings', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_theme_settings_proxy' ],
            'permission_callback' => '__return_true',
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
     * Check publish permissions
     */
    public function check_publish_permissions( $request ) {
        $post_id = $request->get_param( 'id' );
        return current_user_can( 'publish_post', $post_id );
    }

    /**
     * Check edit permissions
     */
    public function check_edit_permissions() {
        return current_user_can( 'edit_posts' );
    }

    /**
     * Check site permissions
     */
    public function check_site_permissions() {
        return current_user_can( 'manage_options' );
    }

    /**
     * Check menu permissions
     */
    public function check_menu_permissions() {
        return current_user_can( 'edit_theme_options' );
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

        // Add custom scripts data
        $custom_scripts = get_post_meta( $post_id, '_obsidian_custom_scripts', true );
        $data['custom_scripts'] = $custom_scripts ? $custom_scripts : [];

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

    /**
     * Get post revisions
     */
    public function get_post_revisions( $request ) {
        $post_id = $request->get_param( 'id' );
        
        $revisions = wp_get_post_revisions( $post_id, [
            'numberposts' => 10,
            'orderby' => 'date',
            'order' => 'DESC'
        ] );

        $formatted_revisions = [];
        foreach ( $revisions as $revision ) {
            $formatted_revisions[] = [
                'id' => $revision->ID,
                'date' => get_the_date( 'M j Y @ H:i', $revision ),
                'date_relative' => human_time_diff( strtotime( $revision->post_date ), current_time( 'timestamp' ) ) . ' ago',
                'author' => get_the_author_meta( 'display_name', $revision->post_author ),
                'title' => $revision->post_title,
                'content' => $revision->post_content,
            ];
        }

        return rest_ensure_response( $formatted_revisions );
    }

    /**
     * Restore a revision
     */
    public function restore_revision( $request ) {
        $post_id = $request->get_param( 'id' );
        $revision_id = $request->get_param( 'revision_id' );

        $revision = wp_get_post_revision( $revision_id );
        
        if ( ! $revision || $revision->post_parent != $post_id ) {
            return new \WP_Error( 'revision_not_found', 'Revision not found', [ 'status' => 404 ] );
        }

        $restored = wp_restore_post_revision( $revision_id );
        
        if ( ! $restored ) {
            return new \WP_Error( 'restore_failed', 'Failed to restore revision', [ 'status' => 500 ] );
        }

        // Get updated data
        $editor = Plugin::instance()->editor;
        $updated_data = $editor->get_editor_data( $post_id );

        return rest_ensure_response( [
            'success' => true,
            'restored_revision_id' => $revision_id,
            'data' => $updated_data,
        ] );
    }

    /**
     * Save post as draft
     */
    public function save_post( $request ) {
        $post_id = $request->get_param( 'id' );
        $post = get_post( $post_id );
        
        if ( ! $post ) {
            return new \WP_Error( 'post_not_found', 'Post not found', [ 'status' => 404 ] );
        }
        
        $body = $request->get_json_params();
        $status = isset( $body['status'] ) ? $body['status'] : 'draft';
        
        // Update post status
        $updated = wp_update_post( [
            'ID' => $post_id,
            'post_status' => $status
        ] );
        
        if ( is_wp_error( $updated ) ) {
            return new \WP_Error( 'save_failed', 'Failed to save post', [ 'status' => 500 ] );
        }
        
        return rest_ensure_response( [
            'success' => true,
            'message' => 'Post saved successfully',
            'post_id' => $post_id,
            'status' => $status
        ] );
    }
    
    /**
     * Publish post
     */
    public function publish_post( $request ) {
        $post_id = $request->get_param( 'id' );
        $post = get_post( $post_id );
        
        if ( ! $post ) {
            return new \WP_Error( 'post_not_found', 'Post not found', [ 'status' => 404 ] );
        }
        
        // Update post status to published
        $updated = wp_update_post( [
            'ID' => $post_id,
            'post_status' => 'publish'
        ] );
        
        if ( is_wp_error( $updated ) ) {
            return new \WP_Error( 'publish_failed', 'Failed to publish post', [ 'status' => 500 ] );
        }
        
        return rest_ensure_response( [
            'success' => true,
            'message' => 'Post published successfully',
            'post_id' => $post_id,
            'status' => 'publish',
            'permalink' => get_permalink( $post_id )
        ] );
    }

    /**
     * Create a new draft
     */
    public function create_draft( $request ) {
        $title = $request->get_param( 'title' );
        $content = $request->get_param( 'content' );
        $type = $request->get_param( 'type' ) ?: 'page';

        $post_data = [
            'post_title' => $title ?: __( 'Untitled Draft', 'obsidian' ),
            'post_content' => $content ?: '',
            'post_status' => 'draft',
            'post_type' => $type,
            'post_author' => get_current_user_id(),
        ];

        $post_id = wp_insert_post( $post_data );

        if ( is_wp_error( $post_id ) ) {
            return $post_id;
        }

        // Get the created post data
        $editor = Plugin::instance()->editor;
        $post_data = $editor->get_editor_data( $post_id );

        return rest_ensure_response( [
            'success' => true,
            'post_id' => $post_id,
            'data' => $post_data,
        ] );
    }

    /**
     * Get all drafts
     */
    public function get_drafts( $request ) {
        $args = [
            'post_type' => [ 'page', 'post' ],
            'post_status' => 'draft',
            'author' => get_current_user_id(),
            'posts_per_page' => 20,
            'orderby' => 'modified',
            'order' => 'DESC',
        ];

        $query = new \WP_Query( $args );
        $drafts = [];

        foreach ( $query->posts as $post ) {
            $drafts[] = [
                'id' => $post->ID,
                'title' => $post->post_title,
                'type' => $post->post_type,
                'modified' => get_the_modified_date( 'c', $post ),
                'edit_url' => admin_url( 'admin.php?page=obsidian-app&post=' . $post->ID ),
            ];
        }

        return rest_ensure_response( $drafts );
    }

    /**
     * Get site settings
     */
    public function get_site_settings( $request ) {
        $settings = [
            'title' => get_option( 'blogname' ),
            'tagline' => get_option( 'blogdescription' ),
            'icon_url' => get_site_icon_url(),
            'icon_id' => get_option( 'site_icon' ),
        ];

        return rest_ensure_response( $settings );
    }

    /**
     * Update site settings
     */
    public function update_site_settings( $request ) {
        $title = $request->get_param( 'title' );
        $tagline = $request->get_param( 'tagline' );
        $icon_id = $request->get_param( 'icon_id' );

        if ( $title !== null ) {
            update_option( 'blogname', sanitize_text_field( $title ) );
        }

        if ( $tagline !== null ) {
            update_option( 'blogdescription', sanitize_text_field( $tagline ) );
        }

        if ( $icon_id !== null ) {
            update_option( 'site_icon', absint( $icon_id ) );
        }

        return rest_ensure_response( [
            'success' => true,
            'settings' => [
                'title' => get_option( 'blogname' ),
                'tagline' => get_option( 'blogdescription' ),
                'icon_url' => get_site_icon_url(),
                'icon_id' => get_option( 'site_icon' ),
            ],
        ] );
    }

    /**
     * Get all menus
     */
    public function get_menus( $request ) {
        $menus = wp_get_nav_menus();
        $formatted_menus = [];

        foreach ( $menus as $menu ) {
            $formatted_menus[] = [
                'id' => $menu->term_id,
                'name' => $menu->name,
                'slug' => $menu->slug,
                'locations' => $this->get_menu_locations( $menu->term_id ),
            ];
        }

        return rest_ensure_response( $formatted_menus );
    }

    /**
     * Get specific menu
     */
    public function get_menu( $request ) {
        $menu_id = $request->get_param( 'id' );
        $menu = wp_get_nav_menu_object( $menu_id );

        if ( ! $menu ) {
            return new \WP_Error( 'menu_not_found', 'Menu not found', [ 'status' => 404 ] );
        }

        $menu_items = wp_get_nav_menu_items( $menu_id );
        $formatted_items = [];

        foreach ( $menu_items as $item ) {
            $formatted_items[] = [
                'id' => $item->ID,
                'title' => $item->title,
                'url' => $item->url,
                'parent' => $item->menu_item_parent,
                'order' => $item->menu_order,
                'type' => $item->type,
                'object' => $item->object,
                'object_id' => $item->object_id,
            ];
        }

        return rest_ensure_response( [
            'id' => $menu->term_id,
            'name' => $menu->name,
            'slug' => $menu->slug,
            'locations' => $this->get_menu_locations( $menu->term_id ),
            'items' => $formatted_items,
        ] );
    }

    /**
     * Update menu
     */
    public function update_menu( $request ) {
        $menu_id = $request->get_param( 'id' );
        $name = $request->get_param( 'name' );
        $items = $request->get_param( 'items' );

        $menu = wp_get_nav_menu_object( $menu_id );
        if ( ! $menu ) {
            return new \WP_Error( 'menu_not_found', 'Menu not found', [ 'status' => 404 ] );
        }

        // Update menu name if provided
        if ( $name ) {
            wp_update_nav_menu_object( $menu_id, [
                'menu-name' => sanitize_text_field( $name ),
            ] );
        }

        // Update menu items if provided
        if ( is_array( $items ) ) {
            // Remove existing items
            $existing_items = wp_get_nav_menu_items( $menu_id );
            foreach ( $existing_items as $item ) {
                wp_delete_post( $item->ID, true );
            }

            // Add new items
            foreach ( $items as $index => $item ) {
                $menu_item_data = [
                    'menu-item-title' => $item['title'],
                    'menu-item-url' => $item['url'],
                    'menu-item-status' => 'publish',
                    'menu-item-parent-id' => isset( $item['parent'] ) ? $item['parent'] : 0,
                    'menu-item-position' => $index + 1,
                ];

                wp_update_nav_menu_item( $menu_id, 0, $menu_item_data );
            }
        }

        return $this->get_menu( $request );
    }

    /**
     * Create menu
     */
    public function create_menu( $request ) {
        $name = $request->get_param( 'name' );
        $locations = $request->get_param( 'locations' );

        if ( ! $name ) {
            return new \WP_Error( 'missing_name', 'Menu name is required', [ 'status' => 400 ] );
        }

        $menu_id = wp_create_nav_menu( $name );

        if ( is_wp_error( $menu_id ) ) {
            return $menu_id;
        }

        // Assign to locations if provided
        if ( is_array( $locations ) ) {
            $nav_menu_locations = get_theme_mod( 'nav_menu_locations' );
            foreach ( $locations as $location ) {
                $nav_menu_locations[ $location ] = $menu_id;
            }
            set_theme_mod( 'nav_menu_locations', $nav_menu_locations );
        }

        return rest_ensure_response( [
            'success' => true,
            'menu_id' => $menu_id,
            'name' => $name,
        ] );
    }

    /**
     * Add block to post
     */
    public function add_block_to_post( $request ) {
        $post_id = $request->get_param( 'id' );
        $block_type = $request->get_param( 'block_type' );
        $block_content = $request->get_param( 'content' );
        $position = $request->get_param( 'position' ); // 'start', 'end', or specific index

        $post = get_post( $post_id );
        if ( ! $post ) {
            return new \WP_Error( 'post_not_found', 'Post not found', [ 'status' => 404 ] );
        }

        // Create block markup
        $block_markup = $this->create_block_markup( $block_type, $block_content );

        // Insert block at specified position
        $current_content = $post->post_content;
        
        if ( $position === 'start' ) {
            $new_content = $block_markup . "\n\n" . $current_content;
        } elseif ( $position === 'end' || ! $position ) {
            $new_content = $current_content . "\n\n" . $block_markup;
        } else {
            // Insert at specific block index
            $blocks = parse_blocks( $current_content );
            array_splice( $blocks, intval( $position ), 0, [ parse_blocks( $block_markup )[0] ] );
            $new_content = serialize_blocks( $blocks );
        }

        // Update post
        $updated = wp_update_post( [
            'ID' => $post_id,
            'post_content' => $new_content,
        ] );

        if ( is_wp_error( $updated ) ) {
            return $updated;
        }

        return rest_ensure_response( [
            'success' => true,
            'message' => 'Block added successfully',
            'post_id' => $post_id,
        ] );
    }

    /**
     * Enqueue custom script for post
     */
    public function enqueue_custom_script( $request ) {
        $post_id = $request->get_param( 'id' );
        $script_handle = $request->get_param( 'handle' );
        $script_src = $request->get_param( 'src' );
        $deps = $request->get_param( 'deps' ) ?: [];
        $ver = $request->get_param( 'ver' ) ?: '1.0.0';
        $in_footer = $request->get_param( 'in_footer' ) !== false;
        $condition = $request->get_param( 'condition' ); // Optional: condition for enqueuing

        // Get existing scripts
        $custom_scripts = get_post_meta( $post_id, '_obsidian_custom_scripts', true );
        if ( ! is_array( $custom_scripts ) ) {
            $custom_scripts = [];
        }

        // Add new script
        $custom_scripts[ $script_handle ] = [
            'handle' => $script_handle,
            'src' => $script_src,
            'deps' => $deps,
            'ver' => $ver,
            'in_footer' => $in_footer,
            'condition' => $condition,
        ];

        // Save scripts
        update_post_meta( $post_id, '_obsidian_custom_scripts', $custom_scripts );

        return rest_ensure_response( [
            'success' => true,
            'message' => 'Script enqueued successfully',
            'script' => $custom_scripts[ $script_handle ],
        ] );
    }

    /**
     * Apply theme settings to post
     */
    public function apply_theme_to_post( $request ) {
        $post_id = $request->get_param( 'post_id' );
        $theme_settings = $request->get_param( 'theme_settings' );

        if ( ! $post_id ) {
            return new \WP_Error( 'missing_post_id', 'Post ID is required', [ 'status' => 400 ] );
        }

        // This would typically integrate with the theme's settings
        // For now, we'll store it as post meta
        update_post_meta( $post_id, '_obsidian_theme_overrides', $theme_settings );

        return rest_ensure_response( [
            'success' => true,
            'message' => 'Theme settings applied',
            'post_id' => $post_id,
        ] );
    }

    /**
     * Get theme settings (proxy to theme endpoint)
     */
    public function get_theme_settings_proxy( $request ) {
        // Make internal request to theme endpoint
        $response = wp_remote_get( home_url( '/wp-json/obsidian/v1/theme/settings' ) );
        
        if ( is_wp_error( $response ) ) {
            return $response;
        }

        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body, true );

        return rest_ensure_response( $data );
    }

    /**
     * Helper: Get menu locations
     */
    private function get_menu_locations( $menu_id ) {
        $locations = get_nav_menu_locations();
        $menu_locations = [];

        foreach ( $locations as $location => $assigned_menu_id ) {
            if ( $assigned_menu_id == $menu_id ) {
                $menu_locations[] = $location;
            }
        }

        return $menu_locations;
    }

    /**
     * Helper: Create block markup
     */
    private function create_block_markup( $block_type, $content ) {
        // Handle different block types
        switch ( $block_type ) {
            case 'html':
                return sprintf(
                    '<!-- wp:html -->%s<!-- /wp:html -->',
                    $content
                );
            
            case 'paragraph':
                return sprintf(
                    '<!-- wp:paragraph -->%s<p>%s</p>%s<!-- /wp:paragraph -->',
                    "\n",
                    esc_html( $content ),
                    "\n"
                );
            
            case 'heading':
                $level = isset( $content['level'] ) ? $content['level'] : 2;
                $text = isset( $content['text'] ) ? $content['text'] : '';
                return sprintf(
                    '<!-- wp:heading {"level":%d} -->%s<h%d>%s</h%d>%s<!-- /wp:heading -->',
                    $level,
                    "\n",
                    $level,
                    esc_html( $text ),
                    $level,
                    "\n"
                );
            
            case 'obsidian/section':
                // Custom Obsidian section block
                $section_type = isset( $content['type'] ) ? $content['type'] : 'generic';
                $section_content = isset( $content['content'] ) ? $content['content'] : '';
                $section_id = isset( $content['id'] ) ? $content['id'] : uniqid( 'obsidian-section-' );
                
                return sprintf(
                    '<!-- wp:html {"obsidianSection":"%s","obsidianId":"%s"} -->%s%s%s<!-- /wp:html -->',
                    esc_attr( $section_type ),
                    esc_attr( $section_id ),
                    "\n",
                    $section_content,
                    "\n"
                );
            
            case 'group':
                $inner_blocks = isset( $content['innerBlocks'] ) ? $content['innerBlocks'] : '';
                $layout = isset( $content['layout'] ) ? json_encode( $content['layout'] ) : '{"type":"default"}';
                
                return sprintf(
                    '<!-- wp:group {"layout":%s} -->%s<div class="wp-block-group">%s</div>%s<!-- /wp:group -->',
                    $layout,
                    "\n",
                    $inner_blocks,
                    "\n"
                );
            
            default:
                // Generic block
                $attrs = isset( $content['attrs'] ) ? json_encode( $content['attrs'] ) : '{}';
                $inner = isset( $content['inner'] ) ? $content['inner'] : '';
                
                return sprintf(
                    '<!-- wp:%s %s -->%s%s%s<!-- /wp:%s -->',
                    $block_type,
                    $attrs,
                    "\n",
                    $inner,
                    "\n",
                    $block_type
                );
        }
    
        /**
         * Generate dynamic script based on AI agent request
         */
        public function generate_dynamic_script( $request ) {
            $component_type = $request->get_param( 'component_type' );
            $requirements = $request->get_param( 'requirements' );
            $script_content = $request->get_param( 'script_content' );
            $css_content = $request->get_param( 'css_content' );
    
            if ( ! $component_type || ! $script_content ) {
                return new \WP_Error( 'missing_params', 'Component type and script content are required', [ 'status' => 400 ] );
            }
    
            // Generate unique filename
            $script_handle = 'obsidian-' . sanitize_title( $component_type ) . '-' . uniqid();
            $script_filename = $script_handle . '.js';
            $css_filename = $script_handle . '.css';
    
            // Create dynamic scripts directory if it doesn't exist
            $dynamic_dir = OBSIDIAN_ASSETS_PATH . 'js/dynamic/';
            if ( ! file_exists( $dynamic_dir ) ) {
                wp_mkdir_p( $dynamic_dir );
            }
    
            $css_dir = OBSIDIAN_ASSETS_PATH . 'css/dynamic/';
            if ( ! file_exists( $css_dir ) ) {
                wp_mkdir_p( $css_dir );
            }
    
            // Save the generated script
            $script_path = $dynamic_dir . $script_filename;
            $script_saved = file_put_contents( $script_path, $script_content );
    
            if ( ! $script_saved ) {
                return new \WP_Error( 'script_save_failed', 'Failed to save generated script', [ 'status' => 500 ] );
            }
    
            // Save CSS if provided
            $css_saved = true;
            if ( $css_content ) {
                $css_path = $css_dir . $css_filename;
                $css_saved = file_put_contents( $css_path, $css_content );
            }
    
            // Store component metadata
            $component_data = [
                'handle' => $script_handle,
                'type' => $component_type,
                'requirements' => $requirements,
                'script_url' => OBSIDIAN_ASSETS_URL . 'js/dynamic/' . $script_filename,
                'css_url' => $css_content ? OBSIDIAN_ASSETS_URL . 'css/dynamic/' . $css_filename : null,
                'created' => current_time( 'mysql' ),
                'version' => uniqid(),
            ];
    
            // Store in options for reuse
            $dynamic_components = get_option( 'obsidian_dynamic_components', [] );
            $dynamic_components[ $script_handle ] = $component_data;
            update_option( 'obsidian_dynamic_components', $dynamic_components );
    
            return rest_ensure_response( [
                'success' => true,
                'component' => $component_data,
                'message' => 'Dynamic component generated successfully',
            ] );
        }
    
        /**
         * Add dynamic component to post
         */
        public function add_dynamic_component( $request ) {
            $post_id = $request->get_param( 'id' );
            $component_handle = $request->get_param( 'component_handle' );
            $html_content = $request->get_param( 'html_content' );
            $position = $request->get_param( 'position' );
            $component_config = $request->get_param( 'config' );
    
            $post = get_post( $post_id );
            if ( ! $post ) {
                return new \WP_Error( 'post_not_found', 'Post not found', [ 'status' => 404 ] );
            }
    
            // Get component data
            $dynamic_components = get_option( 'obsidian_dynamic_components', [] );
            if ( ! isset( $dynamic_components[ $component_handle ] ) ) {
                return new \WP_Error( 'component_not_found', 'Dynamic component not found', [ 'status' => 404 ] );
            }
    
            $component = $dynamic_components[ $component_handle ];
    
            // Create block with component
            $block_content = [
                'content' => $html_content,
                'type' => $component['type'],
                'id' => uniqid( 'obsidian-component-' ),
                'handle' => $component_handle,
                'config' => $component_config,
            ];
    
            $block_markup = $this->create_dynamic_component_markup( $block_content );
    
            // Insert block into post
            $current_content = $post->post_content;
            
            if ( $position === 'start' ) {
                $new_content = $block_markup . "\n\n" . $current_content;
            } elseif ( $position === 'end' || ! $position ) {
                $new_content = $current_content . "\n\n" . $block_markup;
            } else {
                $blocks = parse_blocks( $current_content );
                array_splice( $blocks, intval( $position ), 0, [ parse_blocks( $block_markup )[0] ] );
                $new_content = serialize_blocks( $blocks );
            }
    
            // Update post
            $updated = wp_update_post( [
                'ID' => $post_id,
                'post_content' => $new_content,
            ] );
    
            if ( is_wp_error( $updated ) ) {
                return $updated;
            }
    
            // Add component to post's custom scripts
            $custom_scripts = get_post_meta( $post_id, '_obsidian_custom_scripts', true );
            if ( ! is_array( $custom_scripts ) ) {
                $custom_scripts = [];
            }
    
            $custom_scripts[ $component_handle ] = [
                'handle' => $component_handle,
                'src' => $component['script_url'],
                'deps' => [ 'jquery' ],
                'ver' => $component['version'],
                'in_footer' => true,
                'component_type' => $component['type'],
                'config' => $component_config,
            ];
    
            // Add CSS if exists
            if ( $component['css_url'] ) {
                $custom_scripts[ $component_handle . '-css' ] = [
                    'handle' => $component_handle . '-css',
                    'src' => $component['css_url'],
                    'type' => 'css',
                    'ver' => $component['version'],
                ];
            }
    
            update_post_meta( $post_id, '_obsidian_custom_scripts', $custom_scripts );
    
            return rest_ensure_response( [
                'success' => true,
                'message' => 'Dynamic component added successfully',
                'post_id' => $post_id,
                'component' => $component,
            ] );
        }
    
        /**
         * Create markup for dynamic component
         */
        private function create_dynamic_component_markup( $content ) {
            $component_id = $content['id'];
            $component_type = $content['type'];
            $component_handle = $content['handle'];
            $html_content = $content['content'];
            $config = isset( $content['config'] ) ? json_encode( $content['config'] ) : '{}';
    
            return sprintf(
                '<!-- wp:html {"obsidianComponent":"%s","obsidianHandle":"%s","obsidianId":"%s","obsidianConfig":%s} -->%s<div class="obsidian-dynamic-component" data-component="%s" data-handle="%s" data-config=\'%s\' id="%s">%s</div>%s<!-- /wp:html -->',
                esc_attr( $component_type ),
                esc_attr( $component_handle ),
                esc_attr( $component_id ),
                $config,
                "\n",
                esc_attr( $component_type ),
                esc_attr( $component_handle ),
                esc_attr( $config ),
                esc_attr( $component_id ),
                $html_content,
                "\n"
            );
        }
    }
}