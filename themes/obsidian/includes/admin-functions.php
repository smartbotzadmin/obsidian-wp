<?php
/**
 * Admin functions
 *
 * @package Obsidian
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Admin notice for Hello Elementor Theme
 */
function hello_elementor_admin_notice() {
	if ( ! defined( 'ELEMENTOR_VERSION' ) ) {
		$screen = get_current_screen();
		if ( isset( $screen->parent_file ) && 'themes.php' === $screen->parent_file && 'themes' === $screen->id ) {
			$plugin_url = self_admin_url( 'plugin-install.php?s=elementor&tab=search&type=term' );
			$message = sprintf(
				/* translators: 1: Theme name, 2: Elementor */
				esc_html__( '%1$s works best with %2$s', 'hello-elementor' ),
				'<strong>' . esc_html__( 'Hello Elementor', 'hello-elementor' ) . '</strong>',
				'<strong><a href="' . $plugin_url . '">' . esc_html__( 'Elementor', 'hello-elementor' ) . '</a></strong>'
			);
			printf( '<div class="notice notice-info is-dismissible"><p>%1$s</p></div>', $message );
		}
	}
}
add_action( 'admin_notices', 'hello_elementor_admin_notice' );

/**
 * Register customizer options
 */
function hello_elementor_customize_register( $wp_customize ) {
	$wp_customize->add_section( 'hello_elementor_theme_options', array(
		'title'    => __( 'Theme Options', 'hello-elementor' ),
		'priority' => 30,
	) );

	$wp_customize->add_setting( 'hello_elementor_page_title_selector', array(
		'default'           => 'yes',
		'sanitize_callback' => 'sanitize_text_field',
	) );

	$wp_customize->add_control( 'hello_elementor_page_title_selector', array(
		'label'   => __( 'Page Title', 'hello-elementor' ),
		'section' => 'hello_elementor_theme_options',
		'type'    => 'select',
		'choices' => array(
			'yes' => __( 'Show', 'hello-elementor' ),
			'no'  => __( 'Hide', 'hello-elementor' ),
		),
	) );

	$wp_customize->add_setting( 'display_title_and_tagline', array(
		'default'           => true,
		'sanitize_callback' => 'wp_validate_boolean',
	) );

	$wp_customize->add_control( 'display_title_and_tagline', array(
		'label'   => __( 'Display Site Title & Tagline', 'hello-elementor' ),
		'section' => 'title_tagline',
		'type'    => 'checkbox',
	) );
}
add_action( 'customize_register', 'hello_elementor_customize_register' );

/**
 * Add theme support for Elementor features
 */
function hello_elementor_register_elementor_locations( $elementor_theme_manager ) {
	$elementor_theme_manager->register_location( 'header' );
	$elementor_theme_manager->register_location( 'footer' );
	$elementor_theme_manager->register_location( 'single' );
	$elementor_theme_manager->register_location( 'archive' );
}
add_action( 'elementor/theme/register_locations', 'hello_elementor_register_elementor_locations' );

/**
 * Add custom CSS for admin
 */
function hello_elementor_admin_css() {
	?>
	<style>
		.hello-elementor-notice {
			background: #fff;
			border-left: 4px solid #007cba;
			padding: 12px;
			margin: 15px 0;
		}
		.hello-elementor-notice h3 {
			margin-top: 0;
		}
	</style>
	<?php
}
add_action( 'admin_head', 'hello_elementor_admin_css' );