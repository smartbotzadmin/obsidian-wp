<?php
/**
 * The template for displaying header.
 *
 * @package HelloElementor
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

$site_name = get_bloginfo( 'name' );
$tagline   = get_bloginfo( 'description', 'display' );
$header_nav_menu = wp_nav_menu( [
	'theme_location' => 'menu-1',
	'fallback_cb' => false,
	'container' => false,
	'echo' => false,
] );
?>

<header id="site-header" class="site-header">
	<div class="header-inner">
		<div class="site-branding">
			<?php
			if ( has_custom_logo() ) {
				the_custom_logo();
			} elseif ( $site_name ) {
				?>
				<div class="site-title">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" title="<?php echo esc_attr__( 'Home', 'obsidian' ); ?>" rel="home">
						<?php echo esc_html( $site_name ); ?>
					</a>
				</div>
				<?php
			}
			?>
		</div>

		<?php if ( $header_nav_menu ) : ?>
			<nav class="site-navigation" aria-label="<?php echo esc_attr__( 'Main menu', 'obsidian' ); ?>">
				<?php
				// PHPCS - escaped by WordPress with "wp_nav_menu"
				echo $header_nav_menu; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				?>
			</nav>
		<?php endif; ?>

		<div class="header-actions">
			<a href="#get-started" class="btn-primary">Get Started</a>
		</div>
	</div>
</header>
