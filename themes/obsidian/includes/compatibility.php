<?php
/**
 * Obsidian Theme Compatibility
 *
 * @package Obsidian
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Add theme compatibility features
 */
function obsidian_theme_compatibility() {
	// Add support for WordPress core features
	add_theme_support( 'menus' );
	add_theme_support( 'widgets' );
	add_theme_support( 'customize-selective-refresh-widgets' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'title-tag' );
	
	// Add support for Gutenberg features
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'align-wide' );
	
	// Add support for custom header and background
	add_theme_support( 'custom-header', array(
		'default-image'      => '',
		'default-text-color' => '000',
		'width'              => 1200,
		'height'             => 400,
		'flex-height'        => true,
		'flex-width'         => true,
	) );
	
	add_theme_support( 'custom-background', array(
		'default-color' => 'ffffff',
	) );
	
	// Add support for custom logo
	add_theme_support( 'custom-logo', array(
		'height'      => 100,
		'width'       => 400,
		'flex-height' => true,
		'flex-width'  => true,
	) );
}
add_action( 'after_setup_theme', 'obsidian_theme_compatibility' );

/**
 * Elementor compatibility
 */
function obsidian_elementor_compatibility() {
	// Add Elementor support
	add_theme_support( 'elementor' );
	
	// Add Hello Elementor compatibility
	if ( defined( 'ELEMENTOR_VERSION' ) ) {
		// Remove Elementor's default colors and fonts
		add_filter( 'elementor/editor/localize_settings', 'obsidian_elementor_remove_defaults' );
		
		// Add Obsidian colors to Elementor
		add_action( 'elementor/init', 'obsidian_add_elementor_colors' );
	}
}
add_action( 'after_setup_theme', 'obsidian_elementor_compatibility' );

/**
 * Remove Elementor default colors and fonts
 */
function obsidian_elementor_remove_defaults( $config ) {
	// Remove default color palette
	if ( isset( $config['schemes']['color']['items'] ) ) {
		$obsidian_colors = obsidian_get_theme_settings()['colors'];
		
		$config['schemes']['color']['items'] = array(
			'1' => $obsidian_colors['primary'] ?? '#2563eb',
			'2' => $obsidian_colors['secondary'] ?? '#64748b',
			'3' => $obsidian_colors['text'] ?? '#1f2937',
			'4' => $obsidian_colors['accent'] ?? '#f59e0b',
		);
	}
	
	return $config;
}

/**
 * Add Obsidian colors to Elementor
 */
function obsidian_add_elementor_colors() {
	$obsidian_colors = obsidian_get_theme_settings()['colors'];
	
	// Update Elementor's global colors
	$elementor_colors = array();
	foreach ( $obsidian_colors as $key => $value ) {
		$elementor_colors[] = array(
			'_id'   => $key,
			'title' => ucfirst( $key ),
			'color' => $value,
		);
	}
	
	update_option( 'elementor_scheme_color', $elementor_colors );
}

/**
 * WooCommerce compatibility
 */
function obsidian_woocommerce_compatibility() {
	if ( class_exists( 'WooCommerce' ) ) {
		add_theme_support( 'woocommerce' );
		add_theme_support( 'wc-product-gallery-zoom' );
		add_theme_support( 'wc-product-gallery-lightbox' );
		add_theme_support( 'wc-product-gallery-slider' );
		
		// Remove WooCommerce default styles
		add_filter( 'woocommerce_enqueue_styles', '__return_empty_array' );
		
		// Add custom WooCommerce styles
		add_action( 'wp_enqueue_scripts', 'obsidian_woocommerce_styles' );
	}
}
add_action( 'after_setup_theme', 'obsidian_woocommerce_compatibility' );

/**
 * Enqueue WooCommerce styles
 */
function obsidian_woocommerce_styles() {
	if ( class_exists( 'WooCommerce' ) ) {
		wp_enqueue_style(
			'obsidian-woocommerce',
			OBSIDIAN_ASSETS_URL . '/css/woocommerce.css',
			array( 'obsidian-style' ),
			OBSIDIAN_VERSION
		);
	}
}

/**
 * Contact Form 7 compatibility
 */
function obsidian_cf7_compatibility() {
	if ( class_exists( 'WPCF7' ) ) {
		// Add custom CF7 styles
		add_action( 'wp_enqueue_scripts', 'obsidian_cf7_styles' );
	}
}
add_action( 'after_setup_theme', 'obsidian_cf7_compatibility' );

/**
 * Enqueue Contact Form 7 styles
 */
function obsidian_cf7_styles() {
	if ( class_exists( 'WPCF7' ) ) {
		wp_enqueue_style(
			'obsidian-cf7',
			OBSIDIAN_ASSETS_URL . '/css/contact-form-7.css',
			array( 'obsidian-style' ),
			OBSIDIAN_VERSION
		);
	}
}

/**
 * Yoast SEO compatibility
 */
function obsidian_yoast_compatibility() {
	if ( defined( 'WPSEO_VERSION' ) ) {
		// Add breadcrumb support
		add_theme_support( 'yoast-seo-breadcrumbs' );
		
		// Filter breadcrumb output
		add_filter( 'wpseo_breadcrumb_output', 'obsidian_yoast_breadcrumb_wrapper' );
	}
}
add_action( 'after_setup_theme', 'obsidian_yoast_compatibility' );

/**
 * Wrap Yoast breadcrumbs
 */
function obsidian_yoast_breadcrumb_wrapper( $output ) {
	return '<nav class="obsidian-breadcrumbs" aria-label="' . __( 'Breadcrumb', 'obsidian' ) . '">' . $output . '</nav>';
}

/**
 * Jetpack compatibility
 */
function obsidian_jetpack_compatibility() {
	if ( class_exists( 'Jetpack' ) ) {
		// Add theme support for Infinite Scroll
		add_theme_support( 'infinite-scroll', array(
			'container' => 'main',
			'render'    => 'obsidian_infinite_scroll_render',
			'footer'    => 'page',
		) );
		
		// Add theme support for Responsive Videos
		add_theme_support( 'jetpack-responsive-videos' );
		
		// Add theme support for Content Options
		add_theme_support( 'jetpack-content-options', array(
			'post-details' => array(
				'stylesheet' => 'obsidian-style',
				'date'       => '.posted-on',
				'categories' => '.cat-links',
				'tags'       => '.tags-links',
				'author'     => '.byline',
				'comment'    => '.comments-link',
			),
		) );
	}
}
add_action( 'after_setup_theme', 'obsidian_jetpack_compatibility' );

/**
 * Infinite scroll render function
 */
function obsidian_infinite_scroll_render() {
	while ( have_posts() ) {
		the_post();
		get_template_part( 'template-parts/content', get_post_type() );
	}
}

/**
 * AMP compatibility
 */
function obsidian_amp_compatibility() {
	if ( function_exists( 'amp_is_request' ) ) {
		add_theme_support( 'amp', array(
			'paired' => true,
		) );
		
		// Add AMP-specific styles
		add_action( 'amp_post_template_css', 'obsidian_amp_styles' );
	}
}
add_action( 'after_setup_theme', 'obsidian_amp_compatibility' );

/**
 * Add AMP styles
 */
function obsidian_amp_styles() {
	$settings = obsidian_get_theme_settings();
	
	// Output CSS variables for AMP
	echo ':root {';
	foreach ( $settings['colors'] as $key => $value ) {
		echo '--obsidian-color-' . esc_attr( $key ) . ': ' . esc_attr( $value ) . ';';
	}
	echo '}';
	
	// Include AMP-specific styles
	$amp_css = file_get_contents( OBSIDIAN_THEME_DIR . '/assets/css/amp.css' );
	if ( $amp_css ) {
		echo $amp_css;
	}
}

/**
 * WPML compatibility
 */
function obsidian_wpml_compatibility() {
	if ( function_exists( 'icl_object_id' ) ) {
		// Add WPML support for theme options
		add_action( 'init', 'obsidian_wpml_register_strings' );
	}
}
add_action( 'after_setup_theme', 'obsidian_wpml_compatibility' );

/**
 * Register WPML strings
 */
function obsidian_wpml_register_strings() {
	if ( function_exists( 'icl_register_string' ) ) {
		// Register theme strings for translation
		icl_register_string( 'obsidian', 'Theme Name', 'Obsidian' );
		icl_register_string( 'obsidian', 'Theme Description', 'A sophisticated WordPress theme for modern websites.' );
	}
}

/**
 * Polylang compatibility
 */
function obsidian_polylang_compatibility() {
	if ( function_exists( 'pll_register_string' ) ) {
		add_action( 'init', 'obsidian_polylang_register_strings' );
	}
}
add_action( 'after_setup_theme', 'obsidian_polylang_compatibility' );

/**
 * Register Polylang strings
 */
function obsidian_polylang_register_strings() {
	if ( function_exists( 'pll_register_string' ) ) {
		pll_register_string( 'obsidian-theme-name', 'Obsidian', 'Obsidian Theme' );
		pll_register_string( 'obsidian-theme-desc', 'A sophisticated WordPress theme for modern websites.', 'Obsidian Theme' );
	}
}

/**
 * RTL language support
 */
function obsidian_rtl_support() {
	// Enqueue RTL stylesheet
	if ( is_rtl() ) {
		wp_enqueue_style(
			'obsidian-rtl',
			OBSIDIAN_ASSETS_URL . '/css/rtl.css',
			array( 'obsidian-style' ),
			OBSIDIAN_VERSION
		);
	}
}
add_action( 'wp_enqueue_scripts', 'obsidian_rtl_support' );

/**
 * Accessibility enhancements
 */
function obsidian_accessibility_enhancements() {
	// Add skip link
	add_action( 'wp_body_open', 'obsidian_skip_link' );
	
	// Add focus styles
	add_action( 'wp_head', 'obsidian_focus_styles' );
}
add_action( 'init', 'obsidian_accessibility_enhancements' );

/**
 * Add skip link
 */
function obsidian_skip_link() {
	echo '<a class="screen-reader-text" href="#main">' . __( 'Skip to content', 'obsidian' ) . '</a>';
}

/**
 * Add focus styles
 */
function obsidian_focus_styles() {
	echo '<style>
		.screen-reader-text {
			clip: rect(1px, 1px, 1px, 1px);
			position: absolute !important;
			height: 1px;
			width: 1px;
			overflow: hidden;
		}
		.screen-reader-text:focus {
			background-color: var(--obsidian-color-background);
			color: var(--obsidian-color-text);
			clip: auto !important;
			display: block;
			font-size: 1rem;
			font-weight: bold;
			height: auto;
			left: 5px;
			line-height: normal;
			padding: 15px 23px 14px;
			text-decoration: none;
			top: 5px;
			width: auto;
			z-index: 100000;
		}
	</style>';
}