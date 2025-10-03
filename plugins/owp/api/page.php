<?php
/**
 * Obsidian API
 * Page Endpoints
 * 
 * Provides functions to create a page/post in wordpress (based on elementor)
 */

require_once plugin_dir_path( __FILE__ ) . 'lib/owp_generate_content.php';
require_once plugin_dir_path( __FILE__ ) . 'lib/owp_hydrate_content.php';


/**
 * POST page
 */
function create_page( WP_REST_Request $req ) {

  if ( ! defined( 'ELEMENTOR_PATH' ) ) {
    return new WP_REST_Response(array(
        'error' => 'Elementor Plugin not installed.',
    ), 200);
  }

  $payload = $req->get_json_params();

  
  // 1. extract fields
  $start = $payload['start'];
  $describe = $payload['describe'];
  $contact = $payload['contact'];
  $design = $payload['design'];
  $pictures = $payload['pictures'];

  $design_dir = WP_PLUGIN_DIR . "/owp/designs";
  $design_name = str_replace('obsidian', '', strtolower($design['name']));
  $design_page_dir = "{$design_dir}/{$design_name}/templatekit";

  
  // 2. Prepare fyi, fields & images CSS IDs for AI content request
  $fields_file = file_get_contents("{$design_page_dir}/fields.json");
  $fields_json = json_decode($fields_file, true);  // array

  $images_file = file_get_contents("{$design_page_dir}/images.json");
  $images_json = json_decode($images_file, true);  // array
  
  unset($payload['pictures']);
  unset($payload['design']);
  $fyi_json = $payload;

  
  // 3. AI content generation from 'Gemini', fill the fields json
  $body = array(
    'fyi'     => $fyi_json,
    'fields'  => $fields_json
  );

  $ai_content = owp_generate_content( $body );

  if ( ! $ai_content ) {
    return new WP_REST_Response(array(
        'error'     => 'AI Content generation error.',
        'response'  => $ai_content
    ), 500);
  }

  $ai_content = json_decode( $ai_content, true );


  // 4. Process for every page of the template kit
  $pages = array('home', 'services', 'contact', 'about');
  $created = array(
    'home'      => '',
    'services'  => '',
    'contact'   => '',
    'about'     => ''
  );

  foreach ( $pages as $page ){
    // Load template json
    $design_page_dir = "{$design_dir}/{$design_name}/templatekit/{$page}";
    $template_json_file = 
      file_get_contents("{$design_page_dir}/template.json");
    $template_json = json_decode($template_json_file, true);  // elementor data
    $elementor_data = $template_json['content'];

    // current CSS IDs fields - contents: IA generated text
    $fields = $ai_content[$page];
    // $fields = $fields_json[$page];

    // current CSS IDs imgs - contents: Picked images urls
    $images = $images_json[$page];
    $index = 0;
    foreach ( $images as $key => &$value ) {
      $value = $pictures['merge'][$index]['urls']['raw'] . '.jpg';
      $index++;
    }

    // Hydrate templates
    owp_hydrate_content( $elementor_data, $fields, $images);

    // create empty wp page post
    $new_page = wp_insert_post([
        'post_title' => 'Obsidian' . " {$design_name} " . $page,
        'post_status' => 'publish',
        'post_type' => 'page',
        'post_content' => ''
    ]);
    $post_id = is_wp_error( $new_page ) ? 0 : $new_page;

    // elementor settings
     if ( $post_id > 0 ) {
        // Create Elementor page settings (_elementor_page_settings)
        $page_settings = [
          'page_layout' => 'elementor_canvas', // Use 'elementor_canvas' layout
          'hide_title' => 'yes', 
        ];
        update_post_meta(
          $post_id, '_elementor_page_settings', $page_settings
        );
        
        // Create Elementor pages from 'template.json' (_elementor_data)
        update_post_meta( $post_id, '_elementor_data', $elementor_data );
        update_post_meta( $post_id, '_elementor_edit_mode', 'builder' );
        update_post_meta( $post_id, '_wp_page_template', 'elementor_canvas' );
        update_post_meta( $post_id, '_elementor_version', ELEMENTOR_VERSION );
        update_post_meta( $post_id, '_elementor_template_type', 'page' );
        update_post_meta( $post_id, 'site-post-title', 'disabled' );
    }

    $created[$page] = get_permalink( $post_id );
  }


  // 5. Setup Astra Typography & Astra Color Palette (wp_options)
  
  // fonts
  $astra_settings = get_option( 'astra-settings', null);
  
  $astra_settings['body-font-family'] =
    "'{$design['font']['body']}, sans-serif";
  $astra_settings['headings-font-family'] =
    "'{$design['font']['heading']}, serif";

  // palette
  $astra_color_palettes = get_option( 'astra-color-palettes', []);

  $palette_selected = $astra_color_palettes['presets'][$design['palette']];
  $astra_settings['global-color-palette']['palette'] = $palette_selected;
  $astra_color_palettes['palettes']['palette_1'] = $palette_selected;
  
  update_option( 'astra-settings', $astra_settings );
  update_option( 'astra-color-palettes', $astra_color_palettes );


  // * Clear Elementor cache
  \Elementor\Plugin::instance()->files_manager->clear_cache();

  return new WP_REST_Response(array(
    'created' => $created
  ), 200);






















  // $design = $payload['design'];
  // $template_id = $design['template'];
  // $palette = $design['palette'];
  // $font_body = $design['font']['body'];
  // $font_heading = $design['font']['heading'];
  
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

  // Clear Elementor cache
  // \Elementor\Plugin::instance()->files_manager->clear_cache();

  // Setup Astra Typography & Astra Color Palette (wp_options)
  // $astra_settings = get_option( 'astra-settings', null);
  // $astra_settings['body-font-family'] = "'{$font_body}'" . ", sans-serif";
  // $astra_settings['headings-font-family'] = "'{$font_heading}'" . ", serif";

  // $astra_color_palettes = get_option( 'astra-color-palettes', null);
  // $palette_selected = $astra_color_palettes['presets'][$palette];
  // $astra_settings['global-color-palette']['palette'] = $palette_selected;
  // $astra_color_palettes['palettes']['palette_1'] = $palette_selected;
  
  // update_option( 'astra-settings', $astra_settings );
  // update_option( 'astra-color-palettes', $astra_color_palettes );


  // return new WP_REST_Response(array(
  //     'payload' => $payload,
  //     'template_dir' => $template_dir
  // ), 200);
}