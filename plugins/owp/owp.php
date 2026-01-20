<?php
/**
 * Plugin Name: Obsidian WP - AI Page Builder
 * Description: A plugin to empower WordPress to create pages rapidly from pre-made templates/themes and fill them with AI-generated text content.
 * Version: 1.0.0
 * Author: Connor, Phillip, Skyking, Mjesbar
 * Text Domain: obsidian-wp
 * License: GPLv2
 */

if (!defined("ABSPATH")) {
  exit();
}

/**
 * Adds a custom button to the WordPress admin bar.
 * @param WP_Admin_Bar $admin_bar The WP_Admin_Bar instance.
 * @return void
 */
function owp_add_admin_bar_button($admin_bar)
{
  $admin_bar->add_node([
    "id" => "owp-create-with-ai",
    "title" => "Create with AI ObsidianWP",
    "href" => admin_url("admin.php?page=owp-app"),
    "meta" => [
      "target" => "_self",
      "class" => "owp-admin-bar-button",
    ],
  ]);
}
add_action("admin_bar_menu", "owp_add_admin_bar_button", 999);

/**
 * Adds custom admin pages for Obsidian WP.
 * @return void
 */
function owp_add_admin_pages()
{
  // Pages option
  add_pages_page(
    __("New AI ObsidianWP", "obsidian-wp"),
    __("New AI ObsidianWP", "obsidian-wp"),
    "manage_options",
    "owp-start-redirect", // Use a unique slug for the redirect page
    "owp_render_app_page", // Temporarily set to render, redirect will handle it
  );
  // Middle admin page to redirect to owp-app
  add_submenu_page(
    null,
    __("Obsidian WP App", "obsidian-wp"),
    __("Obsidian WP App", "obsidian-wp"),
    "manage_options",
    "owp-app",
    "owp_render_app_page",
  );
}
add_action("admin_menu", "owp_add_admin_pages");

/**
 * Handles redirection to owp-app
 * @return void
 */
function owp_handle_pages_menu_redirect()
{
  if (is_admin() && isset($_GET["page"]) && "owp-start-redirect" === $_GET["page"]) {
    wp_redirect(admin_url("admin.php?page=owp-app"));
    exit();
  }
}
add_action("admin_init", "owp_handle_pages_menu_redirect");

/**
 * Renders owp-app
 * @return void
 */
function owp_render_app_page()
{
  wp_enqueue_script("owp-app-script", plugins_url("app/app.js", __FILE__), [], null, true);
  wp_localize_script("owp-app-script", "owp_vars", [
    "plugin_url" => plugins_url("/", __FILE__),
    "rest_nonce" => wp_create_nonce("wp_rest"),
  ]);
  echo "<owp-app></owp-app>";
}

/**
 * Renders the owp design previews, gutenberg sidebar & owp-app
 * with no top adminbar.
 * @return void
 */
add_action("init", "owp_preview_hide_admin_bar");
function owp_preview_hide_admin_bar()
{
  if (
    (isset($_GET["owp-preview"]) && $_GET["owp-preview"] === "true") ||
    (isset($_GET["page"]) && $_GET["page"] === "owp-app")
  ) {
    add_filter("show_admin_bar", "__return_false");
    wp_enqueue_style(
      "owp-hide-admin-bars",
      plugins_url("assets/css/hide-admin-bars.css", __FILE__),
    );
  }
}

/**
 * Enqueues the tailwindcss output.css for global styles.
 * Enqueues all JS owp plugin pages.
 * Enqueues all JS owp plugin components.
 * @return void
 */
function owp_enqueue_components()
{
  // Enqueue Google Fonts
  wp_enqueue_style(
    "owp-google-fonts",
    "https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=DM+Serif+Display:ital@0;1&family=Karla:ital,wght@0,200..800;1,200..800&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Lora:ital,wght@0,400..700;1,400..700&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto:ital,wght@0,100..900;1,100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap",
    [],
    null,
  );

  // Enqueue global style conditionally
  if (
    (isset($_GET["page"]) && $_GET["page"] === "owp-app") ||
    (isset($_GET["action"]) &&
      $_GET["action"] === "edit" &&
      basename($_SERVER["PHP_SELF"]) === "post.php") ||
    (isset($_GET["post_type"]) &&
      $_GET["post_type"] === "page" &&
      basename($_SERVER["PHP_SELF"]) === "post-new.php") ||
    (isset($_GET["owp-preview"]) && $_GET["owp-preview"] === "true")
  ) {
    wp_enqueue_style("owp-output-style", plugins_url("assets/css/output.css", __FILE__));

    // Enqueue Gutenberg Sidebar scripts
    wp_enqueue_script(
      "owp-gutenberg-sidebar",
      plugins_url("gutenberg/sidebar.js", __FILE__),
      [],
      null,
      true,
    );

    // Enqueue Page scripts
    $page_dir = plugin_dir_path(__FILE__) . "app/pages/";
    $page_files = glob($page_dir . "*.js");

    foreach ($page_files as $file) {
      $handle = "owp-page-" . sanitize_title(basename($file, ".js"));
      $src = plugins_url("app/pages/" . basename($file), __FILE__);
      wp_enqueue_script($handle, $src, [], null, true);
    }

    // Enqueue Web Components scripts
    $component_dir = plugin_dir_path(__FILE__) . "components/";
    $component_files = glob($component_dir . "*.js");

    foreach ($component_files as $file) {
      $handle = "owp-component-" . sanitize_title(basename($file, ".js"));
      $src = plugins_url("components/" . basename($file), __FILE__);
      wp_enqueue_script($handle, $src, [], null, true);
    }
  }
}
add_action("wp_enqueue_scripts", "owp_enqueue_components");
add_action("admin_enqueue_scripts", "owp_enqueue_components");
add_action("enqueue_block_editor_assets", "owp_enqueue_components");

/**
 * Register plugin API endpoints
 * @return void
 */
function owp_register_api_endpoints()
{
  // get_designs
  register_rest_route("owp/api", "/designs", [
    "methods" => "GET",
    "callback" => "owp_get_designs",
    "permission_callback" => "__return_true",
  ]);

  // create_page
  register_rest_route("owp/api", "/page", [
    "methods" => "POST",
    "callback" => "owp_create_page",
    "permission_callback" => "__return_true",
  ]);
}
add_action("rest_api_init", "owp_register_api_endpoints");

require_once plugin_dir_path(__FILE__) . "api/design.php";
require_once plugin_dir_path(__FILE__) . "api/page.php";
