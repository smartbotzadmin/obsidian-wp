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

This plugin relies on several external services to provide AI content generation, authentication, and design resources. Below is a disclosure of the third-party services used:

*   **Obsidian Services (Authentication, Content Generation, Subscription)**
    *   **What it is:** A suite of services managed by Obsidian Website Builder to handle user accounts, AI content generation, and subscription management.
    *   **Endpoints:**
        *   https://obsidian-signin-313065021854.us-east1.run.app
        *   https://obsidian-signup-313065021854.us-east1.run.app
        *   https://obsidian-validate-313065021854.us-east1.run.app
        *   https://obsidian-content-generator-313065021854.us-east1.run.app
        *   https://obsidian-describe-generator-313065021854.us-east1.run.app
        *   https://obsidian-stripe-status-313065021854.us-east1.run.app
        *   https://obsidian-stripe-checkout-313065021854.us-east1.run.app
    *   **Data sent:** User credentials (email/password), session tokens, business name, business description, and keywords.
    *   **When:** During account creation, login, session validation, AI content generation requests, and billing status checks.
    *   **Terms of Service:** [https://obsidian.space/terms](https://obsidian.space/terms)
    *   **Privacy Policy:** [https://obsidian.space/privacy](https://obsidian.space/privacy)

*   **Mixpanel**
    *   **What it is:** An analytics service used to track plugin usage, feature engagement, and error reporting to help us improve the product.
    *   **Data sent:** Anonymized usage events, browser type, device information, and interaction data.
    *   **When:** When the user interacts with the plugin dashboard and builder components.
    *   **Terms of Service:** [https://mixpanel.com/legal/terms-of-use/](https://mixpanel.com/legal/terms-of-use/)
    *   **Privacy Policy:** [https://mixpanel.com/legal/privacy-policy/](https://mixpanel.com/legal/privacy-policy/)

*   **Google Gemini (via Obsidian API)**
    *   **What it is:** The AI model used for generating high-quality textual content for your website.
    *   **Data sent:** Business descriptions and keywords provided by the user.
    *   **When:** Triggered when the user requests AI-generated content.
    *   **Terms of Service:** [https://policies.google.com/terms](https://policies.google.com/terms)
    *   **Privacy Policy:** [https://policies.google.com/privacy](https://policies.google.com/privacy)

*   **Google OAuth**
    *   **What it is:** Provides a secure "Sign in with Google" option for users.
    *   **Data sent:** Google profile information (email and name).
    *   **When:** When the user chooses to authenticate using their Google account.
    *   **Terms of Service:** [https://developers.google.com/terms/api-services-user-data-policy](https://developers.google.com/terms/api-services-user-data-policy)
    *   **Privacy Policy:** [https://policies.google.com/privacy](https://policies.google.com/privacy)

*   **Stripe**
    *   **What it is:** Our payment processing partner for handling subscription billing.
    *   **Data sent:** User identifier/email and origin URL for redirection.
    *   **When:** During the checkout process or when managing subscription settings.
    *   **Terms of Service:** [https://stripe.com/legal/ssa](https://stripe.com/legal/ssa)
    *   **Privacy Policy:** [https://stripe.com/privacy](https://stripe.com/privacy)

*   **Unsplash**
    *   **What it is:** Used to provide high-quality stock photography for the generated website designs.
    *   **Data sent:** Search keywords.
    *   **When:** During the initial page generation to find relevant visual assets.
    *   **Terms of Service:** [https://unsplash.com/terms](https://unsplash.com/terms)
    *   **Privacy Policy:** [https://unsplash.com/privacy](https://unsplash.com/privacy)

*   **Vimeo / YouTube**
    *   **What it is:** Video hosting services used to display embedded video content within website templates.
    *   **Data sent:** IP address and browser interaction data (standard embed behavior).
    *   **When:** When a user previews a template or page containing an embedded video.
    *   **Vimeo Terms & Privacy:** [https://vimeo.com/terms](https://vimeo.com/terms), [https://vimeo.com/privacy](https://vimeo.com/privacy)
    *   **YouTube Terms & Privacy:** [https://www.youtube.com/t/terms](https://www.youtube.com/t/terms), [https://policies.google.com/privacy](https://policies.google.com/privacy)

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
