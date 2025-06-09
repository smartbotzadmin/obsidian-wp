<?php
/**
 * Template for displaying search forms
 *
 * @package Obsidian
 * @since 1.0.0
 */

$unique_id = wp_unique_id( 'search-form-' );
?>

<form role="search" method="get" class="obsidian-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label for="<?php echo esc_attr( $unique_id ); ?>" class="screen-reader-text">
		<?php _e( 'Search for:', 'obsidian' ); ?>
	</label>
	<div class="obsidian-search-input-wrapper">
		<input 
			type="search" 
			id="<?php echo esc_attr( $unique_id ); ?>" 
			class="obsidian-search-field" 
			placeholder="<?php echo esc_attr_x( 'Search...', 'placeholder', 'obsidian' ); ?>" 
			value="<?php echo get_search_query(); ?>" 
			name="s" 
			autocomplete="off"
		/>
		<button type="submit" class="obsidian-search-submit">
			<span class="screen-reader-text"><?php _e( 'Search', 'obsidian' ); ?></span>
			<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
				<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
			</svg>
		</button>
	</div>
</form>