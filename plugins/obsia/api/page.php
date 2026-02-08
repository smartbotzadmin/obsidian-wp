<?php
if (!defined("ABSPATH")) {
  exit();
}
/**
 * Obsidian API
 * Page Endpoints
 *
 * Provides functions to create a page/post in wordpress (based on elementor)
 */

require_once plugin_dir_path(__FILE__) . "lib/obsia_generate_content.php";
require_once plugin_dir_path(__FILE__) . "lib/obsia_hydrate_content.php";

/**
 * POST page
 */
function obsia_create_page(WP_REST_Request $req)
{
  if (!defined("ELEMENTOR_PATH")) {
    return new WP_REST_Response(["error" => "Elementor Plugin not installed."], 200);
  }

  $payload = $req->get_json_params();

  // 1. extract and sanitize fields
  $start = is_array($payload["start"]) ? array_map("sanitize_text_field", $payload["start"]) : [];
  $describe = sanitize_text_field($payload["describe"]);
  $contact = is_array($payload["contact"])
    ? array_map("sanitize_text_field", $payload["contact"])
    : [];

  // Ensure $design is an array before accessing its keys
  $design = is_array($payload["design"]) ? $payload["design"] : [];
  $pictures = is_array($payload["pictures"]) ? $payload["pictures"] : [];

  $design_dir = OBSIA_PLUGIN_DIR . "designs";
  // Sanitize design name for use in file paths
  $design_name = sanitize_title(str_replace("obsidian", "", strtolower($design["name"] ?? "")));
  $design_page_dir = "{$design_dir}/{$design_name}/templatekit";

  // 2. Prepare fyi, fields & images CSS IDs for AI content request
  global $wp_filesystem;

  if (empty($wp_filesystem)) {
    require_once ABSPATH . "wp-admin/includes/file.php";
    WP_Filesystem();
  }

  $fields_file = $wp_filesystem->get_contents("{$design_page_dir}/fields.json");
  $fields_json = json_decode($fields_file, true); // array

  $images_file = $wp_filesystem->get_contents("{$design_page_dir}/images.json");
  $images_json = json_decode($images_file, true); // array

  unset($payload["pictures"]);
  unset($payload["design"]);
  $fyi_json = $payload;

  // 3. AI content generation from 'Gemini', fill the fields json
  $authorization_header = $req->get_header("authorization");
  $body = [
    "fyi" => $fyi_json,
    "fields" => $fields_json,
  ];

  $ai_content = obsia_generate_content($body, $authorization_header);

  if (!$ai_content) {
    return new WP_REST_Response(
      [
        "error" => "AI Content generation error.",
        "response" => $ai_content,
      ],
      500,
    );
  }

  $ai_content = json_decode($ai_content, true);

  // 4. Process for every page of the template kit
  $pages = ["home", "services", "contact", "about"];
  $created = [
    "home" => "",
    "services" => "",
    "contact" => "",
    "about" => "",
  ];

  foreach ($pages as $page) {
    // Load template json
    $design_page_dir = "{$design_dir}/{$design_name}/templatekit/{$page}";
    $template_json_file = $wp_filesystem->get_contents("{$design_page_dir}/template.json");
    $template_json = json_decode($template_json_file, true); // elementor data
    $elementor_data = $template_json["content"];

    // current CSS IDs fields - contents: IA generated text
    $fields = $ai_content[$page];
    // $fields = $fields_json[$page];

    // current CSS IDs imgs - contents: Picked images urls
    $images = $images_json[$page];
    $index = 0;
    foreach ($images as $key => &$value) {
      // Sanitize image URLs
      $raw_url = $pictures["merge"][$index]["urls"]["raw"] ?? "";
      $value = esc_url_raw($raw_url . ".jpg");
      $index++;
    }

    // Sanitize AI generated content fields before hydration
    foreach ($fields as $field_key => &$field_value) {
      if (is_string($field_value)) {
        $field_value = sanitize_text_field($field_value);
      }
    }

    // Hydrate templates
    obsia_hydrate_content($elementor_data, $fields, $images);

    // create empty wp page post
    $new_page = wp_insert_post([
      "post_title" => "Obsidian" . " {$design_name} " . $page,
      "post_status" => "publish",
      "post_type" => "page",
      "post_content" => "",
    ]);
    $post_id = is_wp_error($new_page) ? 0 : $new_page;

    // Elementor settings

    // Disable default Elementor colors, use Astra colors instead.
    update_option("elementor_disable_color_schemes", "yes");
    // Disable default Elementor fonts,, use Astra theme fonts instead.
    update_option("elementor_disable_typography_schemes", "yes");

    if ($post_id > 0) {
      // Create Elementor page settings (_elementor_page_settings)
      $page_settings = [
        "page_layout" => "elementor_canvas", // Use 'elementor_canvas' layout
        "hide_title" => "yes",
      ];
      update_post_meta($post_id, "_elementor_page_settings", $page_settings);

      // Create Elementor pages from 'template.json' (_elementor_data)
      update_post_meta($post_id, "_elementor_data", json_encode($elementor_data));
      update_post_meta($post_id, "_elementor_edit_mode", "builder");
      update_post_meta($post_id, "_wp_page_template", "elementor_canvas");
      update_post_meta($post_id, "_elementor_version", ELEMENTOR_VERSION);
      update_post_meta($post_id, "_elementor_template_type", "page");
      update_post_meta($post_id, "site-post-title", "disabled");
      update_post_meta($post_id, "_elementor_css", "");
    }

    $created[$page] = get_permalink($post_id);
  }

  // 5. Setup Astra Typography & Astra Color Palette (wp_options)

  // fonts
  $astra_settings = get_option("astra-settings", null);

  $astra_settings["body-font-family"] = $design["font"]["body"];
  $astra_settings["headings-font-family"] = $design["font"]["heading"];

  // palette
  $astra_color_palettes = get_option("astra-color-palettes", []);

  // If the option is empty/null, use Astra API to generate the default presets
  if (empty($astra_color_palettes) || !isset($astra_color_palettes["presets"])) {
    if (!function_exists("astra_get_palette_presets")) {
      require_once get_template_directory() . "/inc/customizer/class-astra-customizer-helpers.php";
    }
    $astra_color_palettes = [
      "currentPalette" => "palette_1",
      "palettes" => ["palette_1" => []],
      "presets" => astra_get_palette_presets(),
      "presetNames" => [
        "palette_1" => null,
        "palette_2" => "Oak",
        "palette_3" => "Viola",
        "palette_4" => "Dark",
      ],
      "flag" => 1,
    ];
  }

  // Clear Astra Theme CSS Cache
  if (is_callable(["Astra_Minify", "refresh_assets"])) {
    Astra_Minify::refresh_assets();
  }

  // Dude astra team confused Birch with Brich.
  if ($design["palette"] == "Brich") {
    $design["palette"] = "Birch";
  }

  $palette_selected = $astra_color_palettes["presets"][$design["palette"]];
  $astra_settings["global-color-palette"]["palette"] = $palette_selected;
  $astra_color_palettes["palettes"]["palette_1"] = $palette_selected;

  update_option("astra-settings", $astra_settings);
  update_option("astra-color-palettes", $astra_color_palettes);

  // * Clear Elementor cache
  \Elementor\Plugin::instance()->files_manager->clear_cache();

  return new WP_REST_Response(
    [
      "created" => $created,
    ],
    200,
  );
}
