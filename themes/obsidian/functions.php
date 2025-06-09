<?php
/**
 * Obsidian Theme functions and definitions
 *
 * @package Obsidian
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Theme constants
define( 'OBSIDIAN_VERSION', '1.1.0' );
define( 'OBSIDIAN_THEME_DIR', get_template_directory() );
define( 'OBSIDIAN_THEME_URL', get_template_directory_uri() );
define( 'OBSIDIAN_ASSETS_URL', OBSIDIAN_THEME_URL . '/assets' );

/**
 * Obsidian Theme Setup
 */
function obsidian_theme_setup() {
	// Add theme support for various features
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo' );
	add_theme_support( 'custom-header' );
	add_theme_support( 'custom-background' );
	add_theme_support( 'html5', array(
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script'
	) );
	
	// Add support for block editor features
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'align-wide' );
	add_theme_support( 'editor-styles' );
	add_theme_support( 'responsive-embeds' );
	
	// Add editor stylesheet
	add_editor_style( 'assets/css/editor-style.css' );
	
	// Register navigation menus
	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'obsidian' ),
		'footer'  => __( 'Footer Menu', 'obsidian' ),
	) );
	
	// Set content width
	if ( ! isset( $content_width ) ) {
		$content_width = 1200;
	}
}
add_action( 'after_setup_theme', 'obsidian_theme_setup' );

/**
 * Enqueue theme styles and scripts
 */
function obsidian_enqueue_assets() {
	// Main theme stylesheet (WordPress default)
	wp_enqueue_style(
		'obsidian-style',
		get_stylesheet_uri(),
		array(),
		OBSIDIAN_VERSION
	);
	
	// Main theme styles with WordPress integration
	wp_enqueue_style(
		'obsidian-main-style',
		get_template_directory_uri() . '/style-main.css',
		array( 'obsidian-style' ),
		OBSIDIAN_VERSION
	);
	
	// Dynamic CSS variables
	wp_enqueue_style(
		'obsidian-dynamic-css',
		OBSIDIAN_ASSETS_URL . '/css/dynamic.css',
		array( 'obsidian-main-style' ),
		OBSIDIAN_VERSION
	);
	
	// Theme JavaScript
	wp_enqueue_script(
		'obsidian-script',
		OBSIDIAN_ASSETS_URL . '/js/theme.js',
		array(),
		OBSIDIAN_VERSION,
		true
	);
	
	// Localize script for AJAX
	wp_localize_script( 'obsidian-script', 'obsidian_ajax', array(
		'ajax_url' => admin_url( 'admin-ajax.php' ),
		'nonce'    => wp_create_nonce( 'obsidian_nonce' ),
		'rest_url' => rest_url( 'obsidian/v1/' ),
	) );
}
add_action( 'wp_enqueue_scripts', 'obsidian_enqueue_assets' );

/**
 * Add dynamic CSS variables to head
 */
function obsidian_add_css_variables() {
	$settings = obsidian_get_theme_settings();
	
	echo '<style id="obsidian-css-variables">';
	echo ':root {';
	
	// Color variables with validation
	if ( isset( $settings['colors'] ) && is_array( $settings['colors'] ) ) {
		foreach ( $settings['colors'] as $key => $value ) {
			// Validate color value
			if ( ! empty( $value ) && ( strpos( $value, '#' ) === 0 || strpos( $value, 'rgb' ) === 0 || strpos( $value, 'hsl' ) === 0 ) ) {
				echo '--obsidian-color-' . esc_attr( $key ) . ': ' . esc_attr( $value ) . ';';
			}
		}
	}
	
	// Typography variables with validation
	if ( isset( $settings['typography'] ) && is_array( $settings['typography'] ) ) {
		foreach ( $settings['typography'] as $key => $value ) {
			if ( ! empty( $value ) ) {
				echo '--obsidian-font-' . esc_attr( $key ) . ': ' . esc_attr( $value ) . ';';
			}
		}
	}
	
	// Layout variables with validation
	if ( isset( $settings['layout'] ) && is_array( $settings['layout'] ) ) {
		foreach ( $settings['layout'] as $key => $value ) {
			if ( ! empty( $value ) ) {
				echo '--obsidian-layout-' . esc_attr( $key ) . ': ' . esc_attr( $value ) . ';';
			}
		}
	}
	
	echo '}';
	
	// Add responsive font scaling
	echo '@media (max-width: 768px) {';
	echo ':root {';
	echo '--obsidian-font-base-size: 14px;';
	echo '--obsidian-layout-gutter: 1rem;';
	echo '}';
	echo '}';
	
	echo '</style>';
}
add_action( 'wp_head', 'obsidian_add_css_variables' );

/**
 * Register widget areas
 */
function obsidian_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Primary Sidebar', 'obsidian' ),
		'id'            => 'sidebar-primary',
		'description'   => __( 'Add widgets here to appear in your sidebar.', 'obsidian' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h3 class="widget-title">',
		'after_title'   => '</h3>',
	) );
	
	register_sidebar( array(
		'name'          => __( 'Footer Widgets', 'obsidian' ),
		'id'            => 'sidebar-footer',
		'description'   => __( 'Add widgets here to appear in your footer.', 'obsidian' ),
		'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
		'after_widget'  => '</div>',
		'before_title'  => '<h4 class="footer-widget-title">',
		'after_title'   => '</h4>',
	) );
}
add_action( 'widgets_init', 'obsidian_widgets_init' );

/**
 * Get theme settings with defaults
 */
function obsidian_get_theme_settings() {
	$defaults = array(
		'colors' => array(
			'primary'    => '#2563eb',
			'secondary'  => '#64748b',
			'accent'     => '#f59e0b',
			'background' => '#ffffff',
			'text'       => '#1f2937',
			'muted'      => '#6b7280',
		),
		'typography' => array(
			'primary-family'   => 'system-ui, -apple-system, sans-serif',
			'secondary-family' => 'Georgia, serif',
			'base-size'        => '16px',
			'scale-ratio'      => '1.25',
			'line-height'      => '1.6',
		),
		'layout' => array(
			'container-width' => '1200px',
			'content-width'   => '800px',
			'sidebar-width'   => '300px',
			'gutter'          => '2rem',
		),
	);
	
	$settings = get_option( 'obsidian_theme_settings', $defaults );
	return wp_parse_args( $settings, $defaults );
}

/**
 * Update theme settings
 */
function obsidian_update_theme_settings( $new_settings ) {
	$current_settings = obsidian_get_theme_settings();
	$updated_settings = wp_parse_args( $new_settings, $current_settings );
	
	return update_option( 'obsidian_theme_settings', $updated_settings );
}

// Include REST API endpoints
require_once OBSIDIAN_THEME_DIR . '/includes/rest-api.php';

// Include customizer settings
require_once OBSIDIAN_THEME_DIR . '/includes/customizer.php';

// Include block styles
require_once OBSIDIAN_THEME_DIR . '/includes/block-styles.php';

// Include theme compatibility
require_once OBSIDIAN_THEME_DIR . '/includes/compatibility.php';

/**
 * Default menu fallback
 */
function obsidian_default_menu() {
	echo '<ul class="obsidian-nav-menu">';
	echo '<li><a href="' . esc_url( home_url( '/' ) ) . '">' . __( 'Home', 'obsidian' ) . '</a></li>';
	if ( current_user_can( 'manage_options' ) ) {
		echo '<li><a href="' . esc_url( admin_url( 'nav-menus.php' ) ) . '">' . __( 'Add Menu', 'obsidian' ) . '</a></li>';
	}
	echo '</ul>';
}

/**
 * Custom comment callback
 */
function obsidian_comment_callback( $comment, $args, $depth ) {
	if ( 'div' === $args['style'] ) {
		$tag       = 'div';
		$add_below = 'comment';
	} else {
		$tag       = 'li';
		$add_below = 'div-comment';
	}
	?>
	<<?php echo $tag; ?> <?php comment_class( empty( $args['has_children'] ) ? '' : 'parent' ); ?> id="comment-<?php comment_ID() ?>">
	<?php if ( 'div' != $args['style'] ) : ?>
		<div id="div-comment-<?php comment_ID() ?>" class="obsidian-comment-body">
	<?php endif; ?>
	
	<div class="obsidian-comment-author vcard">
		<?php if ( $args['avatar_size'] != 0 ) echo get_avatar( $comment, $args['avatar_size'] ); ?>
		<?php printf( __( '<cite class="fn">%s</cite> <span class="says">says:</span>' ), get_comment_author_link() ); ?>
	</div>
	
	<?php if ( $comment->comment_approved == '0' ) : ?>
		<em class="obsidian-comment-awaiting-moderation"><?php _e( 'Your comment is awaiting moderation.' ); ?></em>
		<br />
	<?php endif; ?>

	<div class="obsidian-comment-meta commentmetadata">
		<a href="<?php echo htmlspecialchars( get_comment_link( $comment->comment_ID ) ); ?>">
			<?php
			printf( __('%1$s at %2$s'), get_comment_date(),  get_comment_time() ); ?>
		</a>
		<?php edit_comment_link( __( '(Edit)' ), '  ', '' );
		?>
	</div>

	<?php comment_text(); ?>

	<div class="obsidian-comment-reply">
		<?php comment_reply_link( array_merge( $args, array( 'add_below' => $add_below, 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?>
	</div>
	
	<?php if ( 'div' != $args['style'] ) : ?>
		</div>
	<?php endif; ?>
	<?php
}

/**
 * Add editor stylesheet
 */
function obsidian_add_editor_styles() {
	add_editor_style( array(
		'assets/css/dynamic.css',
		'assets/css/editor-style.css'
	) );
}
add_action( 'admin_init', 'obsidian_add_editor_styles' );

/**
 * Enqueue editor styles with proper dependencies
 */
function obsidian_enqueue_editor_styles() {
	// Enqueue dynamic CSS for editor
	wp_enqueue_style(
		'obsidian-editor-dynamic',
		OBSIDIAN_ASSETS_URL . '/css/dynamic.css',
		array(),
		OBSIDIAN_VERSION
	);
	
	// Enqueue editor-specific styles
	wp_enqueue_style(
		'obsidian-editor-style',
		OBSIDIAN_ASSETS_URL . '/css/editor-style.css',
		array( 'obsidian-editor-dynamic' ),
		OBSIDIAN_VERSION
	);
}
add_action( 'enqueue_block_editor_assets', 'obsidian_enqueue_editor_styles' );

/**
 * Add theme support for custom background
 */
function obsidian_custom_background_setup() {
	add_theme_support( 'custom-background', apply_filters( 'obsidian_custom_background_args', array(
		'default-color' => 'ffffff',
		'default-image' => '',
	) ) );
}
add_action( 'after_setup_theme', 'obsidian_custom_background_setup' );

/**
 * Enqueue admin styles
 */
function obsidian_admin_styles() {
	wp_enqueue_style( 'obsidian-admin', OBSIDIAN_ASSETS_URL . '/css/admin.css', array(), OBSIDIAN_VERSION );
}
add_action( 'admin_enqueue_scripts', 'obsidian_admin_styles' );

/**
 * Add body classes
 */
function obsidian_body_classes( $classes ) {
	// Add class for when sidebar is active
	if ( is_active_sidebar( 'sidebar-primary' ) ) {
		$classes[] = 'has-sidebar';
	}
	
	// Add class for custom header
	if ( has_header_image() ) {
		$classes[] = 'has-header-image';
	}
	
	// Add class for custom logo
	if ( has_custom_logo() ) {
		$classes[] = 'has-custom-logo';
	}
	
	return $classes;
}
add_filter( 'body_class', 'obsidian_body_classes' );

/**
 * Add pingback url auto-discovery header for single posts and pages
 */
function obsidian_pingback_header() {
	if ( is_singular() && pings_open() ) {
		printf( '<link rel="pingback" href="%s">', esc_url( get_bloginfo( 'pingback_url' ) ) );
	}
}
add_action( 'wp_head', 'obsidian_pingback_header' );

/**
 * Customize excerpt length
 */
function obsidian_excerpt_length( $length ) {
	return apply_filters( 'obsidian_excerpt_length', 25 );
}
add_filter( 'excerpt_length', 'obsidian_excerpt_length', 999 );

/**
 * Customize excerpt more
 */
function obsidian_excerpt_more( $more ) {
	return apply_filters( 'obsidian_excerpt_more', '&hellip;' );
}
add_filter( 'excerpt_more', 'obsidian_excerpt_more' );

/**
 * Add preconnect for Google Fonts
 */
function obsidian_resource_hints( $urls, $relation_type ) {
	if ( wp_style_is( 'obsidian-fonts', 'queue' ) && 'preconnect' === $relation_type ) {
		$urls[] = array(
			'href' => 'https://fonts.gstatic.com',
			'crossorigin',
		);
	}
	return $urls;
}
add_filter( 'wp_resource_hints', 'obsidian_resource_hints', 10, 2 );

/**
 * Add theme action hooks
 */
function obsidian_add_action_hooks() {
	// Header hooks
	add_action( 'obsidian_header_before', function() {
		do_action( 'obsidian_header_before' );
	});
	
	add_action( 'obsidian_header_after', function() {
		do_action( 'obsidian_header_after' );
	});
	
	// Footer hooks
	add_action( 'obsidian_footer_before', function() {
		do_action( 'obsidian_footer_before' );
	});
	
	add_action( 'obsidian_footer_after', function() {
		do_action( 'obsidian_footer_after' );
	});
}
add_action( 'init', 'obsidian_add_action_hooks' );

/**
 * Security enhancements
 */
function obsidian_security_headers() {
	// Remove WordPress version from head
	remove_action( 'wp_head', 'wp_generator' );
	
	// Remove version from scripts and styles
	add_filter( 'style_loader_src', 'obsidian_remove_version_strings' );
	add_filter( 'script_loader_src', 'obsidian_remove_version_strings' );
}
add_action( 'init', 'obsidian_security_headers' );

/**
 * Remove version strings
 */
function obsidian_remove_version_strings( $src ) {
	if ( strpos( $src, 'ver=' ) ) {
		$src = remove_query_arg( 'ver', $src );
	}
	return $src;
}

/**
 * Performance optimizations
 */
function obsidian_performance_optimizations() {
	// Remove emoji scripts
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	
	// Remove unnecessary REST API links
	remove_action( 'wp_head', 'rest_output_link_wp_head' );
	remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
	
	// Remove shortlink
	remove_action( 'wp_head', 'wp_shortlink_wp_head' );
}
add_action( 'init', 'obsidian_performance_optimizations' );