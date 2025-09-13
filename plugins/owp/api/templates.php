<?php
/**
 * Obsidian API
 * Template Endpoints
 * 
 * Provides access to elementor pre-made templates library
 */


/**
 * GET templates
 */
function get_templates() {
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