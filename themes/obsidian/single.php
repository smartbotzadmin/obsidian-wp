<?php
/**
 * The template for displaying all single posts
 *
 * @package Obsidian
 * @since 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header(); ?>

<main id="content" class="site-main" role="main">
	<?php if ( apply_filters( 'hello_elementor_page_title', true ) ) : ?>
		<header class="page-header">
			<h1 class="entry-title"><?php the_title(); ?></h1>
		</header>
	<?php endif; ?>
	<div class="page-content">
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
				<div class="post-content">
					<div class="entry-meta">
						<?php
						echo '<span class="posted-on">';
						echo get_the_date();
						echo '</span>';
						echo '<span class="byline"> by ';
						the_author();
						echo '</span>';
						if ( has_category() ) {
							echo '<span class="cat-links"> in ';
							the_category( ', ' );
							echo '</span>';
						}
						?>
					</div>
					<div class="entry-content">
						<?php
						the_content();

						wp_link_pages( array(
							'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'hello-elementor' ),
							'after'  => '</div>',
						) );
						?>
					</div>
					<div class="entry-footer">
						<?php
						if ( has_tag() ) {
							echo '<span class="tags-links">';
							the_tags( 'Tags: ', ', ', '' );
							echo '</span>';
						}
						?>
					</div>
				</div>
			</article>
			<?php
			the_post_navigation( array(
				'prev_text' => '<span class="nav-subtitle">' . esc_html__( 'Previous:', 'hello-elementor' ) . '</span> <span class="nav-title">%title</span>',
				'next_text' => '<span class="nav-subtitle">' . esc_html__( 'Next:', 'hello-elementor' ) . '</span> <span class="nav-title">%title</span>',
			) );

			// If comments are open or we have at least one comment, load up the comment template.
			if ( comments_open() || get_comments_number() ) :
				comments_template();
			endif;

		endwhile; // End of the loop.
		?>
	</div>
</main>

<?php
get_footer();