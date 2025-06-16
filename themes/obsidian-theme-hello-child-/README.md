# Obsidian Theme

A modern WordPress theme designed to work seamlessly with the Obsidian AI plugin. This theme provides a comprehensive design system with REST API endpoints for dynamic theme management.

## Features

- **Modern Design System**: Built on theme.json with a complete color palette, typography system, and spacing scale
- **REST API Integration**: Exposes theme settings via REST endpoints for the Obsidian plugin
- **Google Fonts Support**: Integrated support for popular Google Fonts
- **Accessibility First**: Designed with WCAG compliance in mind
- **Customizer Compatible**: Settings can be edited via the WordPress Customizer
- **Responsive Design**: Mobile-first approach with responsive spacing and typography

## Design Tokens

### Color System

The theme includes a comprehensive color palette:

- **Primary**: #2563eb (Blue)
- **Secondary**: #7c3aed (Purple)
- **Accent**: #06b6d4 (Cyan)
- **Neutral Scale**: 50-950 (Light to Dark)
- **Semantic Colors**: Success, Warning, Error
- **Base Colors**: Background, Foreground

### Typography System

- **Font Families**:
  - System Font (default)
  - Inter (sans-serif)
  - Playfair Display (serif)
  - Roboto Mono (monospace)

- **Font Sizes**: xs through 9xl (0.75rem to 8rem)

### Spacing System

- **Scale**: 10-100 (0.25rem to 4rem)
- **Units**: px, em, rem, vh, vw, %

### Layout

- **Content Width**: 42rem (672px)
- **Wide Width**: 64rem (1024px)

## REST API Endpoints

For detailed API documentation including authentication methods, request/response examples, and Postman setup instructions, see [API-DOCUMENTATION.md](API-DOCUMENTATION.md).

### Quick Reference

All endpoints are prefixed with `/wp-json/obsidian/v1/`

- `GET /theme/settings` - Get all theme settings
- `GET /theme/colors` - Get color settings
- `POST /theme/colors` - Update colors (requires auth)
- `GET /theme/typography` - Get typography settings
- `POST /theme/typography` - Update typography (requires auth)
- `GET /theme/spacing` - Get spacing settings
- `GET /theme/layout` - Get layout settings
- `GET /theme/google-fonts` - Get available Google Fonts

## Optimal API Usage

For the Obsidian plugin, we recommend using these endpoints in the following way:

1. **Initial Load**: Call `/theme/settings` once to get all theme data
2. **Color Updates**: Use `POST /theme/colors` to update specific colors
3. **Typography Updates**: Use `POST /theme/typography` to update fonts
4. **Read-Only Data**: Spacing and layout are read-only to maintain consistency

## Theme Customization

### Via WordPress Customizer

Navigate to **Appearance > Customize** in WordPress admin. You'll find the **Obsidian Theme Options** panel with the following sections:

1. **Colors**: All theme colors with live preview
   - Primary, Secondary, Accent colors
   - Full neutral scale (50-950)
   - Semantic colors (Success, Warning, Error)
   - Background and Foreground colors

2. **Typography**: Font settings with live preview
   - Body Font Family (with Google Fonts support)
   - Heading Font Family
   - Base Font Size

3. **Spacing**: Layout dimensions
   - Content Width
   - Wide Width

All changes made in the Customizer are automatically saved to `theme.json` to maintain consistency.

### Via theme.json

Advanced users can directly edit the `theme.json` file for more granular control. Changes will be reflected in the Customizer.

### Via REST API

The Obsidian plugin (or other authorized applications) can update theme settings via the REST API endpoints.

### Additional CSS (Customizer)

The "Additional CSS" section in the Customizer is a standard WordPress feature that allows users to add custom CSS rules. This CSS is:
- Stored in the WordPress database (not in theme files)
- Applied after theme styles, allowing overrides
- Not affected by theme updates or API changes
- Separate from the theme's style.css file

**Note**: CSS added via the REST API should modify the theme's actual CSS files, not this Additional CSS section.

## Installation

1. Upload the theme folder to `/wp-content/themes/`
2. Activate the theme through the WordPress admin panel
3. The theme will automatically register its REST API endpoints

## Requirements

- WordPress 5.9 or higher
- PHP 7.4 or higher
- Hello Elementor parent theme (as this is a child theme)

## Design Philosophy

The Obsidian Theme follows these principles:

1. **Single Source of Truth**: theme.json is the authoritative source for all theme settings
2. **API-First**: All settings are accessible and (where appropriate) modifiable via REST API
3. **Separation of Concerns**: The theme handles styling; the plugin handles content and logic
4. **Modern Standards**: Uses WordPress block theme features and modern CSS
5. **Performance**: Lightweight with minimal dependencies

## Default Color Rationale

The default color palette was chosen for:

- **Accessibility**: All color combinations meet WCAG AA standards
- **Versatility**: Works well for various types of websites
- **Modern Aesthetic**: Contemporary color choices that feel current
- **Neutral Base**: The extensive neutral scale provides flexibility

## Future Enhancements

- Dynamic Google Fonts API integration
- Advanced color scheme generation
- Theme export/import functionality
- Additional block styles