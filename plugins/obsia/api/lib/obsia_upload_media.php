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
function obsia_upload_media($url)
{
  require_once ABSPATH . "wp-admin/includes/image.php";

  require_once ABSPATH . "wp-admin/includes/file.php";

  require_once ABSPATH . "wp-admin/includes/media.php";

  $file_data = [];

  $file_data["name"] = basename($url);

  preg_match("/(photo-\d+-\w+)/", $url, $matches);

  if (!empty($matches)) {
    $photo_id = $matches[0];

    $attachments = get_posts([
      "post_type" => "attachment",
      "post_status" => "inherit",
      "posts_per_page" => 1,
      "meta_query" => [
        [
          "key" => "_wp_attached_file",
          "value" => $photo_id,
          "compare" => "LIKE",
        ],
      ],
    ]);

    if (!empty($attachments)) {
      return wp_get_attachment_url($attachments[0]->ID);
    }
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
