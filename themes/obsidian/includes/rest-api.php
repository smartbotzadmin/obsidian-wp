<?php
/**
 * Obsidian Theme REST API Endpoints
 *
 * @package Obsidian
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register REST API routes for theme settings
 */
function obsidian_register_rest_routes() {
	// Register namespace
	register_rest_route( 'obsidian/v1', '/theme/settings', array(
		'methods'             => 'GET',
		'callback'            => 'obsidian_get_theme_settings_endpoint',
		'permission_callback' => '__return_true',
	) );
	
	register_rest_route( 'obsidian/v1', '/theme/settings', array(
		'methods'             => 'POST',
		'callback'            => 'obsidian_update_theme_settings_endpoint',
		'permission_callback' => 'obsidian_update_settings_permission_check',
		'args'                => obsidian_get_settings_schema(),
	) );
	
	// Colors endpoint
	register_rest_route( 'obsidian/v1', '/theme/colors', array(
		'methods'             => 'GET',
		'callback'            => 'obsidian_get_colors_endpoint',
		'permission_callback' => '__return_true',
	) );
	
	register_rest_route( 'obsidian/v1', '/theme/colors', array(
		'methods'             => 'POST',
		'callback'            => 'obsidian_update_colors_endpoint',
		'permission_callback' => 'obsidian_update_settings_permission_check',
		'args'                => obsidian_get_colors_schema(),
	) );
	
	// Typography endpoint
	register_rest_route( 'obsidian/v1', '/theme/typography', array(
		'methods'             => 'GET',
		'callback'            => 'obsidian_get_typography_endpoint',
		'permission_callback' => '__return_true',
	) );
	
	register_rest_route( 'obsidian/v1', '/theme/typography', array(
		'methods'             => 'POST',
		'callback'            => 'obsidian_update_typography_endpoint',
		'permission_callback' => 'obsidian_update_settings_permission_check',
		'args'                => obsidian_get_typography_schema(),
	) );
	
	// Layout endpoint
	register_rest_route( 'obsidian/v1', '/theme/layout', array(
		'methods'             => 'GET',
		'callback'            => 'obsidian_get_layout_endpoint',
		'permission_callback' => '__return_true',
	) );
	
	register_rest_route( 'obsidian/v1', '/theme/layout', array(
		'methods'             => 'POST',
		'callback'            => 'obsidian_update_layout_endpoint',
		'permission_callback' => 'obsidian_update_settings_permission_check',
		'args'                => obsidian_get_layout_schema(),
	) );
}
add_action( 'rest_api_init', 'obsidian_register_rest_routes' );

/**
 * Get all theme settings endpoint
 */
function obsidian_get_theme_settings_endpoint( $request ) {
	$settings = obsidian_get_theme_settings();
	
	return rest_ensure_response( array(
		'success' => true,
		'data'    => $settings,
	) );
}

/**
 * Update theme settings endpoint
 */
function obsidian_update_theme_settings_endpoint( $request ) {
	$params = $request->get_params();
	
	// Validate and sanitize the settings
	$sanitized_settings = obsidian_sanitize_theme_settings( $params );
	
	if ( is_wp_error( $sanitized_settings ) ) {
		return $sanitized_settings;
	}
	
	$updated = obsidian_update_theme_settings( $sanitized_settings );
	
	if ( $updated ) {
		// Clear any caches
		do_action( 'obsidian_theme_settings_updated', $sanitized_settings );
		
		return rest_ensure_response( array(
			'success' => true,
			'message' => __( 'Theme settings updated successfully.', 'obsidian' ),
			'data'    => obsidian_get_theme_settings(),
		) );
	}
	
	return new WP_Error( 'update_failed', __( 'Failed to update theme settings.', 'obsidian' ), array( 'status' => 500 ) );
}

/**
 * Get colors endpoint
 */
function obsidian_get_colors_endpoint( $request ) {
	$settings = obsidian_get_theme_settings();
	
	return rest_ensure_response( array(
		'success' => true,
		'data'    => $settings['colors'] ?? array(),
	) );
}

/**
 * Update colors endpoint
 */
function obsidian_update_colors_endpoint( $request ) {
	$colors = $request->get_param( 'colors' );
	
	if ( empty( $colors ) || ! is_array( $colors ) ) {
		return new WP_Error( 'invalid_colors', __( 'Invalid colors data.', 'obsidian' ), array( 'status' => 400 ) );
	}
	
	$current_settings = obsidian_get_theme_settings();
	$current_settings['colors'] = obsidian_sanitize_colors( $colors );
	
	$updated = obsidian_update_theme_settings( $current_settings );
	
	if ( $updated ) {
		do_action( 'obsidian_theme_colors_updated', $current_settings['colors'] );
		
		return rest_ensure_response( array(
			'success' => true,
			'message' => __( 'Colors updated successfully.', 'obsidian' ),
			'data'    => $current_settings['colors'],
		) );
	}
	
	return new WP_Error( 'update_failed', __( 'Failed to update colors.', 'obsidian' ), array( 'status' => 500 ) );
}

/**
 * Get typography endpoint
 */
function obsidian_get_typography_endpoint( $request ) {
	$settings = obsidian_get_theme_settings();
	
	return rest_ensure_response( array(
		'success' => true,
		'data'    => $settings['typography'] ?? array(),
	) );
}

/**
 * Update typography endpoint
 */
function obsidian_update_typography_endpoint( $request ) {
	$typography = $request->get_param( 'typography' );
	
	if ( empty( $typography ) || ! is_array( $typography ) ) {
		return new WP_Error( 'invalid_typography', __( 'Invalid typography data.', 'obsidian' ), array( 'status' => 400 ) );
	}
	
	$current_settings = obsidian_get_theme_settings();
	$current_settings['typography'] = obsidian_sanitize_typography( $typography );
	
	$updated = obsidian_update_theme_settings( $current_settings );
	
	if ( $updated ) {
		do_action( 'obsidian_theme_typography_updated', $current_settings['typography'] );
		
		return rest_ensure_response( array(
			'success' => true,
			'message' => __( 'Typography updated successfully.', 'obsidian' ),
			'data'    => $current_settings['typography'],
		) );
	}
	
	return new WP_Error( 'update_failed', __( 'Failed to update typography.', 'obsidian' ), array( 'status' => 500 ) );
}

/**
 * Get layout endpoint
 */
function obsidian_get_layout_endpoint( $request ) {
	$settings = obsidian_get_theme_settings();
	
	return rest_ensure_response( array(
		'success' => true,
		'data'    => $settings['layout'] ?? array(),
	) );
}

/**
 * Update layout endpoint
 */
function obsidian_update_layout_endpoint( $request ) {
	$layout = $request->get_param( 'layout' );
	
	if ( empty( $layout ) || ! is_array( $layout ) ) {
		return new WP_Error( 'invalid_layout', __( 'Invalid layout data.', 'obsidian' ), array( 'status' => 400 ) );
	}
	
	$current_settings = obsidian_get_theme_settings();
	$current_settings['layout'] = obsidian_sanitize_layout( $layout );
	
	$updated = obsidian_update_theme_settings( $current_settings );
	
	if ( $updated ) {
		do_action( 'obsidian_theme_layout_updated', $current_settings['layout'] );
		
		return rest_ensure_response( array(
			'success' => true,
			'message' => __( 'Layout updated successfully.', 'obsidian' ),
			'data'    => $current_settings['layout'],
		) );
	}
	
	return new WP_Error( 'update_failed', __( 'Failed to update layout.', 'obsidian' ), array( 'status' => 500 ) );
}

/**
 * Permission check for updating settings
 */
function obsidian_update_settings_permission_check( $request ) {
	// Check if user can customize theme
	if ( ! current_user_can( 'customize' ) ) {
		return false;
	}
	
	// Verify nonce for additional security
	$nonce = $request->get_header( 'X-WP-Nonce' );
	if ( ! wp_verify_nonce( $nonce, 'wp_rest' ) ) {
		return false;
	}
	
	return true;
}

/**
 * Get settings schema for validation
 */
function obsidian_get_settings_schema() {
	return array(
		'colors' => array(
			'type'       => 'object',
			'properties' => obsidian_get_colors_schema()['colors']['properties'],
		),
		'typography' => array(
			'type'       => 'object',
			'properties' => obsidian_get_typography_schema()['typography']['properties'],
		),
		'layout' => array(
			'type'       => 'object',
			'properties' => obsidian_get_layout_schema()['layout']['properties'],
		),
	);
}

/**
 * Get colors schema
 */
function obsidian_get_colors_schema() {
	return array(
		'colors' => array(
			'type'       => 'object',
			'properties' => array(
				'primary'    => array( 'type' => 'string', 'format' => 'hex-color' ),
				'secondary'  => array( 'type' => 'string', 'format' => 'hex-color' ),
				'accent'     => array( 'type' => 'string', 'format' => 'hex-color' ),
				'background' => array( 'type' => 'string', 'format' => 'hex-color' ),
				'text'       => array( 'type' => 'string', 'format' => 'hex-color' ),
				'muted'      => array( 'type' => 'string', 'format' => 'hex-color' ),
			),
		),
	);
}

/**
 * Get typography schema
 */
function obsidian_get_typography_schema() {
	return array(
		'typography' => array(
			'type'       => 'object',
			'properties' => array(
				'primary-family'   => array( 'type' => 'string' ),
				'secondary-family' => array( 'type' => 'string' ),
				'base-size'        => array( 'type' => 'string' ),
				'scale-ratio'      => array( 'type' => 'string' ),
				'line-height'      => array( 'type' => 'string' ),
			),
		),
	);
}

/**
 * Get layout schema
 */
function obsidian_get_layout_schema() {
	return array(
		'layout' => array(
			'type'       => 'object',
			'properties' => array(
				'container-width' => array( 'type' => 'string' ),
				'content-width'   => array( 'type' => 'string' ),
				'sidebar-width'   => array( 'type' => 'string' ),
				'gutter'          => array( 'type' => 'string' ),
			),
		),
	);
}

/**
 * Sanitize theme settings
 */
function obsidian_sanitize_theme_settings( $settings ) {
	$sanitized = array();
	
	if ( isset( $settings['colors'] ) ) {
		$sanitized['colors'] = obsidian_sanitize_colors( $settings['colors'] );
	}
	
	if ( isset( $settings['typography'] ) ) {
		$sanitized['typography'] = obsidian_sanitize_typography( $settings['typography'] );
	}
	
	if ( isset( $settings['layout'] ) ) {
		$sanitized['layout'] = obsidian_sanitize_layout( $settings['layout'] );
	}
	
	return $sanitized;
}

/**
 * Sanitize colors
 */
function obsidian_sanitize_colors( $colors ) {
	$sanitized = array();
	$allowed_keys = array( 'primary', 'secondary', 'accent', 'background', 'text', 'muted' );
	
	foreach ( $allowed_keys as $key ) {
		if ( isset( $colors[ $key ] ) ) {
			$sanitized[ $key ] = sanitize_hex_color( $colors[ $key ] );
		}
	}
	
	return $sanitized;
}

/**
 * Sanitize typography
 */
function obsidian_sanitize_typography( $typography ) {
	$sanitized = array();
	$allowed_keys = array( 'primary-family', 'secondary-family', 'base-size', 'scale-ratio', 'line-height' );
	
	foreach ( $allowed_keys as $key ) {
		if ( isset( $typography[ $key ] ) ) {
			$sanitized[ $key ] = sanitize_text_field( $typography[ $key ] );
		}
	}
	
	return $sanitized;
}

/**
 * Sanitize layout
 */
function obsidian_sanitize_layout( $layout ) {
	$sanitized = array();
	$allowed_keys = array( 'container-width', 'content-width', 'sidebar-width', 'gutter' );
	
	foreach ( $allowed_keys as $key ) {
		if ( isset( $layout[ $key ] ) ) {
			$sanitized[ $key ] = sanitize_text_field( $layout[ $key ] );
		}
	}
	
	return $sanitized;
}