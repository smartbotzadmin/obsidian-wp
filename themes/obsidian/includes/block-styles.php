<?php
/**
 * Obsidian Theme Block Styles
 *
 * @package Obsidian
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register block styles
 */
function obsidian_register_block_styles() {
	// Button block styles
	register_block_style( 'core/button', array(
		'name'  => 'obsidian-outline',
		'label' => __( 'Outline', 'obsidian' ),
	) );
	
	register_block_style( 'core/button', array(
		'name'  => 'obsidian-ghost',
		'label' => __( 'Ghost', 'obsidian' ),
	) );
	
	// Heading block styles
	register_block_style( 'core/heading', array(
		'name'  => 'obsidian-gradient',
		'label' => __( 'Gradient Text', 'obsidian' ),
	) );
	
	register_block_style( 'core/heading', array(
		'name'  => 'obsidian-underline',
		'label' => __( 'Underlined', 'obsidian' ),
	) );
	
	// Quote block styles
	register_block_style( 'core/quote', array(
		'name'  => 'obsidian-minimal',
		'label' => __( 'Minimal', 'obsidian' ),
	) );
	
	register_block_style( 'core/quote', array(
		'name'  => 'obsidian-bordered',
		'label' => __( 'Bordered', 'obsidian' ),
	) );
	
	// Group block styles
	register_block_style( 'core/group', array(
		'name'  => 'obsidian-card',
		'label' => __( 'Card', 'obsidian' ),
	) );
	
	register_block_style( 'core/group', array(
		'name'  => 'obsidian-shadow',
		'label' => __( 'Shadow', 'obsidian' ),
	) );
	
	// Cover block styles
	register_block_style( 'core/cover', array(
		'name'  => 'obsidian-gradient-overlay',
		'label' => __( 'Gradient Overlay', 'obsidian' ),
	) );
	
	// Image block styles
	register_block_style( 'core/image', array(
		'name'  => 'obsidian-rounded',
		'label' => __( 'Rounded', 'obsidian' ),
	) );
	
	register_block_style( 'core/image', array(
		'name'  => 'obsidian-shadow',
		'label' => __( 'Shadow', 'obsidian' ),
	) );
}
add_action( 'init', 'obsidian_register_block_styles' );

/**
 * Enqueue block editor styles
 */
function obsidian_enqueue_block_editor_assets() {
	wp_enqueue_style(
		'obsidian-block-editor-styles',
		OBSIDIAN_ASSETS_URL . '/css/block-editor.css',
		array(),
		OBSIDIAN_VERSION
	);
	
	wp_enqueue_script(
		'obsidian-block-editor-script',
		OBSIDIAN_ASSETS_URL . '/js/block-editor.js',
		array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post' ),
		OBSIDIAN_VERSION,
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'obsidian_enqueue_block_editor_assets' );

/**
 * Add custom block patterns
 */
function obsidian_register_block_patterns() {
	// Hero section pattern
	register_block_pattern( 'obsidian/hero-section', array(
		'title'       => __( 'Hero Section', 'obsidian' ),
		'description' => __( 'A hero section with heading, text, and button.', 'obsidian' ),
		'categories'  => array( 'obsidian-patterns' ),
		'content'     => '<!-- wp:cover {"url":"","id":0,"dimRatio":50,"overlayColor":"primary","minHeight":500,"contentPosition":"center center","isDark":false,"align":"full","className":"is-style-obsidian-gradient-overlay"} -->
<div class="wp-block-cover alignfull is-light is-style-obsidian-gradient-overlay" style="min-height:500px"><span aria-hidden="true" class="wp-block-cover__background has-primary-background-color has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:group {"layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-group"><!-- wp:heading {"textAlign":"center","level":1,"fontSize":"xx-large"} -->
<h1 class="wp-block-heading has-text-align-center has-xx-large-font-size">Welcome to Our Amazing Site</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Discover incredible features and beautiful design that will transform your online presence.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"accent","textColor":"background","className":"is-style-fill"} -->
<div class="wp-block-button is-style-fill"><a class="wp-block-button__link has-background-color has-accent-background-color has-text-color wp-element-button">Get Started</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div></div>
<!-- /wp:cover -->',
	) );
	
	// Feature grid pattern
	register_block_pattern( 'obsidian/feature-grid', array(
		'title'       => __( 'Feature Grid', 'obsidian' ),
		'description' => __( 'A three-column grid showcasing features.', 'obsidian' ),
		'categories'  => array( 'obsidian-patterns' ),
		'content'     => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"4rem","bottom":"4rem"}}},"backgroundColor":"background"} -->
<div class="wp-block-group alignfull has-background-background-color has-background" style="padding-top:4rem;padding-bottom:4rem"><!-- wp:heading {"textAlign":"center","level":2,"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size">Amazing Features</h2>
<!-- /wp:heading -->

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"className":"is-style-obsidian-card"} -->
<div class="wp-block-column is-style-obsidian-card"><!-- wp:heading {"textAlign":"center","level":3} -->
<h3 class="wp-block-heading has-text-align-center">Fast Performance</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Lightning-fast loading times and optimized performance for the best user experience.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"className":"is-style-obsidian-card"} -->
<div class="wp-block-column is-style-obsidian-card"><!-- wp:heading {"textAlign":"center","level":3} -->
<h3 class="wp-block-heading has-text-align-center">Beautiful Design</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Stunning visual design that captures attention and engages your audience.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"className":"is-style-obsidian-card"} -->
<div class="wp-block-column is-style-obsidian-card"><!-- wp:heading {"textAlign":"center","level":3} -->
<h3 class="wp-block-heading has-text-align-center">Easy to Use</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Intuitive interface and user-friendly features that anyone can master quickly.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->',
	) );
	
	// Call to action pattern
	register_block_pattern( 'obsidian/call-to-action', array(
		'title'       => __( 'Call to Action', 'obsidian' ),
		'description' => __( 'A centered call to action section.', 'obsidian' ),
		'categories'  => array( 'obsidian-patterns' ),
		'content'     => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"4rem","bottom":"4rem"}}},"backgroundColor":"primary","textColor":"background"} -->
<div class="wp-block-group alignfull has-background-color has-primary-background-color has-text-color has-background" style="padding-top:4rem;padding-bottom:4rem"><!-- wp:group {"layout":{"type":"constrained","contentSize":"600px"}} -->
<div class="wp-block-group"><!-- wp:heading {"textAlign":"center","level":2,"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size">Ready to Get Started?</h2>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size">Join thousands of satisfied customers who have transformed their business with our solution.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"}} -->
<div class="wp-block-buttons"><!-- wp:button {"backgroundColor":"accent","textColor":"text","className":"is-style-fill"} -->
<div class="wp-block-button is-style-fill"><a class="wp-block-button__link has-text-color has-accent-background-color has-text-color wp-element-button">Start Your Journey</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->',
	) );
	
	// Testimonial pattern
	register_block_pattern( 'obsidian/testimonial', array(
		'title'       => __( 'Testimonial', 'obsidian' ),
		'description' => __( 'A testimonial with quote and author.', 'obsidian' ),
		'categories'  => array( 'obsidian-patterns' ),
		'content'     => '<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"3rem","bottom":"3rem"}}},"className":"is-style-obsidian-card"} -->
<div class="wp-block-group alignwide is-style-obsidian-card" style="padding-top:3rem;padding-bottom:3rem"><!-- wp:quote {"align":"center","className":"is-style-obsidian-minimal"} -->
<blockquote class="wp-block-quote has-text-align-center is-style-obsidian-minimal"><p>"This theme has completely transformed our website. The design is beautiful and the performance is outstanding."</p><cite>Sarah Johnson, CEO</cite></blockquote>
<!-- /wp:quote --></div>
<!-- /wp:group -->',
	) );
	
	// Stats section pattern
	register_block_pattern( 'obsidian/stats-section', array(
		'title'       => __( 'Stats Section', 'obsidian' ),
		'description' => __( 'A section displaying key statistics.', 'obsidian' ),
		'categories'  => array( 'obsidian-patterns' ),
		'content'     => '<!-- wp:group {"align":"full","style":{"spacing":{"padding":{"top":"4rem","bottom":"4rem"}}},"backgroundColor":"secondary","textColor":"background"} -->
<div class="wp-block-group alignfull has-background-color has-secondary-background-color has-text-color has-background" style="padding-top:4rem;padding-bottom:4rem"><!-- wp:heading {"textAlign":"center","level":2,"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size">Our Impact</h2>
<!-- /wp:heading -->

<!-- wp:columns {"align":"wide"} -->
<div class="wp-block-columns alignwide"><!-- wp:column {"textAlign":"center"} -->
<div class="wp-block-column has-text-align-center"><!-- wp:heading {"textAlign":"center","level":3,"fontSize":"xx-large","className":"is-style-obsidian-gradient"} -->
<h3 class="wp-block-heading has-text-align-center has-xx-large-font-size is-style-obsidian-gradient">10K+</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Happy Customers</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"textAlign":"center"} -->
<div class="wp-block-column has-text-align-center"><!-- wp:heading {"textAlign":"center","level":3,"fontSize":"xx-large","className":"is-style-obsidian-gradient"} -->
<h3 class="wp-block-heading has-text-align-center has-xx-large-font-size is-style-obsidian-gradient">99%</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Satisfaction Rate</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"textAlign":"center"} -->
<div class="wp-block-column has-text-align-center"><!-- wp:heading {"textAlign":"center","level":3,"fontSize":"xx-large","className":"is-style-obsidian-gradient"} -->
<h3 class="wp-block-heading has-text-align-center has-xx-large-font-size is-style-obsidian-gradient">24/7</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Support Available</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->',
	) );
	
	// Team section pattern
	register_block_pattern( 'obsidian/team-section', array(
		'title'       => __( 'Team Section', 'obsidian' ),
		'description' => __( 'A section showcasing team members.', 'obsidian' ),
		'categories'  => array( 'obsidian-patterns' ),
		'content'     => '<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"4rem","bottom":"4rem"}}}} -->
<div class="wp-block-group alignwide" style="padding-top:4rem;padding-bottom:4rem"><!-- wp:heading {"textAlign":"center","level":2,"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size">Meet Our Team</h2>
<!-- /wp:heading -->

<!-- wp:columns -->
<div class="wp-block-columns"><!-- wp:column {"className":"is-style-obsidian-card"} -->
<div class="wp-block-column is-style-obsidian-card"><!-- wp:image {"align":"center","width":120,"height":120,"sizeSlug":"thumbnail","className":"is-style-rounded"} -->
<figure class="wp-block-image aligncenter size-thumbnail is-resized is-style-rounded"><img src="" alt="" width="120" height="120"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"textAlign":"center","level":3} -->
<h3 class="wp-block-heading has-text-align-center">John Doe</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","textColor":"muted"} -->
<p class="has-text-align-center has-muted-color has-text-color">CEO & Founder</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Leading the company with vision and passion for innovation.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"className":"is-style-obsidian-card"} -->
<div class="wp-block-column is-style-obsidian-card"><!-- wp:image {"align":"center","width":120,"height":120,"sizeSlug":"thumbnail","className":"is-style-rounded"} -->
<figure class="wp-block-image aligncenter size-thumbnail is-resized is-style-rounded"><img src="" alt="" width="120" height="120"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"textAlign":"center","level":3} -->
<h3 class="wp-block-heading has-text-align-center">Jane Smith</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","textColor":"muted"} -->
<p class="has-text-align-center has-muted-color has-text-color">CTO</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Driving technical excellence and innovative solutions.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column -->

<!-- wp:column {"className":"is-style-obsidian-card"} -->
<div class="wp-block-column is-style-obsidian-card"><!-- wp:image {"align":"center","width":120,"height":120,"sizeSlug":"thumbnail","className":"is-style-rounded"} -->
<figure class="wp-block-image aligncenter size-thumbnail is-resized is-style-rounded"><img src="" alt="" width="120" height="120"/></figure>
<!-- /wp:image -->

<!-- wp:heading {"textAlign":"center","level":3} -->
<h3 class="wp-block-heading has-text-align-center">Mike Johnson</h3>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","textColor":"muted"} -->
<p class="has-text-align-center has-muted-color has-text-color">Lead Designer</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph {"align":"center"} -->
<p class="has-text-align-center">Creating beautiful and user-friendly experiences.</p>
<!-- /wp:paragraph --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->',
	) );
	
	// FAQ section pattern
	register_block_pattern( 'obsidian/faq-section', array(
		'title'       => __( 'FAQ Section', 'obsidian' ),
		'description' => __( 'A frequently asked questions section.', 'obsidian' ),
		'categories'  => array( 'obsidian-patterns' ),
		'content'     => '<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"4rem","bottom":"4rem"}}}} -->
<div class="wp-block-group alignwide" style="padding-top:4rem;padding-bottom:4rem"><!-- wp:heading {"textAlign":"center","level":2,"fontSize":"x-large"} -->
<h2 class="wp-block-heading has-text-align-center has-x-large-font-size">Frequently Asked Questions</h2>
<!-- /wp:heading -->

<!-- wp:group {"layout":{"type":"constrained","contentSize":"800px"}} -->
<div class="wp-block-group"><!-- wp:details {"className":"is-style-obsidian-card"} -->
<details class="wp-block-details is-style-obsidian-card"><summary>What makes this theme special?</summary><!-- wp:paragraph -->
<p>Our theme combines beautiful design with powerful functionality, offering extensive customization options and excellent performance optimization.</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-obsidian-card"} -->
<details class="wp-block-details is-style-obsidian-card"><summary>Is it mobile-friendly?</summary><!-- wp:paragraph -->
<p>Yes, the theme is fully responsive and optimized for all devices, ensuring your site looks great on desktop, tablet, and mobile.</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details -->

<!-- wp:details {"className":"is-style-obsidian-card"} -->
<details class="wp-block-details is-style-obsidian-card"><summary>Do you provide support?</summary><!-- wp:paragraph -->
<p>We offer comprehensive support including documentation, tutorials, and direct assistance to help you get the most out of your theme.</p>
<!-- /wp:paragraph --></details>
<!-- /wp:details --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->',
	) );
}
add_action( 'init', 'obsidian_register_block_patterns' );

/**
 * Register block pattern category
 */
function obsidian_register_block_pattern_category() {
	register_block_pattern_category( 'obsidian-patterns', array(
		'label' => __( 'Obsidian Patterns', 'obsidian' ),
	) );
}
add_action( 'init', 'obsidian_register_block_pattern_category' );

/**
 * Add block supports
 */
function obsidian_add_block_supports() {
	// Add custom spacing support to core blocks
	add_theme_support( 'custom-spacing' );
	
	// Add custom line height support
	add_theme_support( 'custom-line-height' );
	
	// Add custom units support
	add_theme_support( 'custom-units', array( 'px', 'em', 'rem', '%', 'vh', 'vw' ) );
	
	// Add link color support
	add_theme_support( 'link-color' );
	
	// Add border support
	add_theme_support( 'border' );
}
add_action( 'after_setup_theme', 'obsidian_add_block_supports' );

/**
 * Filter block categories
 */
function obsidian_block_categories( $categories ) {
	return array_merge(
		array(
			array(
				'slug'  => 'obsidian',
				'title' => __( 'Obsidian Blocks', 'obsidian' ),
				'icon'  => 'admin-customizer',
			),
		),
		$categories
	);
}
add_filter( 'block_categories_all', 'obsidian_block_categories' );

/**
 * Add custom block styles to editor
 */
function obsidian_add_editor_styles() {
	// Add dynamic CSS variables to editor
	$settings = obsidian_get_theme_settings();
	
	$custom_css = ':root {';
	
	// Add color variables
	if ( isset( $settings['colors'] ) ) {
		foreach ( $settings['colors'] as $key => $value ) {
			$custom_css .= '--obsidian-color-' . esc_attr( $key ) . ': ' . esc_attr( $value ) . ';';
		}
	}
	
	// Add typography variables
	if ( isset( $settings['typography'] ) ) {
		foreach ( $settings['typography'] as $key => $value ) {
			$custom_css .= '--obsidian-font-' . esc_attr( $key ) . ': ' . esc_attr( $value ) . ';';
		}
	}
	
	// Add layout variables
	if ( isset( $settings['layout'] ) ) {
		foreach ( $settings['layout'] as $key => $value ) {
			$custom_css .= '--obsidian-layout-' . esc_attr( $key ) . ': ' . esc_attr( $value ) . ';';
		}
	}
	
	$custom_css .= '}';
	
	wp_add_inline_style( 'wp-edit-blocks', $custom_css );
}
add_action( 'enqueue_block_editor_assets', 'obsidian_add_editor_styles' );