# Obsidian WordPress Theme

A sophisticated WordPress theme designed as a required companion to the Obsidian plugin. It serves as the single source of truth for theming settings, providing global visual styling, dynamic CSS variables, and REST API endpoints for seamless plugin integration.

## Features

### 🎨 **Dynamic Theming System**
- **CSS Custom Properties**: Real-time style updates through CSS variables
- **REST API Integration**: Comprehensive endpoints for theme settings management
- **WordPress Customizer**: Full integration with native WordPress customization tools
- **Theme.json Support**: Modern WordPress block editor theming

### 🌈 **Color Management**
- **Global Color Palettes**: Primary, secondary, accent, background, text, and muted colors
- **Dynamic Color Updates**: Real-time color changes without page refresh
- **Accessibility Compliant**: WCAG 2.1 AA color contrast standards
- **Block Editor Integration**: Colors available in Gutenberg editor

### 📝 **Typography System**
- **Font Family Management**: Primary and secondary font stacks
- **Responsive Typography**: Fluid font sizing with configurable scale ratios
- **Line Height Control**: Optimized readability settings
- **Web Font Loading**: Efficient font delivery and fallbacks

### 📐 **Layout Framework**
- **Container System**: Configurable max-widths and content areas
- **Grid & Flexbox**: Modern CSS layout utilities
- **Responsive Design**: Mobile-first approach with breakpoint management
- **Spacing System**: Consistent spacing scale throughout

### 🧩 **Block Editor Support**
- **Custom Block Styles**: Enhanced styling options for core blocks
- **Block Patterns**: Pre-designed content layouts
- **Editor Styles**: WYSIWYG styling in the block editor
- **Full Site Editing**: Complete FSE compatibility

### 🔌 **Plugin Compatibility**
- **Elementor**: Native integration with Elementor page builder
- **WooCommerce**: E-commerce styling and layout support
- **Contact Form 7**: Form styling integration
- **Yoast SEO**: Breadcrumb and SEO feature support
- **Jetpack**: Infinite scroll and content options
- **WPML/Polylang**: Multi-language support

## REST API Endpoints

The theme exposes several REST API endpoints for plugin integration:

### Theme Settings
- `GET /wp-json/obsidian/v1/theme/settings` - Retrieve all theme settings
- `POST /wp-json/obsidian/v1/theme/settings` - Update theme settings

### Colors
- `GET /wp-json/obsidian/v1/theme/colors` - Get color palette
- `POST /wp-json/obsidian/v1/theme/colors` - Update colors

### Typography
- `GET /wp-json/obsidian/v1/theme/typography` - Get typography settings
- `POST /wp-json/obsidian/v1/theme/typography` - Update typography

### Layout
- `GET /wp-json/obsidian/v1/theme/layout` - Get layout settings
- `POST /wp-json/obsidian/v1/theme/layout` - Update layout

## Installation

1. Download the theme files
2. Upload to `/wp-content/themes/obsidian/`
3. Activate the theme in WordPress admin
4. Configure settings via Appearance > Customize > Obsidian Theme Settings

## Configuration

### Default Settings

The theme comes with sensible defaults:

```php
$defaults = array(
    'colors' => array(
        'primary'    => '#2563eb',
        'secondary'  => '#64748b',
        'accent'     => '#f59e0b',
        'background' => '#ffffff',
        'text'       => '#1f2937',
        'muted'      => '#6b7280',
    ),
    'typography' => array(
        'primary-family'   => 'system-ui, -apple-system, sans-serif',
        'secondary-family' => 'Georgia, serif',
        'base-size'        => '16px',
        'scale-ratio'      => '1.25',
        'line-height'      => '1.6',
    ),
    'layout' => array(
        'container-width' => '1200px',
        'content-width'   => '800px',
        'sidebar-width'   => '300px',
        'gutter'          => '2rem',
    ),
);
```

### Customization

#### Via WordPress Customizer
Navigate to **Appearance > Customize > Obsidian Theme Settings** to modify:
- Colors
- Typography
- Layout settings

#### Via REST API
Use the provided endpoints to programmatically update settings:

```javascript
// Update colors
fetch('/wp-json/obsidian/v1/theme/colors', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': wpApiSettings.nonce
    },
    body: JSON.stringify({
        colors: {
            primary: '#ff6b6b',
            secondary: '#4ecdc4'
        }
    })
});
```

#### Via PHP
```php
// Update theme settings
$new_settings = array(
    'colors' => array(
        'primary' => '#ff6b6b'
    )
);
obsidian_update_theme_settings($new_settings);
```

## CSS Custom Properties

The theme generates CSS custom properties that can be used in your styles:

```css
:root {
    /* Colors */
    --obsidian-color-primary: #2563eb;
    --obsidian-color-secondary: #64748b;
    --obsidian-color-accent: #f59e0b;
    --obsidian-color-background: #ffffff;
    --obsidian-color-text: #1f2937;
    --obsidian-color-muted: #6b7280;
    
    /* Typography */
    --obsidian-font-primary-family: system-ui, -apple-system, sans-serif;
    --obsidian-font-secondary-family: Georgia, serif;
    --obsidian-font-base-size: 16px;
    --obsidian-font-line-height: 1.6;
    
    /* Layout */
    --obsidian-layout-container-width: 1200px;
    --obsidian-layout-content-width: 800px;
    --obsidian-layout-gutter: 2rem;
}
```

## Block Styles

The theme includes custom block styles:

### Button Styles
- **Outline**: Transparent background with border
- **Ghost**: Minimal styling with hover effects

### Heading Styles
- **Gradient**: Gradient text effect
- **Underline**: Decorative underline accent

### Group Styles
- **Card**: Card-like appearance with shadow
- **Shadow**: Drop shadow effect

### Quote Styles
- **Minimal**: Clean, centered quote style
- **Bordered**: Quote with decorative border

## Accessibility

The theme is built with accessibility in mind:

- **WCAG 2.1 AA Compliance**: Color contrast and accessibility standards
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **Skip Links**: Navigation shortcuts for assistive technology
- **Focus Management**: Visible focus indicators

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Custom Properties**: Full support for CSS variables
- **ES6 JavaScript**: Modern JavaScript features
- **Progressive Enhancement**: Graceful degradation for older browsers

## Performance

- **Optimized CSS**: Minimal, efficient stylesheets
- **Lazy Loading**: Built-in image lazy loading
- **Font Loading**: Optimized web font delivery
- **Caching Friendly**: Proper cache headers and optimization

## Development

### File Structure
```
obsidian/
├── style.css                 # Theme header and main stylesheet
├── functions.php            # Theme functionality
├── theme.json              # Block editor configuration
├── index.php               # Main template
├── includes/               # PHP includes
│   ├── rest-api.php       # REST API endpoints
│   ├── customizer.php     # Customizer integration
│   ├── block-styles.php   # Block editor styles
│   └── compatibility.php  # Plugin compatibility
└── assets/                # Theme assets
    ├── css/
    │   └── dynamic.css    # Dynamic styles
    └── js/
        └── theme.js       # Theme JavaScript
```

### Hooks and Filters

The theme provides several hooks for customization:

```php
// Actions
do_action('obsidian_theme_settings_updated', $settings);
do_action('obsidian_theme_colors_updated', $colors);
do_action('obsidian_theme_typography_updated', $typography);
do_action('obsidian_theme_layout_updated', $layout);

// Filters
apply_filters('obsidian_default_settings', $defaults);
apply_filters('obsidian_css_variables', $variables);
```

## Requirements

- **WordPress**: 6.0 or higher
- **PHP**: 8.0 or higher
- **MySQL**: 5.7 or higher

## License

This theme is licensed under the GPL v3 or later.

## Support

For support and documentation, visit the [Obsidian Theme website](https://obsidian-theme.com).

## Changelog

### Version 1.0.0
- Initial release
- Complete theming system implementation
- REST API endpoints
- Block editor integration
- Plugin compatibility features