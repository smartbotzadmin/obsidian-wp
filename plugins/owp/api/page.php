<?php
/**
 * Obsidian API
 * Page Endpoints
 * 
 * Provides functions to create a page/post in wordpress (based on elementor)
 */


/**
 * POST page
 */
function create_page( WP_REST_Request $req) {
  $payload = $req->get_json_params();

  $design = $payload['design'];
  $template_id = $design['template'];
  $palette = $design['palette'];
  $font_body = $design['font']['body'];
  $font_heading = $design['font']['heading'];
  
  // Get the template
  $template = get_post( $template_id );

  // Create the wp_post (Page)
  $page_id = wp_insert_post(array(
    'post_author'   => '1',
    'post_title'    => $template->post_title,
    'post_content'  => $template->post_content,
    'post_status'   => 'publish', // Or 'draft', 'pending', etc.
    'post_type'     => 'page',
    'post_name'     => 'New Custom', // Set the slug
  ));
  
  // Check if page was created successfully
  if (!$page_id) {
    echo "Error creating page.";
  }

  // Create the wp_postmeta (Page Elementor config)
  $page_metadata = get_post_meta( $template_id );
  foreach ( $page_metadata as $key => $values ) {
    add_post_meta( $page_id, $key, wp_slash(maybe_unserialize($values[0])) );
  }

  // Trigger Elementor CSS regeneration
  if ( class_exists( '\Elementor\Core\Files\CSS\Post' ) ) {
      $css_file = new \Elementor\Core\Files\CSS\Post( $page_id );
      $css_file->update();
  }

  // Setup the wp_options (Astra Typography)
  $astra_settings = get_option( 'astra-settings', null);
  $astra_settings['body-font-family'] = "'{$font_body}'" . ", sans-serif";
  $astra_settings['headings-font-family'] = "'{$font_heading}'" . ", serif";
  
  // Setup the wp_options (Astra Color Palette)
  $astra_color_palettes = get_option( 'astra-color-palettes', null);
  $palette_selected = $astra_color_palettes['presets'][$palette];
  $astra_settings['global-color-palette']['palette'] = $palette_selected;
  $astra_color_palettes['palettes']['palette_1'] = $palette_selected;
  
  update_option( 'astra-settings', $astra_settings );
  update_option( 'astra-color-palettes', $astra_color_palettes );


  return new WP_REST_Response( array( $page_metadata, $page_id, $astra_settings, $astra_color_palettes ), 200 );
}