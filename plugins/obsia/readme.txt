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

1. **Obsidian Cloud API (Google Cloud Run)**: This service handles user authentication (signup, sign-in, validation), content generation via AI, and checking subscription status.
   - **What it is used for**: User authentication, content generation processing, and license/subscription verification.
   - **Data sent**: User credentials (email/password or Google OAuth tokens) for authentication. Prompt data (business name, descriptions) for content generation.
   - **When**: When a user signs up, logs in, validates their session, or generates content.
   - **Endpoints**: `https://obsidian-*-313065021854.us-east1.run.app`
   - **Service Provider**: Obsidian Website Builder. [Terms of Service](https://obsidianwebsitebuilder.com/terms), [Privacy Policy](https://obsidianwebsitebuilder.com/privacy).

2. **Google Gemini (via Obsidian Cloud API)**: Used for generating textual content for website pages.
   - **What it is used for**: AI-driven text generation.
   - **Data sent**: User-provided business descriptions and keywords.
   - **When**: Triggered when the user clicks "Create with AI".
   - **Service Provider**: Google LLC. [Privacy Policy](https://policies.google.com/privacy), [Terms of Service](https://policies.google.com/terms).

3. **Google OAuth**: Allows users to sign in using their Google account.
   - **What it is used for**: Third-party authentication.
   - **Data sent**: User's Google profile information (email and name).
   - **When**: When the user chooses to "Sign in with Google".
   - **Endpoints**: `https://obsidian-google-oauth-authorization-313065021854.us-east1.run.app`
   - **Service Provider**: Google LLC. [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy).

4. **Stripe (via Obsidian Cloud API)**: Used for verifying the user's subscription or payment status.
   - **What it is used for**: Subscription management and status verification.
   - **Data sent**: User identifier or email to check status.
   - **When**: When checking subscription status or interacting with billing features.
   - **Endpoints**: `https://obsidian-stripe-status-313065021854.us-east1.run.app`
   - **Service Provider**: Stripe, Inc. [Privacy Policy](https://stripe.com/privacy), [Terms of Service](https://stripe.com/legal/ssa).

5. **Unsplash API**: Used for searching and retrieving high-quality images for the generated pages.
   - **What it is used for**: Image sourcing.
   - **Data sent**: Search keywords based on the user's business description.
   - **When**: During the page creation process to fetch relevant images.
   - **Service Provider**: Unsplash Inc. [Privacy Policy](https://unsplash.com/privacy), [Terms](https://unsplash.com/terms).

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
