<?php
/**
 * Plugin Name: Obsidian AI Page Builder
 * Description: A plugin to empower WordPress to create pages rapidly from pre-made templates/themes and fill them with AI-generated text content.
 * Version: 1.0.0
 * Author: Connor, Skyking, Mjesbar
 * Text Domain: obsia
 * License: GPLv2
 */

if (!defined("ABSPATH")) {
  exit();
}

define("OBSIA_PLUGIN_FILE", __FILE__);
define("OBSIA_PLUGIN_DIR", plugin_dir_path(__FILE__));
define("OBSIA_PLUGIN_URL", plugin_dir_url(__FILE__));

/**
 * Installs required dependencies on plugin activation.
 * @return void
 */
function obsia_install_dependencies()
{
  include_once ABSPATH . "wp-admin/includes/plugin-install.php";
  include_once ABSPATH . "wp-admin/includes/plugin.php";
  include_once ABSPATH . "wp-admin/includes/file.php";
  include_once ABSPATH . "wp-admin/includes/class-wp-upgrader.php";
  include_once ABSPATH . "wp-admin/includes/theme-install.php";
  include_once ABSPATH . "wp-admin/includes/theme.php";

  if (!class_exists("Automatic_Upgrader_Skin")) {
    include_once ABSPATH . "wp-admin/includes/class-wp-upgrader-skins.php";
  }

  if (!function_exists("WP_Filesystem")) {
    require_once ABSPATH . "wp-admin/includes/file.php";
  }

  WP_Filesystem();

  $plugins = [
    "elementor" => "elementor/elementor.php",
    "astra-widgets" => "astra-widgets/astra-widgets.php",
  ];

  foreach ($plugins as $slug => $file) {
    if (!file_exists(WP_PLUGIN_DIR . "/" . $file)) {
      $api = plugins_api("plugin_information", [
        "slug" => $slug,
        "fields" => ["sections" => false],
      ]);

      if (!is_wp_error($api)) {
        $upgrader = new Plugin_Upgrader(new Automatic_Upgrader_Skin());

        $upgrader->install($api->download_link);
      }
    }

    if (file_exists(WP_PLUGIN_DIR . "/" . $file) && !is_plugin_active($file)) {
      activate_plugin($file);
      if ($slug === "elementor") {
        delete_transient("elementor_activation_redirect");
        update_option("elementor_setup_status", "completed");
      }
    }
  }

  if (wp_get_theme()->get_template() !== "astra") {
    $theme = wp_get_theme("astra");

    if (!$theme->exists()) {
      $api = themes_api("theme_information", [
        "slug" => "astra",
        "fields" => ["sections" => false],
      ]);

      if (!is_wp_error($api)) {
        $upgrader = new Theme_Upgrader(new Automatic_Upgrader_Skin());

        $upgrader->install($api->download_link);
      }
    }

    if (wp_get_theme("astra")->exists()) {
      switch_theme("astra");
    }
  }
}

register_activation_hook(OBSIA_PLUGIN_FILE, "obsia_install_dependencies");

/**
 * Adds a custom button to the WordPress admin bar.
 * @param WP_Admin_Bar $admin_bar The WP_Admin_Bar instance.
 * @return void
 */
function obsia_add_admin_bar_button($admin_bar)
{
  $admin_bar->add_node([
    "id" => "obsia-create-with-ai",
    "title" => "Create with AI Obsidian",
    "href" => admin_url("admin.php?page=obsia-app"),
    "meta" => [
      "target" => "_self",
      "class" => "obsia-admin-bar-button",
    ],
  ]);
}
add_action("admin_bar_menu", "obsia_add_admin_bar_button", 999);

/**
 * Adds custom admin pages for Obsidian.
 * @return void
 */
function obsia_add_admin_pages()
{
  // Pages option
  add_pages_page(
    __("New AI Obsidian", "obsia"),
    __("New AI Obsidian", "obsia"),
    "manage_options",
    "obsia-start-redirect", // Use a unique slug for the redirect page
    "obsia_render_app_page", // Temporarily set to render, redirect will handle it
  );
  // Middle admin page to redirect to obsia-app
  add_submenu_page(
    null,
    __("Obsidian App", "obsia"),
    __("Obsidian App", "obsia"),
    "manage_options",
    "obsia-app",
    "obsia_render_app_page",
  );
}
add_action("admin_menu", "obsia_add_admin_pages");

/**
 * Handles redirection to obsia-app
 * @return void
 */
function obsia_handle_pages_menu_redirect()
{
  // phpcs:disable WordPress.Security.NonceVerification.Recommended
  $obsia_page = isset($_GET["page"]) ? sanitize_text_field(wp_unslash($_GET["page"])) : "";
  // phpcs:enable WordPress.Security.NonceVerification.Recommended

  if (is_admin() && "obsia-start-redirect" === $obsia_page) {
    wp_safe_redirect(admin_url("admin.php?page=obsia-app"));
    exit();
  }
}
add_action("admin_init", "obsia_handle_pages_menu_redirect");

/**
 * Renders obsia-app
 * @return void
 */
function obsia_render_app_page()
{
  wp_enqueue_script(
    "obsia-app-script",
    plugins_url("app/app.js", OBSIA_PLUGIN_FILE),
    [],
    null,
    true,
  );
  wp_localize_script("obsia-app-script", "obsia_vars", [
    "plugin_url" => OBSIA_PLUGIN_URL,
    "rest_nonce" => wp_create_nonce("wp_rest"),
  ]);
  echo "<obsia-app></obsia-app>";
}

/**
 * Renders the obsia design previews, gutenberg sidebar & obsia-app
 * with no top adminbar.
 * @return void
 */
add_action("init", "obsia_preview_hide_admin_bar");
function obsia_preview_hide_admin_bar()
{
  // phpcs:disable WordPress.Security.NonceVerification.Recommended
  $obsia_preview = isset($_GET["obsia-preview"])
    ? sanitize_text_field(wp_unslash($_GET["obsia-preview"]))
    : "";
  $obsia_page = isset($_GET["page"]) ? sanitize_text_field(wp_unslash($_GET["page"])) : "";
  // phpcs:enable WordPress.Security.NonceVerification.Recommended

  if ($obsia_preview === "true" || $obsia_page === "obsia-app") {
    add_filter("show_admin_bar", "__return_false");
    wp_enqueue_style(
      "obsia-hide-admin-bars",
      plugins_url("assets/css/hide-admin-bars.css", OBSIA_PLUGIN_FILE),
    );
  }
}

/**
 * Enqueues the tailwindcss output.css for global styles.
 * Enqueues all JS obsia plugin pages.
 * Enqueues all JS obsia plugin components.
 * @return void
 */
function obsia_enqueue_components()
{
  global $pagenow;

  // Enqueue Google Fonts
  wp_enqueue_style(
    "obsia-google-fonts",
    "https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=DM+Serif+Display:ital@0;1&family=Karla:ital,wght@0,200..800;1,200..800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap",
    [],
    null,
  );

  // Enqueue global style conditionally
  // phpcs:disable WordPress.Security.NonceVerification.Recommended
  $obsia_page = isset($_GET["page"]) ? sanitize_text_field(wp_unslash($_GET["page"])) : "";
  $obsia_action = isset($_GET["action"]) ? sanitize_text_field(wp_unslash($_GET["action"])) : "";
  $obsia_post_type = isset($_GET["post_type"])
    ? sanitize_text_field(wp_unslash($_GET["post_type"]))
    : "";
  $obsia_preview = isset($_GET["obsia-preview"])
    ? sanitize_text_field(wp_unslash($_GET["obsia-preview"]))
    : "";
  // phpcs:enable WordPress.Security.NonceVerification.Recommended

  if (
    $obsia_page === "obsia-app" ||
    ($obsia_action === "edit" && "post.php" === $pagenow) ||
    ($obsia_post_type === "page" && "post-new.php" === $pagenow) ||
    $obsia_preview === "true"
  ) {
    wp_enqueue_style("obsia-output-style", plugins_url("assets/css/output.css", OBSIA_PLUGIN_FILE));

    // Enqueue Gutenberg Sidebar scripts
    wp_enqueue_script(
      "obsia-gutenberg-sidebar",
      plugins_url("gutenberg/sidebar.js", OBSIA_PLUGIN_FILE),
      [],
      null,
      true,
    );

    // Enqueue Page scripts
    $page_dir = OBSIA_PLUGIN_DIR . "app/pages/";
    $page_files = glob($page_dir . "*.js");

    foreach ($page_files as $file) {
      $handle = "obsia-page-" . sanitize_title(basename($file, ".js"));
      $src = plugins_url("app/pages/" . basename($file), OBSIA_PLUGIN_FILE);
      wp_enqueue_script($handle, $src, [], null, true);
    }

    // Enqueue Web Components scripts
    $component_dir = OBSIA_PLUGIN_DIR . "components/";
    $component_files = glob($component_dir . "*.js");

    foreach ($component_files as $file) {
      $handle = "obsia-component-" . sanitize_title(basename($file, ".js"));
      $src = plugins_url("components/" . basename($file), OBSIA_PLUGIN_FILE);
      wp_enqueue_script($handle, $src, [], null, true);
    }
  }
}
add_action("wp_enqueue_scripts", "obsia_enqueue_components");
add_action("admin_enqueue_scripts", "obsia_enqueue_components");
add_action("enqueue_block_editor_assets", "obsia_enqueue_components");

/**
 * Register plugin API endpoints
 * @return void
 */
function obsia_register_api_endpoints()
{
  // get_designs
  register_rest_route("obsia/api", "/designs", [
    "methods" => "GET",
    "callback" => "obsia_get_designs",
    "permission_callback" => "__return_true",
  ]);

  // create_page
  register_rest_route("obsia/api", "/page", [
    "methods" => "POST",
    "callback" => "obsia_create_page",
    "permission_callback" => "__return_true",
  ]);
}
add_action("rest_api_init", "obsia_register_api_endpoints");

require_once OBSIA_PLUGIN_DIR . "api/design.php";
require_once OBSIA_PLUGIN_DIR . "api/page.php";
