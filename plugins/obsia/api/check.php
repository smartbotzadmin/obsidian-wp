<?php
if (!defined("ABSPATH")) {
  exit();
}

/**
 * Checks if Astra Theme is installed and activated.
 * @return WP_REST_Response
 */
function obsia_check_astra()
{
  $theme = wp_get_theme();
  $is_active = $theme->get_template() === "astra" || $theme->get_stylesheet() === "astra";

  return new WP_REST_Response(
    [
      "installed" => wp_get_theme("astra")->exists(),
      "activated" => $is_active,
    ],
    200,
  );
}

/**
 * Checks if Elementor Plugin is installed and activated.
 * @return WP_REST_Response
 */
function obsia_check_elementor()
{
  if (!function_exists("is_plugin_active")) {
    require_once ABSPATH . "wp-admin/includes/plugin.php";
  }

  $path = "elementor/elementor.php";
  $installed = file_exists(WP_PLUGIN_DIR . "/" . $path);
  $activated = is_plugin_active($path);

  return new WP_REST_Response(
    [
      "installed" => $installed,
      "activated" => $activated,
    ],
    200,
  );
}
