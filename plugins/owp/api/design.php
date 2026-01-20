<?php
if (!defined("ABSPATH")) {
  exit();
}
/**
 * Obsidian API
 * Design Endpoints
 *
 * Provides access to elementor pre-made designs library
 */

/**
 * GET designs
 */
function owp_get_designs()
{
  // TODO: Change by reading folders available inside 'designs' folder.
  $DESIGNS_DIR = WP_PLUGIN_DIR . "/owp/designs";

  $posts = get_posts([
    "post_type" => "elementor_library",
    "post_status" => "publish",
  ]);

  $response = [];

  foreach ($posts as $post) {
    // return if fidn default-kit
    if ($post->post_name == "default-kit") {
      continue;
    }

    // return if is not obsidian template
    if (preg_match('/^[oO]bsidian.+$/', $post->post_title) !== 1) {
      continue;
    }

    // get images css ids fields
    $design_name = "aspera";
    $images_json_path = "{$DESIGNS_DIR}/{$design_name}" . "/templatekit/images.json";
    $images_json = [];

    if (file_exists($images_json_path)) {
      $images_json_content = file_get_contents($images_json_path);
      $images_json = json_decode($images_json_content, true);
    }

    array_push($response, [
      "ID" => $post->ID,
      "name" => $design_name,
      "title" => $post->post_title,
      "url" => $post->guid,
      "post_type" => $post->post_type,
      "images_json" => $images_json,
    ]);
  }

  return new WP_REST_Response($response, 200);
}
