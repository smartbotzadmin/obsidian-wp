=== Obsidian WP - AI Page Builder ===
Contributors: obsidianwebsitebuilder
Tags: wordpress, ai, website builder, page builder, elementor, gemini, unsplash, stripe
Requires at least: 5.0
Tested up to: 6.9
Stable tag: 1.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Obsidian WP empowers WordPress to create pages rapidly from pre-made templates/themes and fill them with AI-generated text content.

== Description ==

Obsidian WP is a powerful plugin designed to streamline the website creation process within WordPress. It leverages AI to generate content for your pages and integrates with pre-designed templates to build stunning websites quickly.

**Key Features:**
*   Rapid page creation using AI-generated content.
*   Integration with pre-made Elementor templates.
*   Customizable design options including fonts and color palettes.

**Privacy Information:**

This plugin uses external services to provide its core functionality. By using Obsidian WP, you acknowledge and agree to the following data processing:

*   **Google Gemini (AI Content Generation):** User-provided input (such as business name, description, and language) is sent to Google Gemini to generate textual content for your website pages. No personal identifiable information (PII) is sent to Google Gemini. The generated content is then stored in your WordPress database as part of your page content.

*   **Unsplash (Image Sourcing):** When selecting images, the plugin interacts with the Unsplash API to fetch image suggestions. User queries for images may be sent to Unsplash. The selected image URLs are then used to populate your page designs. No personal identifiable information (PII) is sent to Unsplash.

*   **Stripe (Payment Processing):** For certain premium features or services within the plugin, Stripe may be used for payment processing. When making a purchase, your payment information (e.g., credit card details) will be securely processed by Stripe. Obsidian WP does not store sensitive payment information on your server. Please refer to Stripe\'s privacy policy for details on their data handling practices.

*   **Obsidian WP External Services (Authentication & AI Processing):** This plugin connects to custom Obsidian WP cloud endpoints for user authentication, token validation, and additional AI content processing. When you sign in or generate content, requests are sent to services hosted at `https://obsidian-validate-*.run.app`, `https://obsidian-signin-*.run.app`, `https://obsidian-describe-generator-*.run.app`, and `https://obsidian-content-generator-*.run.app`. This data includes user credentials for authentication purposes and input for AI content generation. No other personal identifiable information (PII) beyond what is necessary for authentication and content generation is transmitted to these services.

We are committed to protecting your privacy. The data sent to these third-party services is limited to what is necessary for the functionality provided and does not include sensitive personal information unless explicitly required for a service (like payment processing with Stripe).

== Installation ==

1.  Upload the `obsidian-wp` folder to the `/wp-content/plugins/` directory.
2.  Activate the plugin through the 'Plugins' menu in WordPress.
3.  Ensure Elementor Page Builder is installed and activated for full functionality.
4.  Navigate to the 'Obsidian WP' admin page to start creating your AI-powered website.

== Frequently Asked Questions ==

= Does this plugin require Elementor? =
Yes, Obsidian WP is designed to work with Elementor Page Builder. Please ensure Elementor is installed and active for the plugin to function correctly.

= What data is sent to external AI services? =
Only the descriptions and keywords you provide for content generation are sent to Google Gemini. No personal identification information is transmitted.

= How does the plugin handle images? =
The plugin integrates with Unsplash to provide image suggestions based on your input. Image URLs are retrieved and used in your page designs.

= Is my payment information secure? =
Yes, all payment processing is handled securely by Stripe. Your sensitive payment details are not stored by Obsidian WP.

== Changelog ==

= 1.0.0 =
*   Initial release.
