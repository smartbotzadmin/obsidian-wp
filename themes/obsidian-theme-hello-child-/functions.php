<?php
/**
 * Obsidian Theme functions and definitions
 *
 * @package ObsidianTheme
 */

/**
 * Load child theme css and optional scripts
 *
 * @return void
 */
function obsidian_theme_enqueue_scripts() {
	wp_enqueue_style(
		'hello-elementor-child-style',
		get_stylesheet_directory_uri() . '/style.css',
		[
			'hello-elementor-theme-style',
		],
		'1.0.0'
	);
	
	// Dynamically load only the Google Fonts that are actually used
	obsidian_enqueue_google_fonts();
}
add_action( 'wp_enqueue_scripts', 'obsidian_theme_enqueue_scripts', 20 );

/**
 * Dynamically enqueue only the Google Fonts that are actually being used
 */
function obsidian_enqueue_google_fonts() {
	$theme_settings = obsidian_get_theme_settings();
	
	if ( is_wp_error( $theme_settings ) ) {
		return;
	}
	
	// Get the fonts currently in use
	$body_font = get_theme_mod( 'obsidian_body_font_family', 'inter' );
	$heading_font = get_theme_mod( 'obsidian_heading_font_family', 'inter' );
	
	// Don't load Google Fonts if using system font
	if ( $body_font === 'system-font' && $heading_font === 'system-font' ) {
		return;
	}
	
	// Map of font slugs to Google Fonts URLs
	$google_fonts_map = array(
		'inter' => 'Inter:wght@100..900',
		'roboto' => 'Roboto:wght@100,300,400,500,700,900',
		'open-sans' => 'Open+Sans:wght@300,400,500,600,700,800',
		'lato' => 'Lato:wght@100,300,400,700,900',
		'montserrat' => 'Montserrat:wght@100..900',
		'playfair-display' => 'Playfair+Display:wght@400..900',
		'merriweather' => 'Merriweather:wght@300,400,700,900',
		'lora' => 'Lora:wght@400..700',
		'roboto-mono' => 'Roboto+Mono:wght@100..700',
		'source-code-pro' => 'Source+Code+Pro:wght@200..900',
	);
	
	// Build the fonts to load
	$fonts_to_load = array();
	
	if ( $body_font !== 'system-font' && isset( $google_fonts_map[ $body_font ] ) ) {
		$fonts_to_load[] = $google_fonts_map[ $body_font ];
	}
	
	if ( $heading_font !== 'system-font' && $heading_font !== $body_font && isset( $google_fonts_map[ $heading_font ] ) ) {
		$fonts_to_load[] = $google_fonts_map[ $heading_font ];
	}
	
	// Only enqueue if we have fonts to load
	if ( ! empty( $fonts_to_load ) ) {
		$google_fonts_url = 'https://fonts.googleapis.com/css2?family=' . implode( '&family=', $fonts_to_load ) . '&display=swap';
		wp_enqueue_style( 'obsidian-google-fonts', $google_fonts_url, array(), null );
	}
}

/**
 * Theme setup
 */
function obsidian_theme_setup() {
	// Add support for editor styles
	add_theme_support( 'editor-styles' );
	
	// Add support for block styles
	add_theme_support( 'wp-block-styles' );
	
	// Add support for responsive embeds
	add_theme_support( 'responsive-embeds' );
	
	// Add support for custom units
	add_theme_support( 'custom-units', 'px', 'em', 'rem', 'vh', 'vw', '%' );
	
	// Add support for custom spacing
	add_theme_support( 'custom-spacing' );
}
add_action( 'after_setup_theme', 'obsidian_theme_setup' );

/**
 * Remove parent theme's Elementor Pro upsell from customizer
 */
function obsidian_remove_elementor_upsell() {
	remove_action( 'customize_register', 'hello_customizer_register_elementor_pro_upsell' );
}
add_action( 'init', 'obsidian_remove_elementor_upsell', 20 );

/**
 * Register Customizer settings and controls
 */
function obsidian_customize_register( $wp_customize ) {
	// Get theme settings from theme.json
	$theme_settings = obsidian_get_theme_settings();
	
	// Remove the Elementor Pro upsell section if it exists
	$wp_customize->remove_section( 'hello-upsell-elementor-pro' );
	
	// Add Obsidian Theme panel
	$wp_customize->add_panel( 'obsidian_theme_options', array(
		'title'       => __( 'Obsidian Theme Options', 'obsidian-theme' ),
		'description' => __( 'Customize your Obsidian theme settings', 'obsidian-theme' ),
		'priority'    => 30,
	) );
	
	// Colors Section
	$wp_customize->add_section( 'obsidian_colors', array(
		'title'    => __( 'Colors', 'obsidian-theme' ),
		'panel'    => 'obsidian_theme_options',
		'priority' => 10,
	) );
	
	// Add color controls
	if ( ! is_wp_error( $theme_settings ) && isset( $theme_settings['colors'] ) ) {
		$priority = 10;
		foreach ( $theme_settings['colors'] as $color_slug => $color_data ) {
			$setting_id = 'obsidian_color_' . $color_slug;
			
			// Add setting
			$wp_customize->add_setting( $setting_id, array(
				'default'           => $color_data['value'],
				'sanitize_callback' => 'sanitize_hex_color',
				'transport'         => 'postMessage',
			) );
			
			// Add control
			$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, $setting_id, array(
				'label'    => $color_data['name'],
				'section'  => 'obsidian_colors',
				'settings' => $setting_id,
				'priority' => $priority,
			) ) );
			
			$priority += 10;
		}
	}
	
	// Typography Section
	$wp_customize->add_section( 'obsidian_typography', array(
		'title'    => __( 'Typography', 'obsidian-theme' ),
		'panel'    => 'obsidian_theme_options',
		'priority' => 20,
	) );
	
	// Add font family controls
	if ( ! is_wp_error( $theme_settings ) && isset( $theme_settings['typography']['fontFamilies'] ) ) {
		$priority = 10;
		
		// Get available Google Fonts
		$google_fonts = array(
			'system-font' => 'System Font',
			'inter' => 'Inter',
			'roboto' => 'Roboto',
			'open-sans' => 'Open Sans',
			'lato' => 'Lato',
			'montserrat' => 'Montserrat',
			'playfair-display' => 'Playfair Display',
			'merriweather' => 'Merriweather',
			'lora' => 'Lora',
			'roboto-mono' => 'Roboto Mono',
			'source-code-pro' => 'Source Code Pro',
		);
		
		// Body font family
		$wp_customize->add_setting( 'obsidian_body_font_family', array(
			'default'           => 'inter',
			'sanitize_callback' => 'obsidian_sanitize_font_family',
			'transport'         => 'postMessage',
		) );
		
		$wp_customize->add_control( 'obsidian_body_font_family', array(
			'label'    => __( 'Body Font Family', 'obsidian-theme' ),
			'section'  => 'obsidian_typography',
			'type'     => 'select',
			'choices'  => $google_fonts,
			'priority' => $priority,
		) );
		
		// Heading font family
		$wp_customize->add_setting( 'obsidian_heading_font_family', array(
			'default'           => 'inter',
			'sanitize_callback' => 'obsidian_sanitize_font_family',
			'transport'         => 'postMessage',
		) );
		
		$wp_customize->add_control( 'obsidian_heading_font_family', array(
			'label'    => __( 'Heading Font Family', 'obsidian-theme' ),
			'section'  => 'obsidian_typography',
			'type'     => 'select',
			'choices'  => $google_fonts,
			'priority' => $priority + 10,
		) );
		
		// Base font size
		$wp_customize->add_setting( 'obsidian_base_font_size', array(
			'default'           => '16px',
			'sanitize_callback' => 'obsidian_sanitize_font_size',
			'transport'         => 'postMessage',
		) );
		
		$wp_customize->add_control( 'obsidian_base_font_size', array(
			'label'       => __( 'Base Font Size', 'obsidian-theme' ),
			'section'     => 'obsidian_typography',
			'type'        => 'select',
			'choices'     => array(
				'14px' => '14px',
				'15px' => '15px',
				'16px' => '16px',
				'17px' => '17px',
				'18px' => '18px',
				'20px' => '20px',
			),
			'priority'    => $priority + 20,
		) );
	}
	
	// Spacing Section
	$wp_customize->add_section( 'obsidian_spacing', array(
		'title'    => __( 'Spacing', 'obsidian-theme' ),
		'panel'    => 'obsidian_theme_options',
		'priority' => 30,
	) );
	
	// Content width
	$wp_customize->add_setting( 'obsidian_content_width', array(
		'default'           => '42rem',
		'sanitize_callback' => 'sanitize_text_field',
		'transport'         => 'postMessage',
	) );
	
	$wp_customize->add_control( 'obsidian_content_width', array(
		'label'       => __( 'Content Width', 'obsidian-theme' ),
		'section'     => 'obsidian_spacing',
		'type'        => 'text',
		'description' => __( 'Default content width (e.g., 42rem, 800px)', 'obsidian-theme' ),
	) );
	
	// Wide width
	$wp_customize->add_setting( 'obsidian_wide_width', array(
		'default'           => '64rem',
		'sanitize_callback' => 'sanitize_text_field',
		'transport'         => 'postMessage',
	) );
	
	$wp_customize->add_control( 'obsidian_wide_width', array(
		'label'       => __( 'Wide Width', 'obsidian-theme' ),
		'section'     => 'obsidian_spacing',
		'type'        => 'text',
		'description' => __( 'Wide content width (e.g., 64rem, 1200px)', 'obsidian-theme' ),
	) );
	
	// Add live preview support
	$wp_customize->get_setting( 'blogname' )->transport = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport = 'postMessage';
}
add_action( 'customize_register', 'obsidian_customize_register', 100 );

/**
 * Sanitize font family
 */
function obsidian_sanitize_font_family( $value ) {
	$valid_fonts = array(
		'system-font',
		'inter',
		'roboto',
		'open-sans',
		'lato',
		'montserrat',
		'playfair-display',
		'merriweather',
		'lora',
		'roboto-mono',
		'source-code-pro',
	);
	
	if ( in_array( $value, $valid_fonts ) ) {
		return $value;
	}
	
	return 'system-font';
}

/**
 * Sanitize font size
 */
function obsidian_sanitize_font_size( $value ) {
	$valid_sizes = array( '14px', '15px', '16px', '17px', '18px', '20px' );
	
	if ( in_array( $value, $valid_sizes ) ) {
		return $value;
	}
	
	return '16px';
}

/**
 * Enqueue customizer preview scripts
 */
function obsidian_customize_preview_js() {
	wp_enqueue_script(
		'obsidian-customizer-preview',
		get_stylesheet_directory_uri() . '/assets/js/customizer-preview.js',
		array( 'customize-preview' ),
		'1.0.0',
		true
	);
	
	// Pass theme settings to JavaScript
	$theme_settings = obsidian_get_theme_settings();
	wp_localize_script( 'obsidian-customizer-preview', 'obsidianThemeSettings', $theme_settings );
}
add_action( 'customize_preview_init', 'obsidian_customize_preview_js' );

/**
 * Save customizer settings to theme.json
 */
function obsidian_save_customizer_settings( $wp_customize ) {
	$theme_json_path = get_stylesheet_directory() . '/theme.json';
	
	if ( ! file_exists( $theme_json_path ) ) {
		return;
	}
	
	$theme_json = json_decode( file_get_contents( $theme_json_path ), true );
	
	if ( json_last_error() !== JSON_ERROR_NONE ) {
		return;
	}
	
	// Update colors
	if ( isset( $theme_json['settings']['color']['palette'] ) ) {
		foreach ( $theme_json['settings']['color']['palette'] as &$color ) {
			$setting_id = 'obsidian_color_' . $color['slug'];
			$new_value = get_theme_mod( $setting_id );
			
			if ( $new_value ) {
				$color['color'] = $new_value;
			}
		}
	}
	
	// Update typography
	$body_font = get_theme_mod( 'obsidian_body_font_family' );
	$heading_font = get_theme_mod( 'obsidian_heading_font_family' );
	$base_font_size = get_theme_mod( 'obsidian_base_font_size' );
	
	if ( $body_font && isset( $theme_json['styles']['typography'] ) ) {
		$theme_json['styles']['typography']['fontFamily'] = 'var(--wp--preset--font-family--' . $body_font . ')';
	}
	
	if ( $heading_font && isset( $theme_json['styles']['elements']['heading'] ) ) {
		$theme_json['styles']['elements']['heading']['typography']['fontFamily'] = 'var(--wp--preset--font-family--' . $heading_font . ')';
	}
	
	if ( $base_font_size && isset( $theme_json['styles']['typography'] ) ) {
		$theme_json['styles']['typography']['fontSize'] = $base_font_size;
	}
	
	// Update layout
	$content_width = get_theme_mod( 'obsidian_content_width' );
	$wide_width = get_theme_mod( 'obsidian_wide_width' );
	
	if ( $content_width && isset( $theme_json['settings']['layout'] ) ) {
		$theme_json['settings']['layout']['contentSize'] = $content_width;
	}
	
	if ( $wide_width && isset( $theme_json['settings']['layout'] ) ) {
		$theme_json['settings']['layout']['wideSize'] = $wide_width;
	}
	
	// Save updated theme.json
	file_put_contents( $theme_json_path, json_encode( $theme_json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) );
	
	// Clear caches
	wp_cache_flush();
}
add_action( 'customize_save_after', 'obsidian_save_customizer_settings' );

/**
 * Get theme settings from theme.json
 */
function obsidian_get_theme_settings() {
	$theme_json_path = get_stylesheet_directory() . '/theme.json';
	
	if ( ! file_exists( $theme_json_path ) ) {
		return new WP_Error( 'theme_json_not_found', 'theme.json file not found', array( 'status' => 404 ) );
	}
	
	$theme_json = json_decode( file_get_contents( $theme_json_path ), true );
	
	if ( json_last_error() !== JSON_ERROR_NONE ) {
		return new WP_Error( 'invalid_json', 'Invalid theme.json file', array( 'status' => 500 ) );
	}
	
	// Extract relevant settings
	$settings = array(
		'colors' => obsidian_extract_colors( $theme_json ),
		'typography' => obsidian_extract_typography( $theme_json ),
		'spacing' => obsidian_extract_spacing( $theme_json ),
		'layout' => obsidian_extract_layout( $theme_json ),
	);
	
	return $settings;
}

/**
 * Extract color settings from theme.json
 */
function obsidian_extract_colors( $theme_json ) {
	$colors = array();
	
	if ( isset( $theme_json['settings']['color']['palette'] ) ) {
		foreach ( $theme_json['settings']['color']['palette'] as $color ) {
			$colors[ $color['slug'] ] = array(
				'value' => $color['color'],
				'name' => $color['name'],
			);
		}
	}
	
	return $colors;
}

/**
 * Extract typography settings from theme.json
 */
function obsidian_extract_typography( $theme_json ) {
	$typography = array(
		'fontFamilies' => array(),
		'fontSizes' => array(),
	);
	
	if ( isset( $theme_json['settings']['typography']['fontFamilies'] ) ) {
		foreach ( $theme_json['settings']['typography']['fontFamilies'] as $font ) {
			$typography['fontFamilies'][ $font['slug'] ] = array(
				'value' => $font['fontFamily'],
				'name' => $font['name'],
			);
		}
	}
	
	if ( isset( $theme_json['settings']['typography']['fontSizes'] ) ) {
		foreach ( $theme_json['settings']['typography']['fontSizes'] as $size ) {
			$typography['fontSizes'][ $size['slug'] ] = array(
				'value' => $size['size'],
				'name' => $size['name'],
			);
		}
	}
	
	return $typography;
}

/**
 * Extract spacing settings from theme.json
 */
function obsidian_extract_spacing( $theme_json ) {
	$spacing = array(
		'sizes' => array(),
		'units' => array(),
	);
	
	if ( isset( $theme_json['settings']['spacing']['spacingSizes'] ) ) {
		foreach ( $theme_json['settings']['spacing']['spacingSizes'] as $size ) {
			$spacing['sizes'][ $size['slug'] ] = array(
				'value' => $size['size'],
				'name' => $size['name'],
			);
		}
	}
	
	if ( isset( $theme_json['settings']['spacing']['units'] ) ) {
		$spacing['units'] = $theme_json['settings']['spacing']['units'];
	}
	
	return $spacing;
}

/**
 * Extract layout settings from theme.json
 */
function obsidian_extract_layout( $theme_json ) {
	$layout = array();
	
	if ( isset( $theme_json['settings']['layout'] ) ) {
		$layout = $theme_json['settings']['layout'];
	}
	
	return $layout;
}

/**
 * Register REST API routes
 */
function obsidian_register_rest_routes() {
	// Main settings endpoint - GET only
	register_rest_route( 'obsidian/v1', '/theme/settings', array(
		'methods'             => 'GET',
		'callback'            => 'obsidian_get_theme_settings_endpoint',
		'permission_callback' => '__return_true',
	) );
	
	// Colors endpoint - GET and POST
	register_rest_route( 'obsidian/v1', '/theme/colors', array(
		array(
			'methods'             => 'GET',
			'callback'            => 'obsidian_get_colors_endpoint',
			'permission_callback' => '__return_true',
		),
		array(
			'methods'             => 'POST',
			'callback'            => 'obsidian_update_colors_endpoint',
			'permission_callback' => 'obsidian_update_permission_check',
			'args'                => array(
				'colors' => array(
					'required' => true,
					'type'     => 'object',
				),
			),
		),
	) );
	
	// Typography endpoint - GET and POST
	register_rest_route( 'obsidian/v1', '/theme/typography', array(
		array(
			'methods'             => 'GET',
			'callback'            => 'obsidian_get_typography_endpoint',
			'permission_callback' => '__return_true',
		),
		array(
			'methods'             => 'POST',
			'callback'            => 'obsidian_update_typography_endpoint',
			'permission_callback' => 'obsidian_update_permission_check',
			'args'                => array(
				'typography' => array(
					'required' => true,
					'type'     => 'object',
				),
			),
		),
	) );
	
	// Spacing endpoint - GET only
	register_rest_route( 'obsidian/v1', '/theme/spacing', array(
		'methods'             => 'GET',
		'callback'            => 'obsidian_get_spacing_endpoint',
		'permission_callback' => '__return_true',
	) );
	
	// Layout endpoint - GET only
	register_rest_route( 'obsidian/v1', '/theme/layout', array(
		'methods'             => 'GET',
		'callback'            => 'obsidian_get_layout_endpoint',
		'permission_callback' => '__return_true',
	) );
	
	// Google Fonts endpoint - GET available fonts
	register_rest_route( 'obsidian/v1', '/theme/google-fonts', array(
		'methods'             => 'GET',
		'callback'            => 'obsidian_get_google_fonts_endpoint',
		'permission_callback' => '__return_true',
	) );
}
add_action( 'rest_api_init', 'obsidian_register_rest_routes' );

/**
 * Get theme settings endpoint
 */
function obsidian_get_theme_settings_endpoint( $request ) {
	$settings = obsidian_get_theme_settings();
	
	if ( is_wp_error( $settings ) ) {
		return $settings;
	}
	
	return rest_ensure_response( $settings );
}

/**
 * Get colors endpoint
 */
function obsidian_get_colors_endpoint( $request ) {
	$settings = obsidian_get_theme_settings();
	
	if ( is_wp_error( $settings ) ) {
		return $settings;
	}
	
	return rest_ensure_response( $settings['colors'] );
}

/**
 * Update colors endpoint
 */
function obsidian_update_colors_endpoint( $request ) {
	$colors = $request->get_param( 'colors' );
	
	// Update theme.json with new colors
	$result = obsidian_update_theme_json_colors( $colors );
	
	if ( is_wp_error( $result ) ) {
		return $result;
	}
	
	// Clear any caches
	wp_cache_flush();
	
	return rest_ensure_response( array(
		'success' => true,
		'message' => 'Colors updated successfully',
		'colors'  => $colors,
	) );
}

/**
 * Get typography endpoint
 */
function obsidian_get_typography_endpoint( $request ) {
	$settings = obsidian_get_theme_settings();
	
	if ( is_wp_error( $settings ) ) {
		return $settings;
	}
	
	return rest_ensure_response( $settings['typography'] );
}

/**
 * Update typography endpoint
 */
function obsidian_update_typography_endpoint( $request ) {
	$typography = $request->get_param( 'typography' );
	
	// Update theme.json with new typography
	$result = obsidian_update_theme_json_typography( $typography );
	
	if ( is_wp_error( $result ) ) {
		return $result;
	}
	
	// Clear any caches
	wp_cache_flush();
	
	return rest_ensure_response( array(
		'success'    => true,
		'message'    => 'Typography updated successfully',
		'typography' => $typography,
	) );
}

/**
 * Get spacing endpoint
 */
function obsidian_get_spacing_endpoint( $request ) {
	$settings = obsidian_get_theme_settings();
	
	if ( is_wp_error( $settings ) ) {
		return $settings;
	}
	
	return rest_ensure_response( $settings['spacing'] );
}

/**
 * Get layout endpoint
 */
function obsidian_get_layout_endpoint( $request ) {
	$settings = obsidian_get_theme_settings();
	
	if ( is_wp_error( $settings ) ) {
		return $settings;
	}
	
	return rest_ensure_response( $settings['layout'] );
}

/**
 * Get available Google Fonts
 */
function obsidian_get_google_fonts_endpoint( $request ) {
	// This is a curated list of popular Google Fonts
	// In a production environment, you might want to fetch this from Google Fonts API
	$fonts = array(
		'inter' => array(
			'name' => 'Inter',
			'category' => 'sans-serif',
			'variants' => array( '100', '200', '300', '400', '500', '600', '700', '800', '900' ),
		),
		'roboto' => array(
			'name' => 'Roboto',
			'category' => 'sans-serif',
			'variants' => array( '100', '300', '400', '500', '700', '900' ),
		),
		'open-sans' => array(
			'name' => 'Open Sans',
			'category' => 'sans-serif',
			'variants' => array( '300', '400', '500', '600', '700', '800' ),
		),
		'lato' => array(
			'name' => 'Lato',
			'category' => 'sans-serif',
			'variants' => array( '100', '300', '400', '700', '900' ),
		),
		'montserrat' => array(
			'name' => 'Montserrat',
			'category' => 'sans-serif',
			'variants' => array( '100', '200', '300', '400', '500', '600', '700', '800', '900' ),
		),
		'playfair-display' => array(
			'name' => 'Playfair Display',
			'category' => 'serif',
			'variants' => array( '400', '500', '600', '700', '800', '900' ),
		),
		'merriweather' => array(
			'name' => 'Merriweather',
			'category' => 'serif',
			'variants' => array( '300', '400', '700', '900' ),
		),
		'lora' => array(
			'name' => 'Lora',
			'category' => 'serif',
			'variants' => array( '400', '500', '600', '700' ),
		),
		'roboto-mono' => array(
			'name' => 'Roboto Mono',
			'category' => 'monospace',
			'variants' => array( '100', '200', '300', '400', '500', '600', '700' ),
		),
		'source-code-pro' => array(
			'name' => 'Source Code Pro',
			'category' => 'monospace',
			'variants' => array( '200', '300', '400', '500', '600', '700', '800', '900' ),
		),
	);
	
	return rest_ensure_response( $fonts );
}

/**
 * Permission check for update endpoints
 */
function obsidian_update_permission_check( $request ) {
	return current_user_can( 'edit_theme_options' );
}

/**
 * Update theme.json colors
 */
function obsidian_update_theme_json_colors( $colors ) {
	$theme_json_path = get_stylesheet_directory() . '/theme.json';
	
	if ( ! file_exists( $theme_json_path ) ) {
		return new WP_Error( 'theme_json_not_found', 'theme.json file not found' );
	}
	
	$theme_json = json_decode( file_get_contents( $theme_json_path ), true );
	
	if ( json_last_error() !== JSON_ERROR_NONE ) {
		return new WP_Error( 'invalid_json', 'Invalid theme.json file' );
	}
	
	// Update colors in palette
	if ( isset( $theme_json['settings']['color']['palette'] ) ) {
		foreach ( $theme_json['settings']['color']['palette'] as &$color ) {
			if ( isset( $colors[ $color['slug'] ] ) ) {
				$color['color'] = $colors[ $color['slug'] ]['value'];
			}
		}
	}
	
	// Save updated theme.json
	$result = file_put_contents( $theme_json_path, json_encode( $theme_json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) );
	
	if ( $result === false ) {
		return new WP_Error( 'save_failed', 'Failed to save theme.json' );
	}
	
	return true;
}

/**
 * Update theme.json typography
 */
function obsidian_update_theme_json_typography( $typography ) {
	$theme_json_path = get_stylesheet_directory() . '/theme.json';
	
	if ( ! file_exists( $theme_json_path ) ) {
		return new WP_Error( 'theme_json_not_found', 'theme.json file not found' );
	}
	
	$theme_json = json_decode( file_get_contents( $theme_json_path ), true );
	
	if ( json_last_error() !== JSON_ERROR_NONE ) {
		return new WP_Error( 'invalid_json', 'Invalid theme.json file' );
	}
	
	// Update font families
	if ( isset( $typography['fontFamilies'] ) && isset( $theme_json['settings']['typography']['fontFamilies'] ) ) {
		foreach ( $theme_json['settings']['typography']['fontFamilies'] as &$font ) {
			if ( isset( $typography['fontFamilies'][ $font['slug'] ] ) ) {
				$font['fontFamily'] = $typography['fontFamilies'][ $font['slug'] ]['value'];
				$font['name'] = $typography['fontFamilies'][ $font['slug'] ]['name'];
			}
		}
	}
	
	// Update font sizes
	if ( isset( $typography['fontSizes'] ) && isset( $theme_json['settings']['typography']['fontSizes'] ) ) {
		foreach ( $theme_json['settings']['typography']['fontSizes'] as &$size ) {
			if ( isset( $typography['fontSizes'][ $size['slug'] ] ) ) {
				$size['size'] = $typography['fontSizes'][ $size['slug'] ]['value'];
			}
		}
	}
	
	// Save updated theme.json
	$result = file_put_contents( $theme_json_path, json_encode( $theme_json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) );
	
	if ( $result === false ) {
		return new WP_Error( 'save_failed', 'Failed to save theme.json' );
	}
	
	return true;
}

/**
 * Add theme support for Customizer integration
 */
function obsidian_customizer_integration() {
	// Only add custom logo support to avoid duplicate color controls
	add_theme_support( 'custom-logo' );
}
add_action( 'after_setup_theme', 'obsidian_customizer_integration' );

/**
 * Remove default WordPress customizer sections that conflict with our theme options
 */
function obsidian_remove_default_customizer_sections( $wp_customize ) {
	// Remove the default Colors section to avoid confusion with our color controls
	$wp_customize->remove_section( 'colors' );
	
	// Remove the default Background Image section
	$wp_customize->remove_section( 'background_image' );
	
	// Keep Header Image if the parent theme uses it, but you can remove it if not needed
	// $wp_customize->remove_section( 'header_image' );
}
add_action( 'customize_register', 'obsidian_remove_default_customizer_sections', 20 );

/**
 * Output dynamic CSS based on customizer settings
 */
function obsidian_customizer_css() {
	$theme_settings = obsidian_get_theme_settings();
	
	if ( is_wp_error( $theme_settings ) ) {
		return;
	}
	
	?>
	<style type="text/css" id="obsidian-customizer-css">
		<?php
		// Output color CSS variables
		if ( isset( $theme_settings['colors'] ) ) {
			echo ':root {';
			foreach ( $theme_settings['colors'] as $color_slug => $color_data ) {
				$color_value = get_theme_mod( 'obsidian_color_' . $color_slug, $color_data['value'] );
				echo '--wp--preset--color--' . $color_slug . ': ' . $color_value . ';';
			}
			echo '}';
		}
		?>
	</style>
	<?php
}
add_action( 'wp_head', 'obsidian_customizer_css' );
