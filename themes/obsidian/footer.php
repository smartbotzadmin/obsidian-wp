<?php
/**
 * The template for displaying the footer
 *
 * @package Obsidian
 * @since 1.0.0
 */

?>

	<footer id="colophon" class="obsidian-footer" role="contentinfo">
		<div class="obsidian-container">
			
			<?php if ( is_active_sidebar( 'sidebar-footer' ) ) : ?>
				<div class="obsidian-footer-widgets">
					<div class="obsidian-footer-widget-area">
						<?php dynamic_sidebar( 'sidebar-footer' ); ?>
					</div>
				</div>
			<?php endif; ?>
			
			<div class="obsidian-footer-info">
				<div class="obsidian-footer-content">
					
					<div class="obsidian-site-info">
						<p>
							<?php
							printf(
								/* translators: 1: Theme name, 2: WordPress */
								esc_html__( 'Powered by %1$s and %2$s', 'obsidian' ),
								'<a href="https://obsidian-theme.com" rel="nofollow">Obsidian</a>',
								'<a href="' . esc_url( __( 'https://wordpress.org/', 'obsidian' ) ) . '" rel="nofollow">WordPress</a>'
							);
							?>
						</p>
						
						<?php if ( function_exists( 'the_privacy_policy_link' ) ) : ?>
							<p class="obsidian-privacy-policy">
								<?php the_privacy_policy_link(); ?>
							</p>
						<?php endif; ?>
					</div>
					
					<?php if ( has_nav_menu( 'footer' ) ) : ?>
						<nav class="obsidian-footer-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Footer Menu', 'obsidian' ); ?>">
							<?php
							wp_nav_menu( array(
								'theme_location' => 'footer',
								'menu_class'     => 'obsidian-footer-menu',
								'container'      => false,
								'depth'          => 1,
							) );
							?>
						</nav>
					<?php endif; ?>
					
				</div>
			</div>
			
		</div>
	</footer>

</div><!-- #page -->

<div id="obsidian-back-to-top" class="obsidian-back-to-top" aria-hidden="true">
	<button type="button" aria-label="<?php esc_attr_e( 'Back to top', 'obsidian' ); ?>">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
			<path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
		</svg>
	</button>
</div>

<?php wp_footer(); ?>

</body>
</html>