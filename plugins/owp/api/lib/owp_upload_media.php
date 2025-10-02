<?php

function owp_upload_media($image_url) {
    require_once(ABSPATH . 'wp-admin/includes/image.php');
    require_once(ABSPATH . 'wp-admin/includes/file.php');
    require_once(ABSPATH . 'wp-admin/includes/media.php');

    $file_array = array();
    $file_array['name'] = basename($image_url);

    // Download file to a temporary location
    $tmp_name = download_url($image_url);

    if (is_wp_error($tmp_name)) {
        return $tmp_name; // Return WP_Error object
    }

    $file_array['tmp_name'] = $tmp_name;

    // Upload the file to WordPress media library
    $id = media_handle_sideload($file_array, 0);

    if (is_wp_error($id)) {
        @unlink($tmp_name); // Delete the temporary file
        return $id; // Return WP_Error object
    }

    // Get the attachment URL
    $image_url = wp_get_attachment_url($id);

    return $image_url;
}