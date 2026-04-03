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
        *   https://obsidian-google-oauth-authorization-313065021854.us-east1.run.app
    *   **Data sent:** User credentials (email/password), session tokens, business name, business description, and keywords.
    *   **When:** During account creation, login, session validation, AI content generation requests, and billing status checks.
    *   **Terms of Service:** https://obsidian.space/terms
    *   **Privacy Policy:** https://obsidian.space/privacy

*   **Mixpanel**
    *   **What it is:** An analytics service used to track plugin usage, feature engagement, and error reporting to help us improve the product.
    *   **Data sent:** Anonymized usage events, browser type, device information, and interaction data.
    *   **When:** When the user interacts with the plugin dashboard and builder components.
    *   **Terms of Service:** https://mixpanel.com/legal/terms-of-use/
    *   **Privacy Policy:** https://mixpanel.com/legal/privacy-policy/

*   **Google Gemini (via Obsidian API)**
    *   **What it is:** The AI model used for generating high-quality textual content for your website.
    *   **Data sent:** Business descriptions and keywords provided by the user.
    *   **When:** Triggered when the user requests AI-generated content.
    *   **Terms of Service:** https://policies.google.com/terms
    *   **Privacy Policy:** https://policies.google.com/privacy

*   **Google OAuth**
    *   **What it is:** Provides a secure "Sign in with Google" option for users.
    *   **Endpoints:**
        *   https://obsidian-google-oauth-authorization-313065021854.us-east1.run.app
    *   **Data sent:** Google profile information (email and name).
    *   **When:** When the user chooses to authenticate using their Google account.
    *   **Terms of Service:** https://developers.google.com/terms/api-services-user-data-policy
    *   **Privacy Policy:** https://policies.google.com/privacy

*   **Stripe**
    *   **What it is:** Our payment processing partner for handling subscription billing.
    *   **Endpoints:**
        *   https://obsidian-stripe-status-313065021854.us-east1.run.app
        *   https://obsidian-stripe-checkout-313065021854.us-east1.run.app
    *   **Data sent:** User identifier/email and origin URL for redirection.
    *   **When:** During the checkout process or when managing subscription settings.
    *   **Terms of Service:** https://stripe.com/legal/ssa
    *   **Privacy Policy:** https://stripe.com/privacy

*   **Unsplash**
    *   **What it is:** Used to provide high-quality stock photography for the generated website designs.
    *   **Endpoints:**
        *   https://unsplash-images-313065021854.us-east1.run.app
    *   **Data sent:** Search keywords.
    *   **When:** During the initial page generation to find relevant visual assets.
    *   **Terms of Service:** https://unsplash.com/terms
    *   **Privacy Policy:** https://unsplash.com/privacy

*   **Vimeo / YouTube**
    *   **What it is:** Video hosting services used to display embedded video content within website templates.
    *   **Data sent:** IP address and browser interaction data (standard embed behavior).
    *   **When:** When a user previews a template or page containing an embedded video.
    *   **Vimeo Terms & Privacy:** https://vimeo.com/terms, https://vimeo.com/privacy
    *   **YouTube Terms & Privacy:** https://www.youtube.com/t/terms, https://policies.google.com/privacy

== Source Code Disclosure ==

The full source code for this plugin, including all unminified assets and build scripts, is available at: https://github.com/obsidianwebsitebuilder/obsidian-wp

This plugin includes minified JavaScript and CSS files as part of its pre-designed template libraries. Below is a comprehensive disclosure of all source code and third-party libraries included in the plugin, in compliance with WordPress.org Plugin Directory guidelines.

=== WordPress Core Libraries (wp-includes) ===

The following JavaScript files are sourced from or derived from WordPress core (wp-includes) and are included for template functionality:

*   **admin-bar.min.js** — WordPress admin bar functionality
    *   Source: wp-includes/js/admin-bar.min.js
    *   Repository: https://github.com/WordPress/wordpress-develop/tree/trunk/src/js
*   **api-request.min.js** — WordPress REST API request handler
    *   Source: wp-includes/js/api-request.min.js
    *   Repository: https://github.com/WordPress/wordpress-develop/tree/trunk/src/js
*   **common.min.js** — WordPress common utilities
    *   Source: wp-includes/js/common.min.js
    *   Repository: https://github.com/WordPress/wordpress-develop/tree/trunk/src/js
*   **i18n.min.js** — WordPress internationalization library
    *   Source: wp-includes/js/i18n.min.js
    *   Repository: https://github.com/WordPress/wordpress-develop/tree/trunk/src/js

=== Elementor Libraries ===

The following files are included from or related to Elementor Page Builder, a required dependency:

*   **admin-bar.min.js, elementor-admin-bar.min.js** — Elementor admin bar integration
    *   Source: Elementor Plugin
    *   Repository: https://github.com/elementor/elementor
*   **common-modules.min.js, frontend-modules.min.js, frontend-1.min.js, frontend.min.js** — Elementor frontend modules
    *   Source: Elementor Plugin
    *   Repository: https://github.com/elementor/elementor
*   **webpack.runtime.min.js** — Webpack runtime for Elementor module bundling
    *   Source: Elementor Plugin build system
    *   Repository: https://github.com/elementor/elementor

=== Third-Party External Libraries ===

The following external JavaScript libraries are bundled with the plugin templates:

*   **jquery.min.js** (v1.12.4)
    *   Source: jQuery Foundation
    *   Repository: https://github.com/jquery/jquery
    *   License: MIT
    *   Official CDN: https://code.jquery.com/jquery-1.12.4.min.js

*   **jquery-migrate.min.js**
    *   Source: jQuery Foundation
    *   Repository: https://github.com/jquery/jquery-migrate
    *   License: MIT
    *   Official CDN: https://code.jquery.com/jquery-migrate-1.4.1.min.js

*   **jquery-numerator.min.js**
    *   Source: jQuery numerator plugin
    *   Repository: https://github.com/balupton/jquery-numerator
    *   License: MIT
    *   Official Source: https://raw.githubusercontent.com/balupton/jquery-numerator/master/lib/jquery.numerator.min.js

*   **underscore.min.js**
    *   Source: Underscore.js
    *   Repository: https://github.com/jashkenas/underscore
    *   License: MIT
    *   Official CDN: https://underscorejs.org/underscore-min.js

*   **backbone.min.js**
    *   Source: Backbone.js
    *   Repository: https://github.com/jashkenas/backbone
    *   License: MIT
    *   Official CDN: https://backbonejs.org/backbone-min.js

*   **backbone.radio.min.js**
    *   Source: Backbone.Radio (Marionette.js dependency)
    *   Repository: https://github.com/marionettejs/backbone.radio
    *   License: MIT
    *   Official Source: https://raw.githubusercontent.com/marionettejs/backbone.radio/master/lib/backbone.radio.min.js

*   **backbone.marionette.min.js**
    *   Source: Marionette.js
    *   Repository: https://github.com/marionettejs/backbone.marionette
    *   License: MIT
    *   Official CDN: https://marionettejs.com/

*   **swiper.min.js** (Swiper Slider)
    *   Source: Swiper by nolimits4web
    *   Repository: https://github.com/nolimits4web/swiper
    *   License: MIT
    *   Official CDN: https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js

*   **hoverintent-js.min.js**
    *   Source: HoverIntent jQuery plugin
    *   Repository: https://github.com/briancherne/jquery-hoverintent
    *   License: MIT
    *   Official Source: https://raw.githubusercontent.com/briancherne/jquery-hoverintent/master/jquery.hoverintent.min.js

*   **flexibility.min.js**
    *   Source: Flexibility CSS polyfill
    *   Repository: https://github.com/jonathantneal/flexibility
    *   License: CC0 1.0 Universal
    *   Official CDN: https://unpkg.com/flexibility@2.0.0/flexibility.min.js

*   **core.min.js** (jQuery UI)
    *   Source: jQuery UI
    *   Repository: https://github.com/jquery/jquery-ui
    *   License: MIT
    *   Official CDN: https://code.jquery.com/ui/1.12.1/jquery-ui.min.js

*   **dialog.min.js, draggable.min.js, mouse.min.js** (jQuery UI components)
    *   Source: jQuery UI
    *   Repository: https://github.com/jquery/jquery-ui
    *   License: MIT
    *   Official CDN: https://code.jquery.com/ui/1.12.1/ (component-specific builds)

*   **dev-tools.min.js, hooks.min.js, web-cli.min.js, app-loader.min.js** (Internal utility libraries)
    *   Source: Obsidian Space Website Builder
    *   Repository: Not publicly available at this time
    *   License: GPLv2 or later

=== Astra Theme Presets ===

The color palettes defined in `components/obsia-design-preview-modal.js` (lines 394-407) are human-readable CSS custom properties used to apply color schemes to the Astra theme during the design preview. These values are intentionally defined as a string within the JavaScript file to be injected into the preview iframe for real-time design adjustments. They are the original source code and are not generated or minified by any build tool.

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
