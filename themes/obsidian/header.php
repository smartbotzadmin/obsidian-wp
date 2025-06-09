<?php
/**
 * The header for our theme
 *
 * @package Obsidian
 * @since 1.0.0
 */

?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="screen-reader-text" href="#main"><?php _e( 'Skip to content', 'obsidian' ); ?></a>

<div id="page" class="obsidian-site">
	<header id="masthead" class="obsidian-header" role="banner">
		<div class="obsidian-container">
			<div class="obsidian-header-content">
				
				<div class="obsidian-site-branding">
					<?php if ( has_custom_logo() ) : ?>
						<div class="obsidian-site-logo">
							<?php the_custom_logo(); ?>
						</div>
					<?php endif; ?>
					
					<?php if ( is_front_page() && is_home() ) : ?>
						<h1 class="obsidian-site-title">
							<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
								<?php bloginfo( 'name' ); ?>
							</a>
						</h1>
					<?php else : ?>
						<p class="obsidian-site-title">
							<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
								<?php bloginfo( 'name' ); ?>
							</a>
						</p>
					<?php endif; ?>
					
					<?php
					$description = get_bloginfo( 'description', 'display' );
					if ( $description || is_customize_preview() ) :
					?>
						<p class="obsidian-site-description"><?php echo $description; ?></p>
					<?php endif; ?>
				</div>
				
				<nav id="site-navigation" class="obsidian-main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'obsidian' ); ?>">
					<button class="obsidian-menu-toggle" aria-controls="primary-menu" aria-expanded="false">
						<span class="screen-reader-text"><?php _e( 'Primary Menu', 'obsidian' ); ?></span>
						<span class="obsidian-menu-icon">
							<span></span>
							<span></span>
							<span></span>
						</span>
					</button>
					
					<?php
					wp_nav_menu( array(
						'theme_location' => 'primary',
						'menu_id'        => 'primary-menu',
						'menu_class'     => 'obsidian-nav-menu',
						'container'      => false,
						'fallback_cb'    => 'obsidian_default_menu',
					) );
					?>
				</nav>
				
				<div class="obsidian-header-actions">
					<button class="obsidian-search-toggle" aria-controls="header-search" aria-expanded="false">
						<span class="screen-reader-text"><?php _e( 'Search', 'obsidian' ); ?></span>
						<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
							<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
						</svg>
					</button>
					
					<div id="header-search" class="obsidian-search-form" aria-hidden="true">
						<?php get_search_form(); ?>
					</div>
				</div>
				
			</div>
		</div>
	</header>