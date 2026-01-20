<?php

if (!defined("ABSPATH")) {
  exit();
}

/**
 * Uploads media from a URL to the WordPress Media Library.
 *
 * @param string $url The source URL of the image.
 * @return string|WP_Error The attachment URL or WP_Error on failure.
 */
function owp_upload_media($url)
{
  require_once ABSPATH . "wp-admin/includes/image.php";

  require_once ABSPATH . "wp-admin/includes/file.php";

  require_once ABSPATH . "wp-admin/includes/media.php";

  $file_data = [];

  $file_data["name"] = basename($url);

  global $wpdb;

  preg_match("/(photo-\d+-\w+)/", $url, $matches);

  $photo_id = $matches[0];

  $results = $wpdb->get_results(
    $wpdb->prepare(
      "SELECT * FROM {$wpdb->postmeta} WHERE meta_value LIKE %s AND meta_key = %s LIMIT 50",
      "%" . $wpdb->esc_like($photo_id) . "%",
      "_wp_attached_file",
    ),
  );

  if (!empty($results)) {
    $upload_dir = wp_upload_dir();

    $base_url = $upload_dir["baseurl"];

    $full_url = $base_url . "/" . $results[0]->meta_value;

    return $full_url;
  }

  $temp_file = download_url($url);

  if (is_wp_error($temp_file)) {
    return $temp_file;
  }

  $file_data["tmp_name"] = $temp_file;

  $attach_id = media_handle_sideload($file_data, 0);

  if (is_wp_error($attach_id)) {
    wp_delete_file($temp_file);

    return $attach_id;
  }

  $final_url = wp_get_attachment_url($attach_id);

  return $final_url;
}
