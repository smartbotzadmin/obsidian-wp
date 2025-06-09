<?php
/**
 * The main template file - BACKUP
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 *
 * @package Obsidian
 * @since 1.0.0
 */

get_header(); ?>

<main id="main" class="obsidian-main" role="main">
	<div class="obsidian-container">
		
		<?php if ( have_posts() ) : ?>
			
			<div class="obsidian-content">
				
				<?php if ( is_home() && ! is_front_page() ) : ?>
					<header class="obsidian-page-header">
						<h1 class="obsidian-page-title"><?php single_post_title(); ?></h1>
					</header>
				<?php endif; ?>
				
				<div class="obsidian-posts">
					<?php while ( have_posts() ) : the_post(); ?>
						
						<article id="post-<?php the_ID(); ?>" <?php post_class( 'obsidian-post' ); ?>>
							
							<?php if ( has_post_thumbnail() ) : ?>
								<div class="obsidian-post-thumbnail">
									<a href="<?php the_permalink(); ?>" aria-hidden="true" tabindex="-1">
										<?php the_post_thumbnail( 'large', array( 'alt' => the_title_attribute( array( 'echo' => false ) ) ) ); ?>
									</a>
								</div>
							<?php endif; ?>
							
							<div class="obsidian-post-content">
								
								<header class="obsidian-post-header">
									<?php
									if ( is_singular() ) :
										the_title( '<h1 class="obsidian-post-title">', '</h1>' );
									else :
										the_title( '<h2 class="obsidian-post-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></h2>' );
									endif;
									?>
									
									<?php if ( 'post' === get_post_type() ) : ?>
										<div class="obsidian-post-meta">
											<span class="obsidian-posted-on">
												<time class="obsidian-published" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
													<?php echo esc_html( get_the_date() ); ?>
												</time>
											</span>
											
											<span class="obsidian-byline">
												<?php _e( 'by', 'obsidian' ); ?>
												<span class="obsidian-author vcard">
													<a class="obsidian-url fn n" href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>">
														<?php echo esc_html( get_the_author() ); ?>
													</a>
												</span>
											</span>
											
											<?php if ( has_category() ) : ?>
												<span class="obsidian-cat-links">
													<?php _e( 'in', 'obsidian' ); ?>
													<?php the_category( ', ' ); ?>
												</span>
											<?php endif; ?>
										</div>
									<?php endif; ?>
								</header>
								
								<div class="obsidian-post-excerpt">
									<?php
									if ( is_singular() ) :
										the_content();
										
										wp_link_pages( array(
											'before' => '<div class="obsidian-page-links">' . __( 'Pages:', 'obsidian' ),
											'after'  => '</div>',
										) );
									else :
										the_excerpt();
									endif;
									?>
								</div>
								
								<?php if ( ! is_singular() ) : ?>
									<div class="obsidian-post-footer">
										<a href="<?php the_permalink(); ?>" class="obsidian-read-more">
											<?php _e( 'Read More', 'obsidian' ); ?>
											<span class="screen-reader-text"><?php printf( __( 'about %s', 'obsidian' ), get_the_title() ); ?></span>
										</a>
									</div>
								<?php endif; ?>
								
							</div>
							
						</article>
						
					<?php endwhile; ?>
				</div>
				
				<?php
				// Pagination
				the_posts_pagination( array(
					'mid_size'  => 2,
					'prev_text' => __( 'Previous', 'obsidian' ),
					'next_text' => __( 'Next', 'obsidian' ),
				) );
				?>
				
			</div>
			
		<?php else : ?>
			
			<section class="obsidian-no-results">
				<header class="obsidian-page-header">
					<h1 class="obsidian-page-title"><?php _e( 'Nothing here', 'obsidian' ); ?></h1>
				</header>
				
				<div class="obsidian-page-content">
					<p><?php _e( 'It looks like nothing was found at this location. Maybe try one of the links below or a search?', 'obsidian' ); ?></p>
					
					<?php
					get_search_form();
					
					the_widget( 'WP_Widget_Recent_Posts' );
					?>
					
					<div class="obsidian-widget">
						<h2 class="obsidian-widget-title"><?php _e( 'Most Used Categories', 'obsidian' ); ?></h2>
						<ul>
							<?php
							wp_list_categories( array(
								'orderby'    => 'count',
								'order'      => 'DESC',
								'show_count' => 1,
								'title_li'   => '',
								'number'     => 10,
							) );
							?>
						</ul>
					</div>
					
					<?php
					$archive_content = '<p>' . sprintf( __( 'Try looking in the monthly archives. %1$s', 'obsidian' ), convert_smilies( ':)' ) ) . '</p>';
					the_widget( 'WP_Widget_Archives', 'dropdown=1', "after_title=</h2>$archive_content" );
					
					the_widget( 'WP_Widget_Tag_Cloud' );
					?>
					
				</div>
			</section>
			
		<?php endif; ?>
		
	</div>
</main>

<?php
get_sidebar();
get_footer();
?>