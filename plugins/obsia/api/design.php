<?php
if (!defined("ABSPATH")) {
  exit();
}

/**
 * GET designs
 * Reads available designs from the designs directory.
 * @return WP_REST_Response
 */
function obsia_get_designs()
{
  $designs_dir = OBSIA_PLUGIN_DIR . "designs";
  $plugin_url = OBSIA_PLUGIN_URL . "designs/";
  $response = [];

  if (!is_dir($designs_dir)) {
    return new WP_REST_Response([], 200);
  }

  $folders = scandir($designs_dir);

  foreach ($folders as $folder) {
    if ($folder === "." || $folder === "..") {
      continue;
    }

    $sneakpeak_dir = $designs_dir . "/" . $folder . "/sneakpeak";
    $images_json_path = $designs_dir . "/" . $folder . "/templatekit/images.json";

    if (!is_dir($sneakpeak_dir)) {
      continue;
    }

    $images_json = [];

    if (file_exists($images_json_path)) {
      global $wp_filesystem;

      if (empty($wp_filesystem)) {
        require_once ABSPATH . "wp-admin/includes/file.php";
        WP_Filesystem();
      }

      $images_json_content = $wp_filesystem->get_contents($images_json_path);
      $images_json = json_decode($images_json_content, true);
    }

    $response[] = [
      "ID" => $folder,
      "name" => $folder,
      "title" => ucfirst($folder),
      "url" => $plugin_url . $folder . "/sneakpeak/index.html",
      "thumbnail" => $plugin_url . $folder . "/sneakpeak/thumbnail.png",
      "images_json" => $images_json,
    ];
  }

  return new WP_REST_Response($response, 200);
}
