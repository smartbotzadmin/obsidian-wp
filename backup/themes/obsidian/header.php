<?php
/**
 * The header for our theme
 *
 * @package Obsidian
 */
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e('Skip to content', 'obsidian-minimal'); ?></a>
<div id="page" class="site">
    <header id="site-header" class="site-header" role="banner">
        <div class="site-branding">
            <div class="site-title">
                <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                    <?php bloginfo('name'); ?>
                </a>
            </div>
            <?php
            $description = get_bloginfo('description', 'display');
            if ($description || is_customize_preview()) :
                ?>
                <div class="site-description"><?php echo $description; ?></div>
            <?php endif; ?>
        </div>
    </header>
</body>
</html> 