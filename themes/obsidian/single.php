<?php
/**
 * The template for displaying all single posts
 *
 * @package Obsidian
 * @since 1.0.0
 */

get_header();
?>

<main id="main" class="obsidian-main" role="main">
	<div class="obsidian-container">
		
		<?php while ( have_posts() ) : the_post(); ?>
			
			<article id="post-<?php the_ID(); ?>" <?php post_class( 'obsidian-single-post' ); ?>>
				
				<?php if ( has_post_thumbnail() ) : ?>
					<div class="obsidian-post-featured-image">
						<?php the_post_thumbnail( 'large', array( 'alt' => the_title_attribute( array( 'echo' => false ) ) ) ); ?>
					</div>
				<?php endif; ?>
				
				<div class="obsidian-post-content">
					
					<header class="obsidian-post-header">
						<?php the_title( '<h1 class="obsidian-post-title">', '</h1>' ); ?>
						
						<?php if ( 'post' === get_post_type() ) : ?>
							<div class="obsidian-post-meta">
								<div class="obsidian-meta-group">
									<span class="obsidian-posted-on">
										<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
											<path d="M6 2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07A7.001 7.001 0 0 1 8 15a7 7 0 0 1-1-.07V4H6.5A.5.5 0 0 1 6 3.5V2z"/>
										</svg>
										<time class="obsidian-published" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
											<?php echo esc_html( get_the_date() ); ?>
										</time>
									</span>
									
									<span class="obsidian-byline">
										<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
											<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
										</svg>
										<?php _e( 'by', 'obsidian' ); ?>
										<span class="obsidian-author vcard">
											<a class="obsidian-url fn n" href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>">
												<?php echo esc_html( get_the_author() ); ?>
											</a>
										</span>
									</span>
								</div>
								
								<?php if ( has_category() || has_tag() ) : ?>
									<div class="obsidian-meta-group">
										<?php if ( has_category() ) : ?>
											<span class="obsidian-cat-links">
												<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
													<path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.825a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L2.61 1a2 2 0 0 1 1.657-.9h5.396L9.828 3zM8.5 2H3.268a1 1 0 0 0-.829.45l-2.07 2.4a.99.99 0 0 0-.171.655L.835 12.5A1 1 0 0 0 1.826 13.5h11.348a1 1 0 0 0 .996-.9l.637-7a1 1 0 0 0-.996-1.1H10.5L8.5 2z"/>
												</svg>
												<?php _e( 'in', 'obsidian' ); ?>
												<?php the_category( ', ' ); ?>
											</span>
										<?php endif; ?>
										
										<?php if ( has_tag() ) : ?>
											<span class="obsidian-tag-links">
												<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
													<path d="M2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2zm3.5 4a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
												</svg>
												<?php the_tags( '', ', ' ); ?>
											</span>
										<?php endif; ?>
									</div>
								<?php endif; ?>
							</div>
						<?php endif; ?>
					</header>
					
					<div class="obsidian-post-body">
						<?php
						the_content();
						
						wp_link_pages( array(
							'before' => '<div class="obsidian-page-links">' . __( 'Pages:', 'obsidian' ),
							'after'  => '</div>',
						) );
						?>
					</div>
					
					<?php if ( get_edit_post_link() ) : ?>
						<footer class="obsidian-post-footer">
							<div class="obsidian-edit-link">
								<?php edit_post_link( __( 'Edit', 'obsidian' ), '<span class="edit-link">', '</span>' ); ?>
							</div>
						</footer>
					<?php endif; ?>
					
				</div>
				
			</article>
			
			<?php
			// Author bio
			if ( is_single() && get_the_author_meta( 'description' ) ) :
				get_template_part( 'template-parts/author-bio' );
			endif;
			
			// Post navigation
			the_post_navigation( array(
				'prev_text' => '<span class="nav-subtitle">' . __( 'Previous:', 'obsidian' ) . '</span> <span class="nav-title">%title</span>',
				'next_text' => '<span class="nav-subtitle">' . __( 'Next:', 'obsidian' ) . '</span> <span class="nav-title">%title</span>',
			) );
			
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