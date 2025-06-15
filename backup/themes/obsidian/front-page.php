<?php
/**
 * The front page template file
 *
 * This is the template that displays the front page by default.
 * It includes a hero section similar to smartbotz.vercel.app
 *
 * @package Obsidian
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();

$is_elementor_theme_exist = function_exists( 'elementor_theme_do_location' );

// Check if Elementor is handling the front page
if ( ! $is_elementor_theme_exist || ! elementor_theme_do_location( 'single' ) ) {
	?>
	<main id="content" class="site-main">
		<div class="hero-section fade-in-up">
			<div class="container">
				<div class="hero-tagline">
					Finally, AI that understands design
				</div>
				
				<h1 class="hero-title">
					Build beautiful websites in minutes, not months
				</h1>
				
				<p class="hero-subtitle">
					From idea to production-ready app in minutes. No design skills required.
				</p>
				
				<a href="#get-started" class="btn-primary">
					Try It Free
				</a>
			</div>
		</div>

		<?php
		// Display page content if it exists
		if ( have_posts() ) :
			while ( have_posts() ) :
				the_post();
				?>
				<div class="page-content container">
					<?php
					the_content();
					
					wp_link_pages(
						array(
							'before'      => '<div class="page-links"><span class="page-links-title">' . esc_html__( 'Pages:', 'obsidian' ) . '</span>',
							'after'       => '</div>',
							'link_before' => '<span>',
							'link_after'  => '</span>',
							'pagelink'    => '<span class="screen-reader-text">' . esc_html__( 'Page', 'obsidian' ) . ' </span>%',
							'separator'   => '<span class="screen-reader-text">, </span>',
						)
					);
					?>
				</div>
				<?php
			endwhile;
		endif;
		?>
	</main>
	<?php
}

get_footer();