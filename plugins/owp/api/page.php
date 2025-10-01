<?php
/**
 * Obsidian API
 * Page Endpoints
 * 
 * Provides functions to create a page/post in wordpress (based on elementor)
 */

require_once plugin_dir_path( __FILE__ ) . 'lib/owp_upload_media.php';
require_once plugin_dir_path( __FILE__ ) . 'lib/image_hydration_elementor.php';


/**
 * POST page
 */
function create_page( WP_REST_Request $req) {

  if ( ! defined( 'ELEMENTOR_PATH' ) ) {
    return new WP_REST_Response(array(
        'error' => 'Elementor Plugin not installed.',
    ), 200);
  }

  $payload = $req->get_json_params();

  $design = $payload['design'];
  $template_id = $design['template'];
  $palette = $design['palette'];
  $font_body = $design['font']['body'];
  $font_heading = $design['font']['heading'];
  
  // // Get the elemetor template
  // $template = get_post( $template_id );

  // // Hydrate template with selected images
  // $dom = new DOMDocument();
  // libxml_use_internal_errors(true); 
  // $dom->loadHTML(
  //   $template->post_content,
  //   LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
  // );
  // libxml_clear_errors();

  // $images = $dom->getElementsByTagName('img');
  // $pictures = $payload['pictures']['selected'];
  // $uploaded_pictures = array();

  // foreach ($images as $img) {
  //   $src = $img->getAttribute('src');
  //   if (preg_match('/image(\d+)\.(webp|png|jpg)/', $src, $matches)) {
  //     $image_index = $matches[1]; // digit match (\d+)
  //     $picture_url = $pictures[$image_index - 1]['urls']['raw'] . '.jpg';
  //     $uploaded_picture_url = owp_upload_media( $picture_url );
  //     $img->setAttribute( 'src', $uploaded_picture_url );
  //     $uploaded_pictures[] = $uploaded_picture_url;
  //   } 
  // }

  // $template->post_content = $dom->saveHTML();

  // // Create the wp_post (Page)
  // $page_id = wp_insert_post(array(
  //   'post_author'   => '1',
  //   'post_title'    => $template->post_title,
  //   'post_content'  => $template->post_content,
  //   'post_status'   => 'publish', // Or 'draft', 'pending', etc.
  //   'post_type'     => 'page',
  //   'post_name'     => $template->post_name, // Set the slug
  // ));

  // if (!$page_id) {
  //   echo "Error creating page.";
  // }

  // // Create the wp_postmeta (Page Elementor config)
  // $page_metadata = get_post_meta( $template_id );
  // foreach ( $page_metadata as $key => $values ) {
  //   add_post_meta( $page_id, $key, wp_slash(maybe_unserialize($values[0])) );
  // }

  // // Hydrate Elemetor data with images
  // $elementor_data = json_decode( $page_metadata['_elementor_data'][0], true );
  // image_hydration_elementor( $elementor_data, $uploaded_pictures );
  // update_post_meta( $page_id, '_elementor_data', json_encode($elementor_data));

  // Hydrate templates
  // TODO: 1. Fetch AI text content from 'Gemini'
  //        - Gemini AI request.
  // TODO: 2. Fetch selected and default images from 'Creation flow'
  // TODO: 3. Hydrate AI content & images into every 'template.json'
  //        - upload images as media.
  //        - populate images where CSS_ID applies.
  //        - populate AI content where CSS_ID applies.
  // TODO: 4. Create Elementor page settings (_elementor_page_settings)
  //        - don't forget add "canvas = true"
  // TODO: 5. Create Elementor pages from 'template.json' (_elementor_data)

  // Clear Elementor cache
  \Elementor\Plugin::instance()->files_manager->clear_cache();

  // Setup Astra Typography & Astra Color Palette (wp_options)
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
      'page_id'         => $page_id,
      'updated_elementor_data' => $elementor_data
    ),
    200
  );
}