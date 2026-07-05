=== Obsidian Space AI Page Builder ===
Contributors: obsidianwebsitebuilder
Tags: ai, website builder, page builder, elementor, gemini
Requires at least: 5.0
Tested up to: 6.9
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Obsidian empowers WordPress to create pages rapidly from pre-made templates/themes and fill them with AI-generated text content.

== Description ==

Obsidian is a powerful plugin designed to streamline the website creation process within WordPress. It leverages AI to generate content for your pages and integrates with pre-designed templates to build stunning websites quickly.

**Key Features:**
*   Rapid page creation using AI-generated content.
*   Integration with pre-made Elementor templates.
*   Customizable design options including fonts and color palettes.

== External services ==

This plugin connects to external APIs to provide AI-powered content generation, user authentication, analytics, and design resources.

**Obsidian AI & Account Services**
This service is provided by "Obsidian Website Builder": [public repository](https://github.com/smartbotzadmin/obsidian-wp). It is used for authentication, content generation, and subscription management.
*   **Endpoints:** Various subdomains under `*.us-east1.run.app` (e.g., `obsidian-signin`, `obsidian-signup`, `obsidian-content-generator`).
*   **Data sent:** User credentials (email/password), session tokens, business name, business description, and keywords.
*   **When:** During account creation, login, session validation, AI content generation requests, and billing status checks.

**Google Gemini AI**
This service is provided by "Google": [terms of use](https://policies.google.com/terms), [privacy policy](https://policies.google.com/privacy). This AI model generates textual content based on user input, accessed via the Obsidian API.
*   **Data sent:** Business descriptions and keywords provided by the user.
*   **When:** Triggered when the user requests AI-generated content.

**Google OAuth**
This service is provided by "Google": [terms of use](https://developers.google.com/terms/api-services-user-data-policy), [privacy policy](https://policies.google.com/privacy). It provides a secure "Sign in with Google" option.
*   **Data sent:** Google profile information (email and name).
*   **When:** When the user chooses to authenticate using their Google account.

**Stripe Payments**
This service is provided by "Stripe": [terms of use](https://stripe.com/legal/ssa), [privacy policy](https://stripe.com/privacy). It is our payment processing partner for handling subscription billing.
*   **Data sent:** User identifier/email and origin URL for redirection.
*   **When:** During the checkout process or when managing subscription settings.

**Unsplash Images**
This service is provided by "Unsplash": [terms of use](https://unsplash.com/terms), [privacy policy](https://unsplash.com/privacy). It provides high-quality photography for website designs.
*   **Data sent:** Search keywords.
*   **When:** During initial page generation to find relevant visual assets.

=== Build Process ===

This plugin uses Tailwind CSS (v4) for styling. All original source files and build instructions are included in the plugin package and the public repository.

*   **Source CSS:** `assets/css/input.css`
*   **Generated CSS:** `assets/css/output.css`
*   **Build Tool:** Tailwind CSS CLI
*   **Build Command:** `npx @tailwindcss/cli -i ./assets/css/input.css -o ./assets/css/output.css`

All JavaScript files within the `app/` and `components/` directories are provided in their original, human-readable source form and are not minified, obfuscated, or compiled by any build tool.

== Installation ==

1.  Upload the `obsia` folder to the `/wp-content/plugins/` directory.
2.  Activate the plugin through the 'Plugins' menu in WordPress.
3.  Ensure Elementor Page Builder is installed and activated for full functionality.
4.  Navigate to the 'Obsidian' admin page to start creating your AI-powered website.

== Frequently Asked Questions ==

= Does this plugin require Elementor? =
Yes, Obsidian is designed to work with Elementor Page Builder. Please ensure Elementor is installed and active for the plugin to function correctly.

= What data is sent to external AI services? =
Only the descriptions and keywords you provide for content generation are sent to Google Gemini via our secure proxy. No personal identification information is transmitted to the AI models.

= How does the plugin handle images? =
The plugin integrates with Unsplash to provide image suggestions based on your input. Image URLs are retrieved and used in your page designs.

= Is my payment information secure? =
Yes, all payment processing is handled securely by Stripe. Your sensitive payment details are not stored by Obsidian.

== Changelog ==

= 1.0.0 =
*   Initial release.
