<?php
/**
 * The front page template file - SmartBotz Design
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
					<a href="#" class="smartbotz-try-button">TRY IT FREE</a>
				</div>
			</div>
		</div>
		
		<!-- Background Pattern -->
		<div class="smartbotz-bg-pattern"></div>
	</div>

	<!-- Page Content -->
	<?php if ( have_posts() ) : ?>
		<div class="smartbotz-page-content">
			<div class="smartbotz-container">
				<?php while ( have_posts() ) : the_post(); ?>
					<article class="smartbotz-page-article">
						<div class="smartbotz-page-body">
							<?php the_content(); ?>
							<?php
							wp_link_pages( array(
								'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'obsidian' ),
								'after'  => '</div>',
							) );
							?>
						</div>
					</article>
					<?php
					if ( comments_open() || get_comments_number() ) :
						comments_template();
					endif;
				endwhile;
				?>
			</div>
		</div>
	<?php endif; ?>
</main>

<style>
.smartbotz-page-content {
	background: #111111;
	padding: 5rem 0;
	min-height: 50vh;
}

.smartbotz-page-article {
	background: rgba(255, 255, 255, 0.05);
	border-radius: 1rem;
	padding: 3rem;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.smartbotz-page-body {
	color: rgba(255, 255, 255, 0.9);
	line-height: 1.7;
	font-size: 1.125rem;
}

.smartbotz-page-body h1,
.smartbotz-page-body h2,
.smartbotz-page-body h3,
.smartbotz-page-body h4,
.smartbotz-page-body h5,
.smartbotz-page-body h6 {
	color: white;
	margin-top: 2rem;
	margin-bottom: 1rem;
}

.smartbotz-page-body p {
	margin-bottom: 1.5rem;
}

.smartbotz-page-body a {
	color: #06b6d4;
}

.smartbotz-page-body a:hover {
	color: #0891b2;
}

.smartbotz-page-body ul,
.smartbotz-page-body ol {
	margin-bottom: 1.5rem;
	padding-left: 2rem;
}

.smartbotz-page-body li {
	margin-bottom: 0.5rem;
}

.smartbotz-page-body blockquote {
	border-left: 4px solid #06b6d4;
	padding-left: 1.5rem;
	margin: 2rem 0;
	font-style: italic;
	background: rgba(6, 182, 212, 0.1);
	padding: 1.5rem;
	border-radius: 0.5rem;
}

.smartbotz-page-body code {
	background: rgba(255, 255, 255, 0.1);
	padding: 0.25rem 0.5rem;
	border-radius: 0.25rem;
	font-family: 'Courier New', monospace;
}

.smartbotz-page-body pre {
	background: rgba(255, 255, 255, 0.05);
	padding: 1.5rem;
	border-radius: 0.5rem;
	overflow-x: auto;
	border: 1px solid rgba(255, 255, 255, 0.1);
}

.smartbotz-page-body img {
	max-width: 100%;
	height: auto;
	border-radius: 0.5rem;
	margin: 1.5rem 0;
}

.page-links {
	margin-top: 2rem;
	padding-top: 2rem;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.page-links a {
	display: inline-block;
	padding: 0.5rem 1rem;
	background: rgba(6, 182, 212, 0.1);
	color: #06b6d4;
	text-decoration: none;
	border-radius: 0.25rem;
	margin-right: 0.5rem;
	border: 1px solid rgba(6, 182, 212, 0.2);
}

.page-links a:hover {
	background: rgba(6, 182, 212, 0.2);
}

@media (max-width: 768px) {
	.smartbotz-page-article {
		padding: 2rem 1.5rem;
	}
	
	.smartbotz-page-body {
		font-size: 1rem;
	}
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