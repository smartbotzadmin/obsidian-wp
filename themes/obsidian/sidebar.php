<?php
/**
 * The sidebar containing the main widget area
 *
 * @package Obsidian
 * @since 1.0.0
 */

if ( ! is_active_sidebar( 'sidebar-primary' ) ) {
	return;
}
?>

<aside id="secondary" class="obsidian-sidebar widget-area" role="complementary" aria-label="<?php esc_attr_e( 'Primary Sidebar', 'obsidian' ); ?>">
	<div class="obsidian-sidebar-content">
		<?php dynamic_sidebar( 'sidebar-primary' ); ?>
	</div>
</aside>