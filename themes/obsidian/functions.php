<?php
/**
 * Theme functions and definitions
 *
 * @package Obsidian
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

define( 'HELLO_ELEMENTOR_VERSION', '1.2.0' );

if ( ! function_exists( 'hello_elementor_setup' ) ) {
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 */
	function hello_elementor_setup() {
		// Make theme available for translation.
		load_theme_textdomain( 'hello-elementor', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		// Let WordPress manage the document title.
		add_theme_support( 'title-tag' );

		// Enable support for Post Thumbnails on posts and pages.
		add_theme_support( 'post-thumbnails' );

		// Add support for responsive embedded content.
		add_theme_support( 'responsive-embeds' );

		// Add support for HTML5 markup.
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// Add support for custom logo.
		add_theme_support( 'custom-logo', array(
			'height'      => 100,
			'width'       => 350,
			'flex-height' => true,
			'flex-width'  => true,
		) );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		// Add support for Block Styles.
		add_theme_support( 'wp-block-styles' );

		// Add support for full and wide align images.
		add_theme_support( 'align-wide' );

		// Add support for editor styles.
		add_theme_support( 'editor-styles' );

		// Enqueue editor styles.
		add_editor_style( 'classic-editor.css' );

		// Add custom editor font sizes.
		add_theme_support( 'editor-font-sizes', array(
			array(
				'name'      => __( 'Small', 'hello-elementor' ),
				'shortName' => __( 'S', 'hello-elementor' ),
				'size'      => 13,
				'slug'      => 'small',
			),
			array(
				'name'      => __( 'Normal', 'hello-elementor' ),
				'shortName' => __( 'M', 'hello-elementor' ),
				'size'      => 16,
				'slug'      => 'normal',
			),
			array(
				'name'      => __( 'Large', 'hello-elementor' ),
				'shortName' => __( 'L', 'hello-elementor' ),
				'size'      => 36,
				'slug'      => 'large',
			),
			array(
				'name'      => __( 'Huge', 'hello-elementor' ),
				'shortName' => __( 'XL', 'hello-elementor' ),
				'size'      => 42,
				'slug'      => 'huge',
			),
		) );

		// Register navigation menus.
		register_nav_menus( array(
			'menu-1' => __( 'Primary', 'hello-elementor' ),
		) );

		// Add support for core custom background feature.
		add_theme_support( 'custom-background', apply_filters( 'hello_elementor_custom_background_args', array(
			'default-color' => 'ffffff',
			'default-image' => '',
		) ) );

		// Add support for custom header.
		add_theme_support( 'custom-header', apply_filters( 'hello_elementor_custom_header_args', array(
			'default-image'      => '',
			'default-text-color' => '000',
			'width'              => 1000,
			'height'             => 250,
			'flex-height'        => true,
			'wp-head-callback'   => 'hello_elementor_header_style',
		) ) );
	}
}
add_action( 'after_setup_theme', 'hello_elementor_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 */
function hello_elementor_content_width() {
	$GLOBALS['content_width'] = apply_filters( 'hello_elementor_content_width', 800 );
}
add_action( 'after_setup_theme', 'hello_elementor_content_width', 0 );

/**
 * Enqueue scripts and styles.
 */
function hello_elementor_scripts() {
	$min_suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

	wp_enqueue_style(
		'hello-elementor',
		get_template_directory_uri() . '/style' . $min_suffix . '.css',
		array(),
		HELLO_ELEMENTOR_VERSION
	);

	wp_enqueue_style(
		'hello-elementor-theme-style',
		get_template_directory_uri() . '/theme' . $min_suffix . '.css',
		array(),
		HELLO_ELEMENTOR_VERSION
	);

	// Enqueue Obsidian Page Builder
	if ( is_user_logged_in() && current_user_can( 'edit_posts' ) ) {
		wp_enqueue_style(
			'obsidian-builder',
			get_template_directory_uri() . '/assets/css/elementor-builder.css',
			array(),
			HELLO_ELEMENTOR_VERSION
		);

		wp_enqueue_script(
			'obsidian-builder',
			get_template_directory_uri() . '/assets/js/elementor-builder.js',
			array( 'jquery' ),
			HELLO_ELEMENTOR_VERSION,
			true
		);

		// Localize script for AJAX
		wp_localize_script( 'obsidian-builder', 'obsidian_ajax', array(
			'ajax_url' => admin_url( 'admin-ajax.php' ),
			'nonce'    => wp_create_nonce( 'obsidian_builder_nonce' ),
		) );
	}

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'hello_elementor_scripts' );

/**
 * Enqueue admin styles for SmartBotz dark theme
 */
function obsidian_admin_styles() {
	// Enqueue admin dark theme
	wp_enqueue_style(
		'obsidian-admin-dark-theme',
		get_template_directory_uri() . '/assets/css/admin-dark-theme.css',
		array(),
		HELLO_ELEMENTOR_VERSION
	);
	
	// Enqueue for site editor
	wp_enqueue_style(
		'obsidian-site-editor-dark',
		get_template_directory_uri() . '/assets/css/admin-dark-theme.css',
		array(),
		HELLO_ELEMENTOR_VERSION
	);
	
	// Enqueue block editor dark theme
	wp_enqueue_style(
		'obsidian-block-editor-dark',
		get_template_directory_uri() . '/assets/css/block-editor-dark.css',
		array(),
		HELLO_ELEMENTOR_VERSION
	);
}
add_action( 'admin_enqueue_scripts', 'obsidian_admin_styles' );
add_action( 'enqueue_block_editor_assets', 'obsidian_admin_styles' );

/**
 * Add SmartBotz theme to login page
 */
function obsidian_login_styles() {
	?>
	<style>
		body.login {
			background: #0a0a0a !important;
		}
		
		.login h1 a {
			background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSIjMDZiNmQ0Ii8+Cjwvc3ZnPgo=') !important;
			width: 84px !important;
			height: 84px !important;
			background-size: contain !important;
		}
		
		.login form {
			background: rgba(255, 255, 255, 0.05) !important;
			border: 1px solid rgba(6, 182, 212, 0.2) !important;
			border-radius: 12px !important;
			backdrop-filter: blur(10px) !important;
		}
		
		.login label {
			color: rgba(255, 255, 255, 0.9) !important;
		}
		
		.login input[type="text"],
		.login input[type="password"] {
			background: rgba(255, 255, 255, 0.1) !important;
			border: 1px solid rgba(255, 255, 255, 0.2) !important;
			color: white !important;
			border-radius: 6px !important;
		}
		
		.login input[type="text"]:focus,
		.login input[type="password"]:focus {
			border-color: #06b6d4 !important;
			box-shadow: 0 0 0 2px rgba(6, 182, 212, 0.2) !important;
		}
		
		.wp-core-ui .button-primary {
			background: linear-gradient(135deg, #06b6d4, #8b5cf6) !important;
			border: none !important;
			text-shadow: none !important;
			box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3) !important;
		}
		
		.wp-core-ui .button-primary:hover {
			background: linear-gradient(135deg, #0891b2, #7c3aed) !important;
			transform: translateY(-1px) !important;
		}
		
		.login #nav a,
		.login #backtoblog a {
			color: rgba(255, 255, 255, 0.7) !important;
		}
		
		.login #nav a:hover,
		.login #backtoblog a:hover {
			color: #06b6d4 !important;
		}
		
		.login .message {
			background: rgba(6, 182, 212, 0.1) !important;
			border-left: 4px solid #06b6d4 !important;
			color: white !important;
		}
	</style>
	<?php
}
add_action( 'login_enqueue_scripts', 'obsidian_login_styles' );

/**
 * Custom template tags for this theme.
 */

if ( ! function_exists( 'hello_elementor_page_title' ) ) {
	/**
	 * Check if page title is enabled.
	 *
	 * @param bool $echo
	 * @return bool|void
	 */
	function hello_elementor_page_title( $echo = true ) {
		if ( is_singular() ) {
			$page_title_selector = get_post_meta( get_the_ID(), '_elementor_page_title_display', true );

			if ( 'yes' === $page_title_selector ) {
				return true;
			}

			if ( 'no' === $page_title_selector ) {
				return false;
			}
		}

		$page_title_selector = get_theme_mod( 'hello_elementor_page_title_selector' );

		if ( 'no' === $page_title_selector ) {
			return false;
		}

		return true;
	}
}

/**
 * Wrapper function to deal with backwards compatibility.
 */
if ( ! function_exists( 'hello_elementor_body_open' ) ) {
	function hello_elementor_body_open() {
		if ( function_exists( 'wp_body_open' ) ) {
			wp_body_open();
		} else {
			do_action( 'wp_body_open' );
		}
	}
}

/**
 * Add custom CSS for the custom header image.
 */
if ( ! function_exists( 'hello_elementor_header_style' ) ) {
	function hello_elementor_header_style() {
		$header_text_color = get_header_textcolor();

		if ( ! has_header_image() && ( get_theme_support( 'custom-header', 'default-text-color' ) === $header_text_color ) ) {
			return;
		}

		$header_styles = array();

		if ( has_header_image() ) {
			$header_styles[] = 'background-image: url(' . get_header_image() . ');';
		}

		if ( get_theme_support( 'custom-header', 'default-text-color' ) !== $header_text_color ) {
			$header_styles[] = 'color: #' . esc_attr( $header_text_color ) . ';';
		}

		if ( ! empty( $header_styles ) ) {
			?>
			<style type="text/css">
				.site-title a,
				.site-description {
					<?php echo implode( '', $header_styles ); ?>
				}
			</style>
			<?php
		}
	}
}

/**
 * Register widget area.
 */
function hello_elementor_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Sidebar', 'hello-elementor' ),
		'id'            => 'sidebar-1',
		'description'   => __( 'Add widgets here to appear in your sidebar.', 'hello-elementor' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'hello_elementor_widgets_init' );

/**
 * Admin functions
 */
if ( is_admin() ) {
	require get_template_directory() . '/includes/admin-functions.php';
}

/**
 * Check if Elementor is installed and activated.
 */
if ( ! function_exists( 'hello_elementor_check_hide_title' ) ) {
	/**
	 * Check hide title.
	 *
	 * @param bool $val default value.
	 *
	 * @return bool
	 */
	function hello_elementor_check_hide_title( $val ) {
		if ( defined( 'ELEMENTOR_VERSION' ) ) {
			$current_doc = Elementor\Plugin::instance()->documents->get( get_the_ID() );
			if ( $current_doc && 'yes' === $current_doc->get_settings( 'hide_title' ) ) {
				$val = false;
			}
		}
		return $val;
	}
}
add_filter( 'hello_elementor_page_title', 'hello_elementor_check_hide_title' );

/**
 * BC:
 * In v2.7.0 the theme removed the `hello_elementor_body_open()` from `header.php` replacing it with `wp_body_open()`.
 * The following code prevents fatal errors in child themes that still use this function.
 */
if ( ! function_exists( 'hello_elementor_body_open' ) ) {
	function hello_elementor_body_open() {
		wp_body_open();
	}
}
/**
 * Obsidian Page Builder AJAX Handlers
 */
function obsidian_save_page_data() {
	// Verify nonce
	if ( ! wp_verify_nonce( $_POST['nonce'], 'obsidian_builder_nonce' ) ) {
		wp_die( 'Security check failed' );
	}

	// Check user permissions
	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_die( 'Insufficient permissions' );
	}

	$page_id = intval( $_POST['page_id'] );
	$page_data = sanitize_textarea_field( $_POST['page_data'] );

	// Save page data as post meta
	update_post_meta( $page_id, '_obsidian_page_data', $page_data );

	wp_send_json_success( array( 'message' => 'Page saved successfully' ) );
}
add_action( 'wp_ajax_obsidian_save_page', 'obsidian_save_page_data' );

function obsidian_load_page_data() {
	// Verify nonce
	if ( ! wp_verify_nonce( $_POST['nonce'], 'obsidian_builder_nonce' ) ) {
		wp_die( 'Security check failed' );
	}

	$page_id = intval( $_POST['page_id'] );
	$page_data = get_post_meta( $page_id, '_obsidian_page_data', true );

	wp_send_json_success( array( 'data' => $page_data ) );
}
add_action( 'wp_ajax_obsidian_load_page', 'obsidian_load_page_data' );

/**
 * Beautiful Pre-designed Templates
 */
function obsidian_get_templates() {
	return array(
		'smartbotz-hero' => array(
			'name' => 'SmartBotz Hero',
			'html' => '
				<div class="smartbotz-hero-template">
					<div class="smartbotz-hero" style="min-height: 100vh; position: relative; display: flex; align-items: center; background: #0a0a0a; overflow: hidden;">
						<div class="smartbotz-container" style="max-width: 1200px; margin: 0 auto; padding: 0 2rem; width: 100%; position: relative; z-index: 2;">
							<div class="smartbotz-hero-content" style="text-align: center; max-width: 800px; margin: 0 auto;">
								<div class="smartbotz-badge" style="display: inline-block; background: rgba(6, 182, 212, 0.1); color: #06b6d4; padding: 0.5rem 1rem; border-radius: 2rem; font-size: 0.875rem; font-weight: 500; margin-bottom: 2rem; border: 1px solid rgba(6, 182, 212, 0.2);" contenteditable="true">
									Finally, AI that understands design
								</div>
								<h1 class="smartbotz-main-heading" style="font-size: 4rem; font-weight: 700; line-height: 1.1; margin-bottom: 1.5rem; color: white;" contenteditable="true">
									Build beautiful<br>websites in minutes,<br><span style="color: rgba(255, 255, 255, 0.6); filter: blur(0.5px);">not months</span>
								</h1>
								<p class="smartbotz-subtitle" style="font-size: 1.125rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 3rem; line-height: 1.6;" contenteditable="true">
									From idea to production-ready app in minutes. No design skills required.
								</p>
								<div class="smartbotz-cta">
									<a href="#" class="smartbotz-try-button" style="display: inline-block; background: linear-gradient(135deg, #06b6d4, #8b5cf6); color: white; padding: 1rem 2.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; font-size: 1rem; letter-spacing: 0.025em; transition: all 0.3s ease; box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);" contenteditable="true">TRY IT FREE</a>
								</div>
							</div>
						</div>
						<div class="smartbotz-bg-pattern" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%); background-size: 100% 100%; pointer-events: none;"></div>
					</div>
				</div>
			'
		),
		'smartbotz-features' => array(
			'name' => 'SmartBotz Features',
			'html' => '
				<div class="smartbotz-features-template">
					<div class="smartbotz-features-section" style="padding: 100px 0; background: #111111;">
						<div class="smartbotz-container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
							<div class="smartbotz-section-header" style="text-align: center; margin-bottom: 4rem;">
								<h2 style="font-size: 3rem; margin-bottom: 1rem; color: white; font-weight: 700;" contenteditable="true">Powerful Features</h2>
								<p style="font-size: 1.25rem; color: rgba(255, 255, 255, 0.7); max-width: 600px; margin: 0 auto;" contenteditable="true">Everything you need to create professional websites with AI-powered design.</p>
							</div>
							<div class="smartbotz-features-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 3rem;">
								<div class="smartbotz-feature-card" style="text-align: center; padding: 3rem 2rem; background: rgba(255, 255, 255, 0.05); border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease;">
									<div class="smartbotz-feature-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #06b6d4, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; font-size: 2rem; color: white;">🤖</div>
									<h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: white; font-weight: 600;" contenteditable="true">AI-Powered Design</h3>
									<p style="color: rgba(255, 255, 255, 0.7); line-height: 1.6; font-size: 1rem;" contenteditable="true">Let AI understand your vision and create stunning designs automatically. No design skills required.</p>
								</div>
								<div class="smartbotz-feature-card" style="text-align: center; padding: 3rem 2rem; background: rgba(255, 255, 255, 0.05); border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease;">
									<div class="smartbotz-feature-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #8b5cf6, #06b6d4); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; font-size: 2rem; color: white;">⚡</div>
									<h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: white; font-weight: 600;" contenteditable="true">Lightning Fast</h3>
									<p style="color: rgba(255, 255, 255, 0.7); line-height: 1.6; font-size: 1rem;" contenteditable="true">Build and deploy websites in minutes, not months. From concept to production instantly.</p>
								</div>
								<div class="smartbotz-feature-card" style="text-align: center; padding: 3rem 2rem; background: rgba(255, 255, 255, 0.05); border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease;">
									<div class="smartbotz-feature-icon" style="width: 80px; height: 80px; background: linear-gradient(135deg, #06b6d4, #8b5cf6); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; font-size: 2rem; color: white;">📱</div>
									<h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: white; font-weight: 600;" contenteditable="true">Responsive Design</h3>
									<p style="color: rgba(255, 255, 255, 0.7); line-height: 1.6; font-size: 1rem;" contenteditable="true">Perfect display on all devices with automatically optimized responsive layouts.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			'
		),
		'testimonials-modern' => array(
			'name' => 'Modern Testimonials',
			'html' => '
				<div class="obsidian-template testimonials-modern">
					<div class="testimonials-section" style="padding: 100px 0; background: #1a1a2e; color: white; position: relative;">
						<div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
							<div class="section-header" style="text-align: center; margin-bottom: 4rem;">
								<h2 style="font-size: 3rem; margin-bottom: 1rem; font-weight: 700;" contenteditable="true">What Our Clients Say</h2>
								<p style="font-size: 1.25rem; opacity: 0.8; max-width: 600px; margin: 0 auto;" contenteditable="true">Join thousands of satisfied customers who have transformed their business with our platform.</p>
							</div>
							<div class="testimonials-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 2rem;">
								<div class="testimonial-card" style="background: rgba(255,255,255,0.1); padding: 2.5rem; border-radius: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);">
									<div class="stars" style="color: #ffd700; font-size: 1.2rem; margin-bottom: 1rem;">★★★★★</div>
									<blockquote style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; font-style: italic;" contenteditable="true">"This platform completely transformed our online presence. The results exceeded our expectations and our revenue increased by 300%."</blockquote>
									<div class="testimonial-author" style="display: flex; align-items: center; gap: 1rem;">
										<img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" alt="Sarah Johnson">
										<div>
											<div style="font-weight: 600; margin-bottom: 0.25rem;" contenteditable="true">Sarah Johnson</div>
											<div style="opacity: 0.8; font-size: 0.9rem;" contenteditable="true">CEO, TechCorp</div>
										</div>
									</div>
								</div>
								<div class="testimonial-card" style="background: rgba(255,255,255,0.1); padding: 2.5rem; border-radius: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);">
									<div class="stars" style="color: #ffd700; font-size: 1.2rem; margin-bottom: 1rem;">★★★★★</div>
									<blockquote style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; font-style: italic;" contenteditable="true">"Amazing support team and incredible features. We launched our website in just 2 days and it looks absolutely professional."</blockquote>
									<div class="testimonial-author" style="display: flex; align-items: center; gap: 1rem;">
										<img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" alt="Michael Chen">
										<div>
											<div style="font-weight: 600; margin-bottom: 0.25rem;" contenteditable="true">Michael Chen</div>
											<div style="opacity: 0.8; font-size: 0.9rem;" contenteditable="true">Founder, StartupXYZ</div>
										</div>
									</div>
								</div>
								<div class="testimonial-card" style="background: rgba(255,255,255,0.1); padding: 2.5rem; border-radius: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);">
									<div class="stars" style="color: #ffd700; font-size: 1.2rem; margin-bottom: 1rem;">★★★★★</div>
									<blockquote style="font-size: 1.1rem; line-height: 1.6; margin-bottom: 2rem; font-style: italic;" contenteditable="true">"The drag-and-drop builder is intuitive and powerful. I created a stunning website without any coding knowledge."</blockquote>
									<div class="testimonial-author" style="display: flex; align-items: center; gap: 1rem;">
										<img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover;" alt="Emma Rodriguez">
										<div>
											<div style="font-weight: 600; margin-bottom: 0.25rem;" contenteditable="true">Emma Rodriguez</div>
											<div style="opacity: 0.8; font-size: 0.9rem;" contenteditable="true">Designer, Creative Studio</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			'
		),
		'cta-premium' => array(
			'name' => 'Premium CTA',
			'html' => '
				<div class="obsidian-template cta-premium">
					<div class="cta-section" style="padding: 100px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; position: relative; overflow: hidden;">
						<div class="container" style="position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 0 20px;">
							<h2 style="font-size: 3.5rem; margin-bottom: 1.5rem; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);" contenteditable="true">Ready to Get Started?</h2>
							<p style="font-size: 1.5rem; margin-bottom: 3rem; opacity: 0.95; max-width: 700px; margin-left: auto; margin-right: auto;" contenteditable="true">Join over 50,000 satisfied customers who have transformed their business with our platform. Start your free trial today!</p>
							<div class="cta-buttons" style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2rem;">
								<a href="#" class="obsidian-btn cta-primary" style="background: #ff6b6b; color: white; padding: 20px 40px; border-radius: 50px; text-decoration: none; display: inline-block; font-weight: 600; font-size: 1.2rem; box-shadow: 0 10px 30px rgba(255, 107, 107, 0.4); transition: all 0.3s ease;" contenteditable="true">Start Free Trial</a>
								<a href="#" class="obsidian-btn cta-secondary" style="background: rgba(255,255,255,0.2); color: white; padding: 20px 40px; border-radius: 50px; text-decoration: none; display: inline-block; font-weight: 600; font-size: 1.2rem; border: 2px solid rgba(255,255,255,0.3); backdrop-filter: blur(10px); transition: all 0.3s ease;" contenteditable="true">Learn More</a>
							</div>
							<div class="cta-features" style="display: flex; justify-content: center; gap: 2rem; flex-wrap: wrap; font-size: 0.95rem; opacity: 0.9;">
								<div style="display: flex; align-items: center; gap: 0.5rem;">
									<span style="color: #4ade80;">✓</span>
									<span contenteditable="true">No Credit Card Required</span>
								</div>
								<div style="display: flex; align-items: center; gap: 0.5rem;">
									<span style="color: #4ade80;">✓</span>
									<span contenteditable="true">14-Day Free Trial</span>
								</div>
								<div style="display: flex; align-items: center; gap: 0.5rem;">
									<span style="color: #4ade80;">✓</span>
									<span contenteditable="true">Cancel Anytime</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			'
		)
	);
}

function obsidian_get_template_ajax() {
	// Verify nonce
	if ( ! wp_verify_nonce( $_POST['nonce'], 'obsidian_builder_nonce' ) ) {
		wp_die( 'Security check failed' );
	}

	$template_id = sanitize_text_field( $_POST['template_id'] );
	$templates = obsidian_get_templates();

	if ( isset( $templates[ $template_id ] ) ) {
		wp_send_json_success( $templates[ $template_id ] );
	} else {
		wp_send_json_error( 'Template not found' );
	}
}
add_action( 'wp_ajax_obsidian_get_template', 'obsidian_get_template_ajax' );