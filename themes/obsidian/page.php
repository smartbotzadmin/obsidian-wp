<?php
/**
 * The template for displaying all pages
 *
 * @package Obsidian
 * @since 1.0.0
 */

get_header();
?>

<main id="main" class="obsidian-main" role="main">
	<div class="obsidian-container">
		
		<?php while ( have_posts() ) : the_post(); ?>
			
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'obsidian-single-page' ); ?>>
				
				<?php if ( has_post_thumbnail() && ! is_front_page() ) : ?>
					<div class="obsidian-page-featured-image">
						<?php the_post_thumbnail( 'large', array( 'alt' => the_title_attribute( array( 'echo' => false ) ) ) ); ?>
					</div>
				<?php endif; ?>
				
				<div class="obsidian-page-content">
					
					<header class="obsidian-page-header">
						<?php the_title( '<h1 class="obsidian-page-title">', '</h1>' ); ?>
					</header>
					
					<div class="obsidian-page-body">
						<?php
						the_content();
						
						wp_link_pages( array(
							'before' => '<div class="obsidian-page-links">' . __( 'Pages:', 'obsidian' ),
							'after'  => '</div>',
						) );
						?>
					</div>
					
					<?php if ( get_edit_post_link() ) : ?>
						<footer class="obsidian-page-footer">
							<div class="obsidian-edit-link">
								<?php edit_post_link( __( 'Edit', 'obsidian' ), '<span class="edit-link">', '</span>' ); ?>
							</div>
						</footer>
					<?php endif; ?>
					
				</div>
				
			</article>
			
			<?php
			// Comments
			if ( comments_open() || get_comments_number() ) :
				comments_template();
			endif;
			?>
			
		<?php endwhile; ?>
		
	</div>
</main>

<?php
get_sidebar();
get_footer();