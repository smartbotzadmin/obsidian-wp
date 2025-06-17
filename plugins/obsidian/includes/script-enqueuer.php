<?php
namespace Obsidian;

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Script Enqueuer class for handling custom scripts
 */
class Script_Enqueuer {
    /**
     * Constructor
     */
    public function __construct() {
        add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_post_scripts' ] );
        add_action( 'enqueue_block_assets', [ $this, 'enqueue_block_scripts' ] );
    }

    /**
     * Enqueue scripts for current post/page
     */
    public function enqueue_post_scripts() {
        if ( ! is_singular() ) {
            return;
        }

        $post_id = get_the_ID();
        $custom_scripts = get_post_meta( $post_id, '_obsidian_custom_scripts', true );

        if ( ! is_array( $custom_scripts ) || empty( $custom_scripts ) ) {
            return;
        }

        foreach ( $custom_scripts as $script ) {
            $this->enqueue_script( $script );
        }
    }

    /**
     * Enqueue scripts for blocks
     */
    public function enqueue_block_scripts() {
        if ( ! is_singular() ) {
            return;
        }

        $post_id = get_the_ID();
        $post = get_post( $post_id );

        if ( ! $post || ! has_blocks( $post->post_content ) ) {
            return;
        }

        $blocks = parse_blocks( $post->post_content );
        $this->process_blocks_for_scripts( $blocks );
    }

    /**
     * Process blocks recursively to find scripts to enqueue
     */
    private function process_blocks_for_scripts( $blocks ) {
        foreach ( $blocks as $block ) {
            // Check for dynamic Obsidian components
            if ( $block['blockName'] === 'core/html' && isset( $block['attrs']['obsidianComponent'] ) ) {
                $component_handle = $block['attrs']['obsidianHandle'] ?? null;
                if ( $component_handle ) {
                    $this->enqueue_dynamic_component( $component_handle );
                }
            }

            // Check for legacy Obsidian sections (for backward compatibility)
            if ( $block['blockName'] === 'core/html' && isset( $block['attrs']['obsidianSection'] ) ) {
                $section_type = $block['attrs']['obsidianSection'];
                $this->enqueue_legacy_section( $section_type );
            }

            // Process inner blocks recursively
            if ( ! empty( $block['innerBlocks'] ) ) {
                $this->process_blocks_for_scripts( $block['innerBlocks'] );
            }
        }
    }

    /**
     * Enqueue dynamic component
     */
    private function enqueue_dynamic_component( $component_handle ) {
        $dynamic_components = get_option( 'obsidian_dynamic_components', [] );
        
        if ( ! isset( $dynamic_components[ $component_handle ] ) ) {
            return;
        }

        $component = $dynamic_components[ $component_handle ];
        
        $script = [
            'handle' => $component_handle,
            'src' => $component['script_url'],
            'deps' => [ 'jquery' ],
            'ver' => $component['version'],
            'in_footer' => true,
            'component_type' => $component['type'],
        ];

        $this->enqueue_script( $script );

        // Enqueue CSS if exists
        if ( ! empty( $component['css_url'] ) ) {
            wp_enqueue_style(
                $component_handle . '-css',
                $component['css_url'],
                [],
                $component['version']
            );
        }
    }

    /**
     * Enqueue legacy section (for backward compatibility)
     */
    private function enqueue_legacy_section( $section_type ) {
        // This method is kept for backward compatibility
        // New components should use the dynamic system
        error_log( "Obsidian: Legacy section type '{$section_type}' detected. Consider migrating to dynamic components." );
    }

    /**
     * Enqueue individual script
     */
    private function enqueue_script( $script ) {
        if ( ! isset( $script['handle'] ) || ! isset( $script['src'] ) ) {
            return;
        }

        // Check condition if specified
        if ( isset( $script['condition'] ) && ! empty( $script['condition'] ) ) {
            if ( ! $this->evaluate_condition( $script['condition'] ) ) {
                return;
            }
        }

        // Check if script is already enqueued
        if ( wp_script_is( $script['handle'], 'enqueued' ) ) {
            return;
        }

        $deps = isset( $script['deps'] ) ? $script['deps'] : [];
        $ver = isset( $script['ver'] ) ? $script['ver'] : OBSIDIAN_VERSION;
        $in_footer = isset( $script['in_footer'] ) ? $script['in_footer'] : true;

        wp_enqueue_script( $script['handle'], $script['src'], $deps, $ver, $in_footer );

        // Add inline script data if needed
        $this->add_script_data( $script );
    }

    /**
     * Add script data/configuration
     */
    private function add_script_data( $script ) {
        $handle = $script['handle'];
        
        // Add common Obsidian data
        $obsidian_data = [
            'ajax_url' => admin_url( 'admin-ajax.php' ),
            'rest_url' => rest_url( 'obsidian/v1/' ),
            'nonce' => wp_create_nonce( 'wp_rest' ),
            'post_id' => get_the_ID(),
        ];

        // Add script-specific data
        switch ( $handle ) {
            case 'obsidian-carousel':
                $obsidian_data['carousel'] = [
                    'autoplay' => true,
                    'autoplay_speed' => 3000,
                    'dots' => true,
                    'arrows' => true,
                ];
                break;
            
            case 'obsidian-slider':
                $obsidian_data['slider'] = [
                    'fade' => true,
                    'autoplay' => true,
                    'autoplay_speed' => 5000,
                ];
                break;
            
            case 'obsidian-lightbox':
                $obsidian_data['lightbox'] = [
                    'close_on_click' => true,
                    'show_nav' => true,
                ];
                break;
            
            case 'obsidian-forms':
                $obsidian_data['forms'] = [
                    'validation' => true,
                    'ajax_submit' => true,
                ];
                break;
        }

        wp_localize_script( $handle, 'obsidianData', $obsidian_data );
    }

    /**
     * Evaluate script condition
     */
    private function evaluate_condition( $condition ) {
        switch ( $condition ) {
            case 'is_mobile':
                return wp_is_mobile();
            
            case 'is_desktop':
                return ! wp_is_mobile();
            
            case 'is_logged_in':
                return is_user_logged_in();
            
            case 'is_admin':
                return current_user_can( 'manage_options' );
            
            case 'has_woocommerce':
                return class_exists( 'WooCommerce' );
            
            default:
                // Allow custom conditions via filter
                return apply_filters( 'obsidian_evaluate_script_condition', false, $condition );
        }
    }
}