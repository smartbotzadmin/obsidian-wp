<?php
/**
 * The main template file - SmartBotz Design
 *
 * @package Obsidian
 * @since 1.0.0
 */

get_header(); ?>

<main id="content" class="site-main smartbotz-design" role="main">
	<?php if ( is_front_page() && is_home() ) : ?>
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
						<a href="#" class="smartbotz-try-button">TRY IT FREE</a>
					</div>
				</div>
			</div>
			
			<!-- Background Pattern -->
			<div class="smartbotz-bg-pattern"></div>
		</div>
	<?php endif; ?>

	<!-- Blog Posts Section (if needed) -->
	<?php if ( have_posts() && ! ( is_front_page() && is_home() ) ) : ?>
		<div class="smartbotz-blog-section">
			<div class="smartbotz-container">
				<div class="smartbotz-blog-header">
					<h2>Latest Articles</h2>
					<p>Discover insights and updates from our team</p>
				</div>
				
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
			</div>
		</div>
	<?php endif; ?>
</main>

<style>
/* SmartBotz Design Styles */
.smartbotz-design {
	background: #0a0a0a;
	color: white;
	min-height: 100vh;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.smartbotz-hero {
	min-height: 100vh;
	position: relative;
	display: flex;
	align-items: center;
	background: #0a0a0a;
	overflow: hidden;
}

.smartbotz-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 0 2rem;
	width: 100%;
	position: relative;
	z-index: 2;
}

/* Navigation */
.smartbotz-nav {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1.5rem 2rem;
	z-index: 1000;
	background: rgba(10, 10, 10, 0.8);
	backdrop-filter: blur(10px);
	border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.smartbotz-logo {
	display: flex;
	align-items: center;
	gap: 0.75rem;
	font-weight: 700;
	font-size: 1.25rem;
	color: white;
}

.smartbotz-logo img {
	width: 24px;
	height: 24px;
}

.smartbotz-get-started {
	background: #1e293b;
	color: white;
	padding: 0.75rem 1.5rem;
	border-radius: 0.5rem;
	text-decoration: none;
	font-weight: 500;
	transition: all 0.3s ease;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.smartbotz-get-started:hover {
	background: #334155;
	transform: translateY(-1px);
}

/* Hero Content */
.smartbotz-hero-content {
	text-align: center;
	max-width: 800px;
	margin: 0 auto;
	padding-top: 8rem;
}

.smartbotz-badge {
	display: inline-block;
	background: rgba(6, 182, 212, 0.1);
	color: #06b6d4;
	padding: 0.5rem 1rem;
	border-radius: 2rem;
	font-size: 0.875rem;
	font-weight: 500;
	margin-bottom: 2rem;
	border: 1px solid rgba(6, 182, 212, 0.2);
}

.smartbotz-main-heading {
	font-size: 4rem;
	font-weight: 700;
	line-height: 1.1;
	margin-bottom: 1.5rem;
	color: white;
}

.smartbotz-blur-text {
	color: rgba(255, 255, 255, 0.6);
	filter: blur(0.5px);
}

.smartbotz-subtitle {
	font-size: 1.125rem;
	color: rgba(255, 255, 255, 0.7);
	margin-bottom: 3rem;
	line-height: 1.6;
}

.smartbotz-cta {
	margin-top: 2rem;
}

.smartbotz-try-button {
	display: inline-block;
	background: linear-gradient(135deg, #06b6d4, #8b5cf6);
	color: white;
	padding: 1rem 2.5rem;
	border-radius: 0.5rem;
	text-decoration: none;
	font-weight: 600;
	font-size: 1rem;
	letter-spacing: 0.025em;
	transition: all 0.3s ease;
	box-shadow: 0 4px 20px rgba(6, 182, 212, 0.3);
}

.smartbotz-try-button:hover {
	transform: translateY(-2px);
	box-shadow: 0 8px 30px rgba(6, 182, 212, 0.4);
}

/* Background Pattern */
.smartbotz-bg-pattern {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-image: 
		radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
		radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
	background-size: 100% 100%;
	pointer-events: none;
}

/* Blog Section */
.smartbotz-blog-section {
	background: #111111;
	padding: 5rem 0;
}

.smartbotz-blog-header {
	text-align: center;
	margin-bottom: 3rem;
}

.smartbotz-blog-header h2 {
	font-size: 2.5rem;
	font-weight: 700;
	margin-bottom: 1rem;
	color: white;
}

.smartbotz-blog-header p {
	color: rgba(255, 255, 255, 0.7);
	font-size: 1.125rem;
}

.smartbotz-posts-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
	gap: 2rem;
}

.smartbotz-post-card {
	background: rgba(255, 255, 255, 0.05);
	border-radius: 1rem;
	overflow: hidden;
	transition: all 0.3s ease;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.smartbotz-post-card:hover {
	transform: translateY(-4px);
	background: rgba(255, 255, 255, 0.08);
}

.smartbotz-post-image img {
	width: 100%;
	height: 200px;
	object-fit: cover;
}

.smartbotz-post-content {
	padding: 1.5rem;
}

.smartbotz-post-meta {
	display: flex;
	gap: 1rem;
	margin-bottom: 1rem;
	font-size: 0.875rem;
	color: rgba(255, 255, 255, 0.6);
}

.smartbotz-post-category {
	color: #06b6d4;
}

.smartbotz-post-title {
	margin-bottom: 1rem;
}

.smartbotz-post-title a {
	color: white;
	text-decoration: none;
	font-size: 1.25rem;
	font-weight: 600;
	line-height: 1.4;
}

.smartbotz-post-title a:hover {
	color: #06b6d4;
}

.smartbotz-post-excerpt {
	color: rgba(255, 255, 255, 0.7);
	line-height: 1.6;
	margin-bottom: 1rem;
}

.smartbotz-read-more {
	color: #06b6d4;
	text-decoration: none;
	font-weight: 500;
	font-size: 0.875rem;
}

.smartbotz-read-more:hover {
	color: #0891b2;
}

/* Responsive Design */
@media (max-width: 768px) {
	.smartbotz-nav {
		padding: 1rem;
	}
	
	.smartbotz-container {
		padding: 0 1rem;
	}
	
	.smartbotz-hero-content {
		padding-top: 6rem;
	}
	
	.smartbotz-main-heading {
		font-size: 2.5rem;
	}
	
	.smartbotz-subtitle {
		font-size: 1rem;
	}
	
	.smartbotz-posts-grid {
		grid-template-columns: 1fr;
	}
	
	.smartbotz-logo span {
		display: none;
	}
}

/* Hide default WordPress elements */
.smartbotz-design .site-header,
.smartbotz-design .site-footer {
	display: none;
}

body.smartbotz-active {
	background: #0a0a0a;
	margin: 0;
	padding: 0;
}
</style>

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