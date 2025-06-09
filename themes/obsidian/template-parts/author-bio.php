<?php
/**
 * The template for displaying author bio
 *
 * @package Obsidian
 * @since 1.0.0
 */

$description = get_the_author_meta( 'description' );
if ( ! $description ) {
	return;
}
?>

<div class="obsidian-author-bio">
	<div class="obsidian-author-bio-content">
		
		<div class="obsidian-author-avatar">
			<?php echo get_avatar( get_the_author_meta( 'ID' ), 80 ); ?>
		</div>
		
		<div class="obsidian-author-info">
			<h3 class="obsidian-author-title">
				<?php
				printf(
					/* translators: %s: author name */
					__( 'About %s', 'obsidian' ),
					'<span class="obsidian-author-name">' . esc_html( get_the_author() ) . '</span>'
				);
				?>
			</h3>
			
			<div class="obsidian-author-description">
				<?php echo wp_kses_post( wpautop( $description ) ); ?>
			</div>
			
			<div class="obsidian-author-links">
				<a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>" class="obsidian-author-posts-link">
					<?php _e( 'View all posts', 'obsidian' ); ?>
				</a>
				
				<?php if ( get_the_author_meta( 'url' ) ) : ?>
					<a href="<?php echo esc_url( get_the_author_meta( 'url' ) ); ?>" class="obsidian-author-website" target="_blank" rel="noopener">
						<?php _e( 'Website', 'obsidian' ); ?>
					</a>
				<?php endif; ?>
			</div>
		</div>
		
	</div>
</div>