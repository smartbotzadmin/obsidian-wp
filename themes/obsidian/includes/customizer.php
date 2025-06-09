<?php
/**
 * Obsidian Theme Customizer Integration
 *
 * @package Obsidian
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add customizer settings and controls
 */
function obsidian_customize_register( $wp_customize ) {
	// Add Obsidian Panel
	$wp_customize->add_panel( 'obsidian_panel', array(
		'title'       => __( 'Obsidian Theme Settings', 'obsidian' ),
		'description' => __( 'Customize your Obsidian theme settings.', 'obsidian' ),
		'priority'    => 30,
	) );
	
	// Colors Section
	obsidian_add_colors_section( $wp_customize );
	
	// Typography Section
	obsidian_add_typography_section( $wp_customize );
	
	// Layout Section
	obsidian_add_layout_section( $wp_customize );
}
add_action( 'customize_register', 'obsidian_customize_register' );

/**
 * Add colors section to customizer
 */
function obsidian_add_colors_section( $wp_customize ) {
	// Colors Section
	$wp_customize->add_section( 'obsidian_colors', array(
		'title'    => __( 'Colors', 'obsidian' ),
		'panel'    => 'obsidian_panel',
		'priority' => 10,
	) );
	
	$colors = array(
		'primary'    => __( 'Primary Color', 'obsidian' ),
		'secondary'  => __( 'Secondary Color', 'obsidian' ),
		'accent'     => __( 'Accent Color', 'obsidian' ),
		'background' => __( 'Background Color', 'obsidian' ),
		'text'       => __( 'Text Color', 'obsidian' ),
		'muted'      => __( 'Muted Text Color', 'obsidian' ),
	);
	
	foreach ( $colors as $key => $label ) {
		// Setting
		$wp_customize->add_setting( "obsidian_color_{$key}", array(
			'default'           => obsidian_get_default_color( $key ),
			'sanitize_callback' => 'sanitize_hex_color',
			'transport'         => 'postMessage',
		) );
		
		// Control
		$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, "obsidian_color_{$key}", array(
			'label'   => $label,
			'section' => 'obsidian_colors',
			'setting' => "obsidian_color_{$key}",
		) ) );
	}
}

/**
 * Add typography section to customizer
 */
function obsidian_add_typography_section( $wp_customize ) {
	// Typography Section
	$wp_customize->add_section( 'obsidian_typography', array(
		'title'    => __( 'Typography', 'obsidian' ),
		'panel'    => 'obsidian_panel',
		'priority' => 20,
	) );
	
	// Primary Font Family
	$wp_customize->add_setting( 'obsidian_font_primary_family', array(
		'default'           => 'system-ui, -apple-system, sans-serif',
		'sanitize_callback' => 'sanitize_text_field',
		'transport'         => 'postMessage',
	) );
	
	$wp_customize->add_control( 'obsidian_font_primary_family', array(
		'label'       => __( 'Primary Font Family', 'obsidian' ),
		'section'     => 'obsidian_typography',
		'type'        => 'select',
		'choices'     => obsidian_get_font_choices(),
		'description' => __( 'Font used for body text and most content.', 'obsidian' ),
	) );
	
	// Secondary Font Family
	$wp_customize->add_setting( 'obsidian_font_secondary_family', array(
		'default'           => 'Georgia, serif',
		'sanitize_callback' => 'sanitize_text_field',
		'transport'         => 'postMessage',
	) );
	
	$wp_customize->add_control( 'obsidian_font_secondary_family', array(
		'label'       => __( 'Secondary Font Family', 'obsidian' ),
		'section'     => 'obsidian_typography',
		'type'        => 'select',
		'choices'     => obsidian_get_font_choices(),
		'description' => __( 'Font used for headings and emphasis.', 'obsidian' ),
	) );
	
	// Base Font Size
	$wp_customize->add_setting( 'obsidian_font_base_size', array(
		'default'           => '16px',
		'sanitize_callback' => 'sanitize_text_field',
		'transport'         => 'postMessage',
	) );
	
	$wp_customize->add_control( 'obsidian_font_base_size', array(
		'label'       => __( 'Base Font Size', 'obsidian' ),
		'section'     => 'obsidian_typography',
		'type'        => 'select',
		'choices'     => array(
			'14px' => '14px',
			'15px' => '15px',
			'16px' => '16px',
			'17px' => '17px',
			'18px' => '18px',
			'19px' => '19px',
			'20px' => '20px',
		),
		'description' => __( 'Base font size for body text.', 'obsidian' ),
	) );
	
	// Line Height
	$wp_customize->add_setting( 'obsidian_font_line_height', array(
		'default'           => '1.6',
		'sanitize_callback' => 'sanitize_text_field',
		'transport'         => 'postMessage',
	) );
	
	$wp_customize->add_control( 'obsidian_font_line_height', array(
		'label'       => __( 'Line Height', 'obsidian' ),
		'section'     => 'obsidian_typography',
		'type'        => 'select',
		'choices'     => array(
			'1.2' => '1.2',
			'1.3' => '1.3',
			'1.4' => '1.4',
			'1.5' => '1.5',
			'1.6' => '1.6',
			'1.7' => '1.7',
			'1.8' => '1.8',
		),
		'description' => __( 'Line height for better readability.', 'obsidian' ),
	) );
}

/**
 * Add layout section to customizer
 */
function obsidian_add_layout_section( $wp_customize ) {
	// Layout Section
	$wp_customize->add_section( 'obsidian_layout', array(
		'title'    => __( 'Layout', 'obsidian' ),
		'panel'    => 'obsidian_panel',
		'priority' => 30,
	) );
	
	// Container Width
	$wp_customize->add_setting( 'obsidian_layout_container_width', array(
		'default'           => '1200px',
		'sanitize_callback' => 'sanitize_text_field',
		'transport'         => 'postMessage',
	) );
	
	$wp_customize->add_control( 'obsidian_layout_container_width', array(
		'label'       => __( 'Container Width', 'obsidian' ),
		'section'     => 'obsidian_layout',
		'type'        => 'select',
		'choices'     => array(
			'1000px' => '1000px',
			'1100px' => '1100px',
			'1200px' => '1200px',
			'1300px' => '1300px',
			'1400px' => '1400px',
			'100%'   => 'Full Width',
		),
		'description' => __( 'Maximum width of the main container.', 'obsidian' ),
	) );
	
	// Content Width
	$wp_customize->add_setting( 'obsidian_layout_content_width', array(
		'default'           => '800px',
		'sanitize_callback' => 'sanitize_text_field',
		'transport'         => 'postMessage',
	) );
	
	$wp_customize->add_control( 'obsidian_layout_content_width', array(
		'label'       => __( 'Content Width', 'obsidian' ),
		'section'     => 'obsidian_layout',
		'type'        => 'select',
		'choices'     => array(
			'600px' => '600px',
			'700px' => '700px',
			'800px' => '800px',
			'900px' => '900px',
			'1000px' => '1000px',
		),
		'description' => __( 'Width of the main content area.', 'obsidian' ),
	) );
	
	// Gutter Size
	$wp_customize->add_setting( 'obsidian_layout_gutter', array(
		'default'           => '2rem',
		'sanitize_callback' => 'sanitize_text_field',
		'transport'         => 'postMessage',
	) );
	
	$wp_customize->add_control( 'obsidian_layout_gutter', array(
		'label'       => __( 'Gutter Size', 'obsidian' ),
		'section'     => 'obsidian_layout',
		'type'        => 'select',
		'choices'     => array(
			'1rem'   => 'Small (1rem)',
			'1.5rem' => 'Medium (1.5rem)',
			'2rem'   => 'Large (2rem)',
			'2.5rem' => 'Extra Large (2.5rem)',
			'3rem'   => 'Huge (3rem)',
		),
		'description' => __( 'Spacing between elements.', 'obsidian' ),
	) );
}

/**
 * Get default color value
 */
function obsidian_get_default_color( $key ) {
	$defaults = array(
		'primary'    => '#2563eb',
		'secondary'  => '#64748b',
		'accent'     => '#f59e0b',
		'background' => '#ffffff',
		'text'       => '#1f2937',
		'muted'      => '#6b7280',
	);
	
	return $defaults[ $key ] ?? '#000000';
}

/**
 * Get font choices for select controls
 */
function obsidian_get_font_choices() {
	return array(
		'system-ui, -apple-system, sans-serif' => 'System Sans-serif',
		'Georgia, serif'                       => 'Georgia (Serif)',
		'"Times New Roman", serif'             => 'Times New Roman (Serif)',
		'Arial, sans-serif'                    => 'Arial (Sans-serif)',
		'"Helvetica Neue", sans-serif'         => 'Helvetica Neue (Sans-serif)',
		'"Segoe UI", sans-serif'               => 'Segoe UI (Sans-serif)',
		'Verdana, sans-serif'                  => 'Verdana (Sans-serif)',
		'"Courier New", monospace'             => 'Courier New (Monospace)',
		'Monaco, monospace'                    => 'Monaco (Monospace)',
	);
}

/**
 * Sync customizer settings with theme options
 */
function obsidian_sync_customizer_settings() {
	$current_settings = obsidian_get_theme_settings();
	
	// Sync colors
	$colors = array( 'primary', 'secondary', 'accent', 'background', 'text', 'muted' );
	foreach ( $colors as $color ) {
		$customizer_value = get_theme_mod( "obsidian_color_{$color}" );
		if ( $customizer_value ) {
			$current_settings['colors'][ $color ] = $customizer_value;
		}
	}
	
	// Sync typography
	$typography_settings = array(
		'primary-family' => get_theme_mod( 'obsidian_font_primary_family' ),
		'secondary-family' => get_theme_mod( 'obsidian_font_secondary_family' ),
		'base-size' => get_theme_mod( 'obsidian_font_base_size' ),
		'line-height' => get_theme_mod( 'obsidian_font_line_height' ),
	);
	
	foreach ( $typography_settings as $key => $value ) {
		if ( $value ) {
			$current_settings['typography'][ $key ] = $value;
		}
	}
	
	// Sync layout
	$layout_settings = array(
		'container-width' => get_theme_mod( 'obsidian_layout_container_width' ),
		'content-width' => get_theme_mod( 'obsidian_layout_content_width' ),
		'gutter' => get_theme_mod( 'obsidian_layout_gutter' ),
	);
	
	foreach ( $layout_settings as $key => $value ) {
		if ( $value ) {
			$current_settings['layout'][ $key ] = $value;
		}
	}
	
	// Update the theme settings
	obsidian_update_theme_settings( $current_settings );
}
add_action( 'customize_save_after', 'obsidian_sync_customizer_settings' );

/**
 * Add customizer preview JavaScript
 */
function obsidian_customize_preview_js() {
	wp_enqueue_script( 
		'obsidian-customizer-preview', 
		OBSIDIAN_ASSETS_URL . '/js/customizer-preview.js', 
		array( 'customize-preview' ), 
		OBSIDIAN_VERSION, 
		true 
	);
}
add_action( 'customize_preview_init', 'obsidian_customize_preview_js' );

/**
 * Add customizer control JavaScript
 */
function obsidian_customize_controls_js() {
	wp_enqueue_script( 
		'obsidian-customizer-controls', 
		OBSIDIAN_ASSETS_URL . '/js/customizer-controls.js', 
		array( 'customize-controls' ), 
		OBSIDIAN_VERSION, 
		true 
	);
}
add_action( 'customize_controls_enqueue_scripts', 'obsidian_customize_controls_js' );