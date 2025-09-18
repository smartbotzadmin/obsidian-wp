<?php
/**
 * Obsidian API
 * Page Endpoints
 * 
 * Provides functions to create a page/post in wordpress (based on elementor)
 */

require_once plugin_dir_path( __FILE__ ) . 'lib/upload_media.php';
require_once plugin_dir_path( __FILE__ ) . 'lib/image_hydration_elementor.php';


/**
 * POST page
 */
function create_page( WP_REST_Request $req) {
  $payload = $req->get_json_params();

  $pictures = $payload['pictures'];

  $design = $payload['design'];
  $template_id = $design['template'];
  $palette = $design['palette'];
  $font_body = $design['font']['body'];
  $font_heading = $design['font']['heading'];
  
  // Get the template
  $template = get_post( $template_id );

  // Hydrate template with selected images
  $image_url = $pictures[0]['urls']['raw'] . '.jpg';
  $uploaded_image = upload_media( $image_url );



    // Create a DOMDocument to parse the HTML
    $dom = new DOMDocument();
    // Suppress warnings for malformed HTML
    libxml_use_internal_errors(true); 
    $dom->loadHTML(
      $template->post_content,
      LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
    );
    libxml_clear_errors();

    // Get all img tags
    $images = $dom->getElementsByTagName('img');

    foreach ($images as $img) {
        // Change the src attribute
        $img->setAttribute('src', $uploaded_image); 
        // You can add more complex logic here to determine the new src
    }

    // Save the modified HTML back to a string
    // $modified_content = $dom->saveHTML();
    $template->post_content = $dom->saveHTML();




  // Hydrate template with AI content
  // TODO:

  // Create the wp_post (Page)
  $page_id = wp_insert_post(array(
    'post_author'   => '1',
    'post_title'    => $template->post_title,
    'post_content'  => $template->post_content,
    'post_status'   => 'publish', // Or 'draft', 'pending', etc.
    'post_type'     => 'page',
    'post_name'     => $template->post_name, // Set the slug
  ));

  if (!$page_id) {
    echo "Error creating page.";
  }

  // Create the wp_postmeta (Page Elementor config)
  $page_metadata = get_post_meta( $template_id );
  foreach ( $page_metadata as $key => $values ) {
    add_post_meta( $page_id, $key, wp_slash(maybe_unserialize($values[0])) );
  }

  // Hydrate Elemetor data with images
  $elementor_data = json_decode( $page_metadata['_elementor_data'][0], true );
  image_hydration_elementor( $elementor_data, $uploaded_image );
  update_post_meta( $page_id, '_elementor_data', json_encode($elementor_data));

  // Clear Elementor cache
  if (class_exists('\Elementor\Plugin')) {
    \Elementor\Plugin::instance()->files_manager->clear_cache();
  }


  // Setup the wp_options (Astra Typography & Astra Color Palette)
  $astra_settings = get_option( 'astra-settings', null);
  $astra_settings['body-font-family'] = "'{$font_body}'" . ", sans-serif";
  $astra_settings['headings-font-family'] = "'{$font_heading}'" . ", serif";

  $astra_color_palettes = get_option( 'astra-color-palettes', null);
  $palette_selected = $astra_color_palettes['presets'][$palette];
  $astra_settings['global-color-palette']['palette'] = $palette_selected;
  $astra_color_palettes['palettes']['palette_1'] = $palette_selected;
  
  update_option( 'astra-settings', $astra_settings );
  update_option( 'astra-color-palettes', $astra_color_palettes );


  return new WP_REST_Response(
    array(
      'page_id'         =>$page_id,
      'url'             => 'http://localhost:10005/' . $template->post_name,
      'image_url'       => $image_url,
      'uploaded_image'  => $uploaded_image,
      'updated_elementor_data' => $elementor_data
    ),
    200
  );
}