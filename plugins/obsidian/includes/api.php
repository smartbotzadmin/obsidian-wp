<?php
namespace Obsidian;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * API class for handling REST endpoints
 * Plugin endpoints use /obsidian-plugin/v1 namespace (separate from theme's /obsidian/v1)
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
            'show_in_rest' => true,
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
     * Using obsidian-plugin/v1 namespace to separate from theme endpoints
     */
    public function register_routes() {
        // Core page/post management - high-level operations
        register_rest_route( 'obsidian-plugin/v1', '/pages/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [ $this, 'read_page' ],
            'permission_callback' => [ $this, 'check_read_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        register_rest_route( 'obsidian-plugin/v1', '/pages', [
            'methods' => 'POST',
            'callback' => [ $this, 'create_page' ],
            'permission_callback' => [ $this, 'check_edit_permissions' ],
        ] );

        register_rest_route( 'obsidian-plugin/v1', '/pages/(?P<id>\d+)', [
            'methods' => 'PUT',
            'callback' => [ $this, 'update_page' ],
            'permission_callback' => [ $this, 'check_edit_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        register_rest_route( 'obsidian-plugin/v1', '/pages/(?P<id>\d+)', [
            'methods' => 'DELETE',
            'callback' => [ $this, 'delete_page' ],
            'permission_callback' => [ $this, 'check_edit_permissions' ],
            'args' => [
                'id' => [
                    'validate_callback' => function( $param ) {
                        return is_numeric( $param );
                    }
                ],
            ],
        ] );

        // Dynamic component generation
        register_rest_route( 'obsidian-plugin/v1', '/components', [
            'methods' => 'POST',
            'callback' => [ $this, 'create_component' ],
            'permission_callback' => [ $this, 'check_edit_permissions' ],
        ] );

        // Site management
        register_rest_route( 'obsidian-plugin/v1', '/site', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_site_info' ],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( 'obsidian-plugin/v1', '/site', [
            'methods' => 'PUT',
            'callback' => [ $this, 'update_site_info' ],
            'permission_callback' => [ $this, 'check_site_permissions' ],
        ] );

        // Menu management
        register_rest_route( 'obsidian-plugin/v1', '/menus', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_menus' ],
            'permission_callback' => '__return_true',
        ] );

        register_rest_route( 'obsidian-plugin/v1', '/menus/(?P<id>\d+)', [
            'methods' => 'PUT',
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

        // Theme settings proxy (read-only access to theme endpoints)
        register_rest_route( 'obsidian-plugin/v1', '/theme', [
            'methods' => 'GET',
            'callback' => [ $this, 'get_theme_settings' ],
            'permission_callback' => '__return_true',
        ] );
    }

    /**
     * Permission callbacks
     */
    public function check_read_permissions( $request ) {
        return true; // Pages are publicly readable
    }

    public function check_edit_permissions() {
        return current_user_can( 'edit_posts' );
    }

    public function check_site_permissions() {
        return current_user_can( 'manage_options' );
    }

    public function check_menu_permissions() {
        return current_user_can( 'edit_theme_options' );
    }

    /**
     * Read page with full context
     */
    public function read_page( $request ) {
        $post_id = $request->get_param( 'id' );
        $post = get_post( $post_id );
        
        if ( ! $post || ! in_array( $post->post_type, [ 'page', 'post' ] ) ) {
            return new \WP_Error( 'page_not_found', 'Page not found', [ 'status' => 404 ] );
        }

        // Get full page context
        $data = [
            'id' => $post->ID,
            'title' => $post->post_title,
            'content' => $post->post_content,
            'status' => $post->post_status,
            'type' => $post->post_type,
            'slug' => $post->post_name,
            'permalink' => get_permalink( $post ),
            'preview_url' => add_query_arg( [
                'preview' => 'true',
                'obsidian_preview' => '1'
            ], get_permalink( $post ) ),
            'modified' => get_the_modified_date( 'c', $post ),
            'author' => get_the_author_meta( 'display_name', $post->post_author ),
            'featured_image' => get_the_post_thumbnail_url( $post->ID, 'full' ),
            'excerpt' => $post->post_excerpt,
            'meta' => [
                'seo_title' => get_post_meta( $post->ID, '_yoast_wpseo_title', true ),
                'seo_description' => get_post_meta( $post->ID, '_yoast_wpseo_metadesc', true ),
                'custom_scripts' => get_post_meta( $post->ID, '_obsidian_custom_scripts', true ) ?: [],
            ],
            'blocks' => parse_blocks( $post->post_content ),
        ];

        return rest_ensure_response( $data );
    }

    /**
     * Create new page (always as draft)
     */
    public function create_page( $request ) {
        $title = $request->get_param( 'title' ) ?: 'Untitled Page';
        $content = $request->get_param( 'content' ) ?: '';
        $type = $request->get_param( 'type' ) ?: 'page';

        $post_data = [
            'post_title' => sanitize_text_field( $title ),
            'post_content' => wp_kses_post( $content ),
            'post_status' => 'draft', // Always create as draft
            'post_type' => $type,
            'post_author' => get_current_user_id(),
        ];

        $post_id = wp_insert_post( $post_data );

        if ( is_wp_error( $post_id ) ) {
            return $post_id;
        }

        // Return the created page data
        return $this->read_page( new \WP_REST_Request( 'GET', '/pages/' . $post_id ) );
    }

    /**
     * Update page (always keeps as draft)
     */
    public function update_page( $request ) {
        $post_id = $request->get_param( 'id' );
        $post = get_post( $post_id );
        
        if ( ! $post ) {
            return new \WP_Error( 'page_not_found', 'Page not found', [ 'status' => 404 ] );
        }

        $post_data = [ 'ID' => $post_id ];

        // Update fields if provided
        if ( $request->has_param( 'title' ) ) {
            $post_data['post_title'] = sanitize_text_field( $request->get_param( 'title' ) );
        }

        if ( $request->has_param( 'content' ) ) {
            $post_data['post_content'] = wp_kses_post( $request->get_param( 'content' ) );
        }

        if ( $request->has_param( 'excerpt' ) ) {
            $post_data['post_excerpt'] = sanitize_textarea_field( $request->get_param( 'excerpt' ) );
        }

        // Always keep as draft when AI modifies
        if ( $post->post_status === 'publish' ) {
            // Create a new draft revision instead of modifying published version
            $post_data['post_status'] = 'draft';
            $post_data['post_parent'] = $post_id;
            unset( $post_data['ID'] );
            
            $draft_id = wp_insert_post( $post_data );
            if ( is_wp_error( $draft_id ) ) {
                return $draft_id;
            }
            
            $post_id = $draft_id;
        } else {
            // Update existing draft
            $result = wp_update_post( $post_data );
            if ( is_wp_error( $result ) ) {
                return $result;
            }
        }

        // Handle custom scripts if provided
        if ( $request->has_param( 'custom_scripts' ) ) {
            update_post_meta( $post_id, '_obsidian_custom_scripts', $request->get_param( 'custom_scripts' ) );
        }

        // Return updated page data
        return $this->read_page( new \WP_REST_Request( 'GET', '/pages/' . $post_id ) );
    }

    /**
     * Delete page
     */
    public function delete_page( $request ) {
        $post_id = $request->get_param( 'id' );
        $post = get_post( $post_id );
        
        if ( ! $post ) {
            return new \WP_Error( 'page_not_found', 'Page not found', [ 'status' => 404 ] );
        }

        $deleted = wp_delete_post( $post_id, true );
        
        if ( ! $deleted ) {
            return new \WP_Error( 'delete_failed', 'Failed to delete page', [ 'status' => 500 ] );
        }

        return rest_ensure_response( [
            'success' => true,
            'message' => 'Page deleted successfully',
            'deleted_id' => $post_id,
        ] );
    }

    /**
     * Create dynamic component
     */
    public function create_component( $request ) {
        $component_type = $request->get_param( 'type' );
        $html_content = $request->get_param( 'html' );
        $css_content = $request->get_param( 'css' );
        $js_content = $request->get_param( 'javascript' );
        $page_id = $request->get_param( 'page_id' );

        if ( ! $component_type || ! $html_content ) {
            return new \WP_Error( 'missing_params', 'Component type and HTML content are required', [ 'status' => 400 ] );
        }

        // Generate unique component handle
        $component_handle = 'obsidian-' . sanitize_title( $component_type ) . '-' . uniqid();

        // Save assets if provided
        $script_url = null;
        $css_url = null;

        if ( $js_content ) {
            $script_url = $this->save_component_asset( $component_handle . '.js', $js_content, 'js' );
        }

        if ( $css_content ) {
            $css_url = $this->save_component_asset( $component_handle . '.css', $css_content, 'css' );
        }

        // Create component data
        $component_data = [
            'handle' => $component_handle,
            'type' => $component_type,
            'html' => $html_content,
            'script_url' => $script_url,
            'css_url' => $css_url,
            'created' => current_time( 'mysql' ),
            'version' => uniqid(),
        ];

        // Store component for reuse
        $dynamic_components = get_option( 'obsidian_dynamic_components', [] );
        $dynamic_components[ $component_handle ] = $component_data;
        update_option( 'obsidian_dynamic_components', $dynamic_components );

        // If page_id provided, add component to that page
        if ( $page_id ) {
            $this->add_component_to_page( $page_id, $component_data );
        }

        return rest_ensure_response( [
            'success' => true,
            'component' => $component_data,
            'message' => 'Component created successfully',
        ] );
    }

    /**
     * Get site information
     */
    public function get_site_info( $request ) {
        $site_info = [
            'title' => get_option( 'blogname' ),
            'tagline' => get_option( 'blogdescription' ),
            'url' => home_url(),
            'admin_email' => get_option( 'admin_email' ),
            'language' => get_locale(),
            'timezone' => get_option( 'timezone_string' ),
            'icon' => [
                'url' => get_site_icon_url(),
                'id' => get_option( 'site_icon' ),
            ],
            'theme' => [
                'name' => wp_get_theme()->get( 'Name' ),
                'version' => wp_get_theme()->get( 'Version' ),
            ],
            'pages' => $this->get_site_pages(),
            'menus' => $this->get_site_menus(),
        ];

        return rest_ensure_response( $site_info );
    }

    /**
     * Update site information
     */
    public function update_site_info( $request ) {
        if ( $request->has_param( 'title' ) ) {
            update_option( 'blogname', sanitize_text_field( $request->get_param( 'title' ) ) );
        }

        if ( $request->has_param( 'tagline' ) ) {
            update_option( 'blogdescription', sanitize_text_field( $request->get_param( 'tagline' ) ) );
        }

        if ( $request->has_param( 'icon_id' ) ) {
            update_option( 'site_icon', absint( $request->get_param( 'icon_id' ) ) );
        }

        return $this->get_site_info( $request );
    }

    /**
     * Get menus
     */
    public function get_menus( $request ) {
        $menus = wp_get_nav_menus();
        $formatted_menus = [];

        foreach ( $menus as $menu ) {
            $menu_items = wp_get_nav_menu_items( $menu->term_id );
            $formatted_items = [];

            if ( $menu_items ) {
                foreach ( $menu_items as $item ) {
                    $formatted_items[] = [
                        'id' => $item->ID,
                        'title' => $item->title,
                        'url' => $item->url,
                        'parent' => $item->menu_item_parent,
                        'order' => $item->menu_order,
                    ];
                }
            }

            $formatted_menus[] = [
                'id' => $menu->term_id,
                'name' => $menu->name,
                'slug' => $menu->slug,
                'locations' => $this->get_menu_locations( $menu->term_id ),
                'items' => $formatted_items,
            ];
        }

        return rest_ensure_response( $formatted_menus );
    }

    /**
     * Update menu
     */
    public function update_menu( $request ) {
        $menu_id = $request->get_param( 'id' );
        $items = $request->get_param( 'items' );

        if ( ! $items || ! is_array( $items ) ) {
            return new \WP_Error( 'invalid_items', 'Menu items are required', [ 'status' => 400 ] );
        }

        $menu = wp_get_nav_menu_object( $menu_id );
        if ( ! $menu ) {
            return new \WP_Error( 'menu_not_found', 'Menu not found', [ 'status' => 404 ] );
        }

        // Remove existing items
        $existing_items = wp_get_nav_menu_items( $menu_id );
        if ( $existing_items ) {
            foreach ( $existing_items as $item ) {
                wp_delete_post( $item->ID, true );
            }
        }

        // Add new items
        foreach ( $items as $index => $item ) {
            $menu_item_data = [
                'menu-item-title' => sanitize_text_field( $item['title'] ),
                'menu-item-url' => esc_url_raw( $item['url'] ),
                'menu-item-status' => 'publish',
                'menu-item-parent-id' => isset( $item['parent'] ) ? absint( $item['parent'] ) : 0,
                'menu-item-position' => $index + 1,
            ];

            wp_update_nav_menu_item( $menu_id, 0, $menu_item_data );
        }

        return rest_ensure_response( [
            'success' => true,
            'message' => 'Menu updated successfully',
            'menu_id' => $menu_id,
        ] );
    }

    /**
     * Get theme settings (proxy to theme API)
     */
    public function get_theme_settings( $request ) {
        $response = wp_remote_get( home_url( '/wp-json/obsidian/v1/theme/settings' ) );
        
        if ( is_wp_error( $response ) ) {
            return new \WP_Error( 'theme_api_error', 'Could not fetch theme settings', [ 'status' => 500 ] );
        }

        $body = wp_remote_retrieve_body( $response );
        $data = json_decode( $body, true );

        return rest_ensure_response( $data );
    }

    /**
     * Helper: Save component asset
     */
    private function save_component_asset( $filename, $content, $type ) {
        $dir = OBSIDIAN_ASSETS_PATH . $type . '/dynamic/';
        
        if ( ! file_exists( $dir ) ) {
            wp_mkdir_p( $dir );
        }

        $file_path = $dir . $filename;
        $saved = file_put_contents( $file_path, $content );

        if ( $saved ) {
            return OBSIDIAN_ASSETS_URL . $type . '/dynamic/' . $filename;
        }

        return null;
    }

    /**
     * Helper: Add component to page
     */
    private function add_component_to_page( $page_id, $component_data ) {
        $post = get_post( $page_id );
        if ( ! $post ) {
            return false;
        }

        // Create component block
        $component_id = uniqid( 'obsidian-component-' );
        $block_markup = sprintf(
            '<!-- wp:html {"obsidianComponent":"%s","obsidianHandle":"%s","obsidianId":"%s"} -->%s<div class="obsidian-dynamic-component" data-component="%s" data-handle="%s" id="%s">%s</div>%s<!-- /wp:html -->',
            esc_attr( $component_data['type'] ),
            esc_attr( $component_data['handle'] ),
            esc_attr( $component_id ),
            "\n",
            esc_attr( $component_data['type'] ),
            esc_attr( $component_data['handle'] ),
            esc_attr( $component_id ),
            $component_data['html'],
            "\n"
        );

        // Add to page content
        $new_content = $post->post_content . "\n\n" . $block_markup;
        wp_update_post( [
            'ID' => $page_id,
            'post_content' => $new_content,
        ] );

        // Add to custom scripts
        $custom_scripts = get_post_meta( $page_id, '_obsidian_custom_scripts', true ) ?: [];
        
        if ( $component_data['script_url'] ) {
            $custom_scripts[ $component_data['handle'] ] = [
                'handle' => $component_data['handle'],
                'src' => $component_data['script_url'],
                'deps' => [ 'jquery' ],
                'ver' => $component_data['version'],
                'in_footer' => true,
            ];
        }

        if ( $component_data['css_url'] ) {
            $custom_scripts[ $component_data['handle'] . '-css' ] = [
                'handle' => $component_data['handle'] . '-css',
                'src' => $component_data['css_url'],
                'type' => 'css',
                'ver' => $component_data['version'],
            ];
        }

        update_post_meta( $page_id, '_obsidian_custom_scripts', $custom_scripts );

        return true;
    }

    /**
     * Helper: Get site pages
     */
    private function get_site_pages() {
        $pages = get_pages( [
            'post_status' => [ 'publish', 'draft' ],
            'number' => 50,
        ] );

        $formatted_pages = [];
        foreach ( $pages as $page ) {
            $formatted_pages[] = [
                'id' => $page->ID,
                'title' => $page->post_title,
                'slug' => $page->post_name,
                'status' => $page->post_status,
                'url' => get_permalink( $page ),
                'modified' => get_the_modified_date( 'c', $page ),
            ];
        }

        return $formatted_pages;
    }

    /**
     * Helper: Get site menus
     */
    private function get_site_menus() {
        $menus = wp_get_nav_menus();
        $formatted_menus = [];

        foreach ( $menus as $menu ) {
            $formatted_menus[] = [
                'id' => $menu->term_id,
                'name' => $menu->name,
                'locations' => $this->get_menu_locations( $menu->term_id ),
            ];
        }

        return $formatted_menus;
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
}