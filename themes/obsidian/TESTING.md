# Testing the Obsidian WordPress Theme

This guide will help you set up and test the Obsidian theme in a WordPress environment.

## Prerequisites

You'll need a WordPress installation to test the theme. Here are your options:

### Option 1: Local WordPress Setup (Recommended)
- **Local by Flywheel**: Download from [localwp.com](https://localwp.com)
- **XAMPP**: Download from [apachefriends.org](https://www.apachefriends.org)
- **MAMP**: Download from [mamp.info](https://www.mamp.info)
- **Docker**: Use `wordpress:latest` image

### Option 2: Online WordPress
- **WordPress.com** (limited theme upload)
- **Hosting provider** with WordPress installed

## Installation Steps

### 1. Install the Theme

#### Method A: Direct Upload
1. Zip the entire `obsidian` folder
2. Go to WordPress Admin → Appearance → Themes
3. Click "Add New" → "Upload Theme"
4. Upload the zip file and activate

#### Method B: FTP/File Manager
1. Copy the `obsidian` folder to `/wp-content/themes/`
2. Go to WordPress Admin → Appearance → Themes
3. Find "Obsidian" and click "Activate"

### 2. Verify Installation

After activation, check:
- ✅ Theme is active in Appearance → Themes
- ✅ No PHP errors in the error log
- ✅ Site loads without issues

## Testing the Theme Features

### 1. Basic Theme Functionality

#### Frontend Testing
1. Visit your site's homepage
2. Check that the theme loads correctly
3. Verify responsive design on mobile/tablet
4. Test navigation menus
5. Check post/page layouts

#### Admin Testing
1. Go to **Appearance → Customize**
2. Look for "Obsidian Theme Settings" panel
3. Test color, typography, and layout controls
4. Verify live preview updates

### 2. REST API Testing

#### Method A: Using the Test Tool
1. Open [`test-api.html`](themes/obsidian/test-api.html:1) in your browser
2. Enter your WordPress site URL
3. Get the WordPress nonce:
   - Log into WordPress admin
   - Open browser dev tools (F12)
   - Go to Console tab
   - Type: `wpApiSettings.nonce` and press Enter
   - Copy the returned value
4. Paste the nonce into the test tool
5. Test the API endpoints

#### Method B: Using Browser/Postman
Test these endpoints:

**Get Theme Settings:**
```
GET http://your-site.com/wp-json/obsidian/v1/theme/settings
```

**Update Colors:**
```
POST http://your-site.com/wp-json/obsidian/v1/theme/colors
Content-Type: application/json
X-WP-Nonce: your-nonce-here

{
  "colors": {
    "primary": "#ff6b6b",
    "accent": "#4ecdc4"
  }
}
```

#### Method C: Using WordPress Admin
1. Go to **Appearance → Customize → Obsidian Theme Settings**
2. Change colors, fonts, or layout settings
3. Check that changes appear in live preview
4. Save changes and verify they persist

### 3. Block Editor Testing

1. Create a new post/page
2. Add various blocks (headings, buttons, quotes, groups)
3. Look for "Obsidian" block styles in the block editor
4. Test custom block patterns under "Obsidian Patterns"
5. Verify that theme colors appear in color palettes

### 4. CSS Variables Testing

Open browser dev tools and check that CSS variables are loaded:

```css
:root {
  --obsidian-color-primary: #2563eb;
  --obsidian-color-secondary: #64748b;
  --obsidian-font-primary-family: system-ui, -apple-system, sans-serif;
  /* ... more variables */
}
```

## Troubleshooting

### Common Issues

#### Theme Not Appearing
- Check file permissions (755 for folders, 644 for files)
- Verify the theme folder is in `/wp-content/themes/`
- Check for PHP syntax errors in error logs

#### REST API Not Working
- Ensure permalinks are enabled (Settings → Permalinks)
- Check if REST API is disabled by plugins
- Verify user has `customize` capability for POST requests
- Test with a fresh WordPress nonce

#### Customizer Not Loading
- Check for JavaScript errors in browser console
- Ensure all theme files are uploaded correctly
- Try deactivating other plugins temporarily

#### CSS Not Loading
- Check that `assets/css/dynamic.css` exists and is readable
- Verify the `OBSIDIAN_ASSETS_URL` constant is correct
- Clear any caching plugins

### Debug Mode

Enable WordPress debug mode by adding to `wp-config.php`:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

Check `/wp-content/debug.log` for errors.

## Testing Checklist

### ✅ Basic Functionality
- [ ] Theme activates without errors
- [ ] Homepage loads correctly
- [ ] Navigation menus work
- [ ] Posts and pages display properly
- [ ] Responsive design works on mobile

### ✅ Customizer Integration
- [ ] Obsidian panel appears in Customizer
- [ ] Color controls work and update live preview
- [ ] Typography controls function correctly
- [ ] Layout controls adjust properly
- [ ] Changes save and persist

### ✅ REST API Endpoints
- [ ] GET `/theme/settings` returns current settings
- [ ] POST `/theme/colors` updates colors successfully
- [ ] POST `/theme/typography` updates fonts correctly
- [ ] POST `/theme/layout` adjusts layout settings
- [ ] Proper authentication and validation

### ✅ Block Editor Features
- [ ] Custom block styles appear in editor
- [ ] Block patterns are available
- [ ] Theme colors show in color palettes
- [ ] Editor styles match frontend

### ✅ CSS Variables
- [ ] CSS custom properties are generated
- [ ] Variables update when settings change
- [ ] Styles apply correctly on frontend
- [ ] Real-time updates work in Customizer

### ✅ Compatibility
- [ ] Works with default WordPress blocks
- [ ] Compatible with common plugins
- [ ] No JavaScript errors in console
- [ ] Accessible with keyboard navigation

## Performance Testing

### Page Speed
- Test with Google PageSpeed Insights
- Check Core Web Vitals
- Verify CSS and JS are minified in production

### Accessibility
- Test with screen readers
- Check color contrast ratios
- Verify keyboard navigation
- Test with accessibility tools (axe, WAVE)

## Advanced Testing

### Plugin Compatibility
Test with popular plugins:
- **Elementor**: Check color sync and compatibility
- **WooCommerce**: Verify e-commerce styling
- **Contact Form 7**: Test form styling
- **Yoast SEO**: Check breadcrumb integration

### Multi-language Testing
If using WPML or Polylang:
- Test theme in different languages
- Verify RTL language support
- Check translated strings

### Caching Testing
Test with caching plugins:
- **WP Rocket**
- **W3 Total Cache**
- **WP Super Cache**

Ensure theme settings update correctly with caching enabled.

## Reporting Issues

If you find bugs or issues:

1. **Check the error logs** first
2. **Reproduce the issue** with default WordPress themes
3. **Document the steps** to reproduce
4. **Include environment details**:
   - WordPress version
   - PHP version
   - Active plugins
   - Browser and version

## Next Steps

Once testing is complete:
1. **Document any customizations** needed
2. **Create child theme** if modifications are required
3. **Set up staging environment** for ongoing development
4. **Plan integration** with the Obsidian plugin

The theme is now ready for production use and plugin integration!