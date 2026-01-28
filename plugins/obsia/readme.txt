=== Obsidian AI Page Builder ===
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

This plugin relies on several external services to provide AI content generation, authentication, and layout resources.

* Obsidian Authentication: This service handles user signup, sign-in, and session validation. It is required to manage your account and access the AI features.
  - Data sent: User email and password (or Google OAuth tokens) are sent to authenticate the user.
  - When: When a user creates an account, logs in, or when the plugin validates the current session.
  - Endpoints: https://obsidian-signin-313065021854.us-east1.run.app, https://obsidian-signup-313065021854.us-east1.run.app, https://obsidian-validate-313065021854.us-east1.run.app
  - Service provided by Obsidian Website Builder: https://obsidian.space/terms, https://obsidian.space/privacy

* Obsidian Content & Description Generator: This service generates textual content and business descriptions for website pages using AI.
  - Data sent: Business name, description, and keywords provided by the user.
  - When: When the user clicks "Create with AI" or requests AI-generated descriptions.
  - Endpoints: https://obsidian-content-generator-313065021854.us-east1.run.app, https://obsidian-describe-generator-313065021854.us-east1.run.app
  - Service provided by Obsidian Website Builder: https://obsidian.space/terms, https://obsidian.space/privacy
  - This service uses Google Gemini: https://policies.google.com/privacy, https://policies.google.com/terms

* Obsidian Subscription & Billing: This service verifies the user's subscription status and handles checkout sessions via Stripe.
  - Data sent: User identifier or email, and current URL origin for checkout redirection.
  - When: When checking subscription status, selecting a plan, or clicking "Subscribe".
  - Endpoints: https://obsidian-stripe-status-313065021854.us-east1.run.app, https://obsidian-stripe-checkout-313065021854.us-east1.run.app
  - Service provided by Obsidian Website Builder: https://obsidian.space/terms, https://obsidian.space/privacy
  - This service uses Stripe: https://stripe.com/privacy, https://stripe.com/legal/ssa

* Google OAuth Authorization: Allows users to sign in using their Google account.
  - Data sent: User's Google profile information (email and name).
  - When: When the user chooses to "Sign in with Google".
  - Endpoint: https://obsidian-google-oauth-authorization-313065021854.us-east1.run.app
  - Service provided by Google LLC: https://developers.google.com/terms/api-services-user-data-policy, https://policies.google.com/privacy

* Unsplash API: Used for searching and retrieving high-quality images for the generated pages.
  - Data sent: Search keywords based on the user's business description.
  - When: During the page creation process to fetch relevant images.
  - Endpoint: https://unsplash-images-313065021854.us-east1.run.app
  - Service provided by Unsplash Inc: https://unsplash.com/privacy, https://unsplash.com/terms

== Installation ==

1.  Upload the `obsia` folder to the `/wp-content/plugins/` directory.
2.  Activate the plugin through the 'Plugins' menu in WordPress.
3.  Ensure Elementor Page Builder is installed and activated for full functionality.
4.  Navigate to the 'Obsidian' admin page to start creating your AI-powered website.

== Frequently Asked Questions ==

= Does this plugin require Elementor? =
Yes, Obsidian is designed to work with Elementor Page Builder. Please ensure Elementor is installed and active for the plugin to function correctly.

= What data is sent to external AI services? =
Only the descriptions and keywords you provide for content generation are sent to Google Gemini. No personal identification information is transmitted.

= How does the plugin handle images? =
The plugin integrates with Unsplash to provide image suggestions based on your input. Image URLs are retrieved and used in your page designs.

= Is my payment information secure? =
Yes, all payment processing is handled securely by Stripe. Your sensitive payment details are not stored by Obsidian.

== Changelog ==

= 1.0.0 =
*   Initial release.
