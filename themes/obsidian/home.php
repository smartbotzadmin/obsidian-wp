<?php
/**
 * The blog home template file - SmartBotz Design
 *
 * @package Obsidian
 * @since 2.0.0
 */

get_header(); ?>

<main id="content" class="site-main smartbotz-design" role="main">
	<!-- SmartBotz Hero Section -->
	<div class="smartbotz-hero">
		<div class="smartbotz-container">
			<!-- Navigation -->
			<nav class="smartbotz-nav">
				<div class="smartbotz-logo">
					<img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K" alt="Obsidian">
					<span>OBSIDIAN</span>
				</div>
				<div class="smartbotz-nav-right">
					<a href="#" class="smartbotz-get-started">Get Started</a>
				</div>
			</nav>

			<!-- Hero Content -->
			<div class="smartbotz-hero-content">
				<div class="smartbotz-badge">
					Finally, AI that understands design
				</div>
				
				<h1 class="smartbotz-main-heading">
					Build beautiful<br>
					websites in minutes,<br>
					<span class="smartbotz-blur-text">not months</span>
				</h1>
				
				<p class="smartbotz-subtitle">
					From idea to production-ready app in minutes. No design skills<br>
					required.
				</p>
				
				<div class="smartbotz-cta">
					<a href="#blog" class="smartbotz-try-button">EXPLORE BLOG</a>
				</div>
			</div>
		</div>
		
		<!-- Background Pattern -->
		<div class="smartbotz-bg-pattern"></div>
	</div>

	<!-- Blog Posts Section -->
	<div id="blog" class="smartbotz-blog-section">
		<div class="smartbotz-container">
			<div class="smartbotz-blog-header">
				<h2>Latest Articles</h2>
				<p>Discover insights, tutorials, and updates from our team</p>
			</div>
			
			<?php if ( have_posts() ) : ?>
				<div class="smartbotz-posts-grid">
					<?php while ( have_posts() ) : the_post(); ?>
						<article class="smartbotz-post-card">
							<?php if ( has_post_thumbnail() ) : ?>
								<div class="smartbotz-post-image">
									<a href="<?php the_permalink(); ?>">
										<?php the_post_thumbnail( 'large' ); ?>
									</a>
								</div>
							<?php endif; ?>
							
							<div class="smartbotz-post-content">
								<div class="smartbotz-post-meta">
									<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
										<?php echo esc_html( get_the_date() ); ?>
									</time>
									<?php if ( has_category() ) : ?>
										<span class="smartbotz-post-category">
											<?php the_category( ', ' ); ?>
										</span>
									<?php endif; ?>
								</div>
								
								<h3 class="smartbotz-post-title">
									<a href="<?php the_permalink(); ?>">
										<?php the_title(); ?>
									</a>
								</h3>
								
								<div class="smartbotz-post-excerpt">
									<?php 
									if ( has_excerpt() ) {
										the_excerpt();
									} else {
										echo wp_trim_words( get_the_content(), 20, '...' );
									}
									?>
								</div>
								
								<a href="<?php the_permalink(); ?>" class="smartbotz-read-more">
									Read More →
								</a>
							</div>
						</article>
					<?php endwhile; ?>
				</div>

				<!-- Pagination -->
				<div class="smartbotz-pagination" style="display: flex; justify-content: center; margin-top: 3rem;">
					<?php
					the_posts_pagination( array(
						'mid_size'  => 2,
						'prev_text' => '← Previous',
						'next_text' => 'Next →',
					) );
					?>
				</div>

			<?php else : ?>
				<div class="smartbotz-no-posts" style="text-align: center; padding: 3rem; background: rgba(255, 255, 255, 0.05); border-radius: 1rem; border: 1px solid rgba(255, 255, 255, 0.1);">
					<h3 style="margin-bottom: 1rem; font-size: 1.5rem; color: white;">No posts found</h3>
					<p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 2rem;">
						It looks like nothing was found at this location. Try using the search below.
					</p>
					<?php get_search_form(); ?>
				</div>
			<?php endif; ?>
		</div>
	</div>
</main>

<script>
// Add body class for SmartBotz design
document.body.classList.add('smartbotz-active');

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute('href'));
		if (target) {
			target.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			});
		}
	});
});
</script>

<?php get_footer(); ?>