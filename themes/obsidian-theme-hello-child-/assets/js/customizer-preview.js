/**
 * Customizer Live Preview
 *
 * This file handles the live preview functionality in the WordPress Customizer
 * for the Obsidian theme settings.
 */

( function( $ ) {
	'use strict';

	// Site title and description
	wp.customize( 'blogname', function( value ) {
		value.bind( function( to ) {
			$( '.site-title a' ).text( to );
		} );
	} );

	wp.customize( 'blogdescription', function( value ) {
		value.bind( function( to ) {
			$( '.site-description' ).text( to );
		} );
	} );

	// Color settings
	if ( typeof obsidianThemeSettings !== 'undefined' && obsidianThemeSettings.colors ) {
		Object.keys( obsidianThemeSettings.colors ).forEach( function( colorSlug ) {
			wp.customize( 'obsidian_color_' + colorSlug, function( value ) {
				value.bind( function( to ) {
					// Update CSS variable
					document.documentElement.style.setProperty( '--wp--preset--color--' + colorSlug, to );
					
					// Special handling for background and foreground colors
					if ( colorSlug === 'background' ) {
						$( 'body' ).css( 'background-color', to );
					} else if ( colorSlug === 'foreground' ) {
						$( 'body' ).css( 'color', to );
					}
				} );
			} );
		} );
	}

	// Typography settings
	wp.customize( 'obsidian_body_font_family', function( value ) {
		value.bind( function( to ) {
			// Map font slug to font family
			var fontMap = {
				'system-font': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
				'inter': '"Inter", sans-serif',
				'roboto': '"Roboto", sans-serif',
				'open-sans': '"Open Sans", sans-serif',
				'lato': '"Lato", sans-serif',
				'montserrat': '"Montserrat", sans-serif',
				'playfair-display': '"Playfair Display", serif',
				'merriweather': '"Merriweather", serif',
				'lora': '"Lora", serif',
				'roboto-mono': '"Roboto Mono", monospace',
				'source-code-pro': '"Source Code Pro", monospace'
			};
			
			if ( fontMap[to] ) {
				$( 'body' ).css( 'font-family', fontMap[to] );
			}
		} );
	} );

	wp.customize( 'obsidian_heading_font_family', function( value ) {
		value.bind( function( to ) {
			// Map font slug to font family
			var fontMap = {
				'system-font': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
				'inter': '"Inter", sans-serif',
				'roboto': '"Roboto", sans-serif',
				'open-sans': '"Open Sans", sans-serif',
				'lato': '"Lato", sans-serif',
				'montserrat': '"Montserrat", sans-serif',
				'playfair-display': '"Playfair Display", serif',
				'merriweather': '"Merriweather", serif',
				'lora': '"Lora", serif',
				'roboto-mono': '"Roboto Mono", monospace',
				'source-code-pro': '"Source Code Pro", monospace'
			};
			
			if ( fontMap[to] ) {
				$( 'h1, h2, h3, h4, h5, h6' ).css( 'font-family', fontMap[to] );
			}
		} );
	} );

	wp.customize( 'obsidian_base_font_size', function( value ) {
		value.bind( function( to ) {
			$( 'body' ).css( 'font-size', to );
		} );
	} );

	// Layout settings
	wp.customize( 'obsidian_content_width', function( value ) {
		value.bind( function( to ) {
			// Update CSS variable
			document.documentElement.style.setProperty( '--wp--style--global--content-size', to );
			
			// Update any elements using this width
			$( '.wp-block-group.alignwide, .wp-block-cover.alignwide' ).css( 'max-width', to );
		} );
	} );

	wp.customize( 'obsidian_wide_width', function( value ) {
		value.bind( function( to ) {
			// Update CSS variable
			document.documentElement.style.setProperty( '--wp--style--global--wide-size', to );
			
			// Update any elements using this width
			$( '.wp-block-group.alignfull, .wp-block-cover.alignfull' ).css( 'max-width', to );
		} );
	} );

} )( jQuery );