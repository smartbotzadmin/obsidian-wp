<?php
/**
 * The header for SmartBotz design
 *
 * @package Obsidian
 * @since 2.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'smartbotz-active' ); ?>>

<?php wp_body_open(); ?>

<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#content"><?php echo esc_html__( 'Skip to content', 'obsidian' ); ?></a>
	
	<!-- SmartBotz design handles its own navigation, so we hide the default header -->