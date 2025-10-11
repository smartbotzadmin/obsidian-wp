<?php
/**
 * Obsidian API
 * Design Endpoints
 * 
 * Provides access to elementor pre-made designs library
 */


/**
 * GET designs
 */
function get_designs() {
  // TODO: Change by reading folders available inside 'designs' folder.
  
  $posts = get_posts( array(
      'post_type'     => 'elementor_library',
      'post_status'   => 'publish',
  ));

  $response = array();

  foreach ( $posts as $post ) {
    if ( $post->post_name == 'default-kit' ) continue;

    array_push( $response, array(
      'ID'    => $post->ID,
      'name'  => $post->post_name,
      'title' => $post->post_title,
      'url'   => $post->guid,
    ));
  }

  return new WP_REST_Response( $response, 200 );
}


/**
 * GET images.json
 */
function get_images_json() {
  $DESIGNS_DIR = WP_PLUGIN_DIR . '/owp/designs';

  // TODO: Iterate over all existing desings

  // TODO: build a json, containing 'css img ids' of every page of every design.

  // TODO:
  $response = array( 'save_here' => 'image_css_ids' );

  return new WP_REST_Response( $response, 200);
}