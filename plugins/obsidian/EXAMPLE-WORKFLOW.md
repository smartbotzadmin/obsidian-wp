# AI Agent Workflow Example: Creating a Team Section with Theme Integration

This document demonstrates a complete AI agent workflow for creating a team section that actively uses Obsidian theme colors, typography, and spacing for perfect visual integration.

## Authentication Requirements

### WordPress REST API Authentication
The Obsidian plugin endpoints use WordPress's built-in REST API authentication system. Here are the authentication requirements:

#### **Public Endpoints (No Authentication Required):**

**Plugin Endpoints:**
- `GET /wp-json/obsidian-plugin/v1/pages/{id}` - Read page data
- `GET /wp-json/obsidian-plugin/v1/site` - Get site information
- `GET /wp-json/obsidian-plugin/v1/menus` - Get menu data
- `GET /wp-json/obsidian-plugin/v1/theme` - Get theme settings

**Theme Endpoints:**
- `GET /wp-json/obsidian/v1/theme/settings` - Get complete theme settings
- `GET /wp-json/obsidian/v1/theme/colors` - Get theme colors only
- `GET /wp-json/obsidian/v1/theme/typography` - Get theme typography only
- `GET /wp-json/obsidian/v1/theme/spacing` - Get theme spacing only
- `GET /wp-json/obsidian/v1/theme/layout` - Get theme layout only
- `GET /wp-json/obsidian/v1/theme/google-fonts` - Get available Google Fonts

#### **Authenticated Endpoints:**

**Plugin Endpoints:**
- `POST/PUT/DELETE /wp-json/obsidian-plugin/v1/pages` - Requires `edit_posts` capability
- `POST /wp-json/obsidian-plugin/v1/components` - Requires `edit_posts` capability
- `PUT /wp-json/obsidian-plugin/v1/site` - Requires `manage_options` capability
- `PUT /wp-json/obsidian-plugin/v1/menus/{id}` - Requires `edit_theme_options` capability

**Theme Endpoints:**
- `POST /wp-json/obsidian/v1/theme/colors` - Requires `edit_theme_options` capability
- `POST /wp-json/obsidian/v1/theme/typography` - Requires `edit_theme_options` capability

#### **Authentication for External AI Agents:**

For external AI agents calling these endpoints from remote servers, **Application Passwords** are the recommended authentication method as they provide:
- ✅ **Secure API access** without exposing main user passwords
- ✅ **Granular control** - can be revoked individually
- ✅ **Audit trail** - each application password is named and tracked
- ✅ **No session dependency** - works for server-to-server communication

#### **Authentication Methods:**

**1. Application Passwords (Recommended for External AI Agents):**
```javascript
// Use your WordPress USERNAME (not the application name) + the generated password
const headers = {
    'Authorization': 'Basic ' + btoa('your_wp_username:generated_app_password'),
    'Content-Type': 'application/json'
};

// Example: If your WordPress username is "admin" and generated password is "abcd efgh ijkl mnop qrst uvwx"
const headers = {
    'Authorization': 'Basic ' + btoa('admin:abcd efgh ijkl mnop qrst uvwx'),
    'Content-Type': 'application/json'
};
```

**2. Cookie Authentication (for browser-based agents only):**
```javascript
// Only works for logged-in users in browser context
// Not suitable for external server agents
const headers = {
    'X-WP-Nonce': wpApiSettings.nonce,
    'Content-Type': 'application/json'
};
```

**3. JWT Authentication (requires additional plugin):**
```javascript
// Requires JWT Authentication plugin installation
const headers = {
    'Authorization': 'Bearer ' + jwt_token,
    'Content-Type': 'application/json'
};
```

#### **Setting Up Application Passwords for AI Agents:**

**Manual Setup (Current Method):**
1. Go to WordPress Admin → Users → Profile
2. Scroll to "Application Passwords" section
3. Enter application name (e.g., "Obsidian AI Agent") - this is just a label for identification
4. Click "Add New Application Password"
5. **Copy the generated password** (format: `xxxx xxxx xxxx xxxx xxxx xxxx`)
6. **Important:** Use your **WordPress username** (not the application name) + the generated password

**Authentication Format:**
- **Username:** Your actual WordPress login username (e.g., "admin", "alessandro", etc.)
- **Password:** The generated application password (e.g., "abcd efgh ijkl mnop qrst uvwx")
- **Application Name:** Just a label for your reference (not used in authentication)

**Example:**
- WordPress Username: `admin`
- Application Name: `Obsidian AI Agent` (just a label)
- Generated Password: `abcd efgh ijkl mnop qrst uvwx`
- **Use in API:** `btoa('admin:abcd efgh ijkl mnop qrst uvwx')`

**Future Enhancement - Automatic Setup:**
The Obsidian plugin could be enhanced to automatically create an application password during activation:

```php
// Future plugin enhancement - auto-create app password on activation
function obsidian_create_app_password_on_activation() {
    $user = wp_get_current_user();
    if ($user->ID && current_user_can('edit_posts')) {
        $app_password = wp_generate_password(24, false);
        $created = WP_Application_Passwords::create_new_application_password(
            $user->ID,
            [
                'name' => 'Obsidian AI Agent',
                'app_id' => 'obsidian-ai-agent'
            ]
        );
        
        // Store or display the password for one-time setup
        update_option('obsidian_ai_agent_password', $app_password);
    }
}
```

#### **Development vs Production Considerations:**

**Development Environment (Current):**
- Manual application password setup is acceptable
- Can use admin user credentials for testing
- Security is less critical on localhost

**Production Environment (Recommended):**
- Create dedicated user account for AI agent with minimal required permissions
- Use application passwords exclusively (never main passwords)
- Consider implementing API key system as alternative to application passwords
- Monitor and log all API access for security auditing

## Scenario

**User Request:** *"Add a team section to our About page with our 4 team members - John (CEO), Sarah (CTO), Mike (Designer), and Lisa (Developer). Make it look professional with photos and brief descriptions."*

---

## Step-by-Step Workflow

### Step 1: Fetch Theme Design Tokens

**Why:** Before creating any component, the AI must understand the current theme's design system to ensure visual consistency.

```javascript
// Get complete theme settings (no authentication required - public endpoint)
const themeResponse = await fetch('/wp-json/obsidian/v1/theme/settings');
const theme = await themeResponse.json();

console.log('Theme Design Tokens:', theme);
```

**Expected Theme Response:**
```json
{
  "colors": {
    "primary": {
      "value": "#2563eb",
      "name": "Primary"
    },
    "secondary": {
      "value": "#7c3aed", 
      "name": "Secondary"
    },
    "accent": {
      "value": "#06b6d4",
      "name": "Accent"
    },
    "neutral": {
      "value": "#64748b",
      "name": "Neutral"
    },
    "base": {
      "value": "#ffffff",
      "name": "Base"
    },
    "contrast": {
      "value": "#1e293b",
      "name": "Contrast"
    }
  },
  "typography": {
    "fontFamilies": {
      "inter": {
        "value": "'Inter', sans-serif",
        "name": "Inter"
      }
    },
    "fontSizes": {
      "base": { "value": "1rem", "name": "Base" },
      "lg": { "value": "1.125rem", "name": "Large" },
      "xl": { "value": "1.25rem", "name": "Extra Large" },
      "2xl": { "value": "1.5rem", "name": "2X Large" },
      "3xl": { "value": "1.875rem", "name": "3X Large" }
    }
  },
  "spacing": {
    "sizes": {
      "20": { "value": "0.5rem", "name": "2" },
      "40": { "value": "1rem", "name": "4" },
      "60": { "value": "1.5rem", "name": "6" },
      "80": { "value": "2rem", "name": "8" },
      "120": { "value": "3rem", "name": "12" },
      "160": { "value": "4rem", "name": "16" }
    }
  },
  "layout": {
    "contentSize": "42rem",
    "wideSize": "64rem"
  }
}
```

### Step 2: Get Current Page Context

```javascript
// Get the About page (assuming ID 15) - no authentication required
const pageResponse = await fetch('/wp-json/obsidian-plugin/v1/pages/15');
const page = await pageResponse.json();

console.log('Current Page:', {
  title: page.title,
  currentBlocks: page.blocks.length,
  status: page.status
});
```

### Step 3: Generate Theme-Integrated Component

**AI Analysis:** Based on the theme tokens, I'll create a team section that uses:
- **Primary color** (#2563eb) for headings and accents
- **Neutral color** (#64748b) for descriptions  
- **Inter font family** for consistency
- **Proper spacing** using theme spacing scale
- **Content width** respecting theme layout constraints

```javascript
// Create team component with theme integration (requires edit_posts capability)
const componentResponse = await fetch('/wp-json/obsidian-plugin/v1/components', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('your_wp_username:your_generated_app_password')
  },
  body: JSON.stringify({
    type: 'team-section',
    html: generateTeamHTML(theme),
    css: generateTeamCSS(theme),
    javascript: generateTeamJS(theme),
    page_id: 15
  })
});

function generateTeamHTML(theme) {
  return `
<section class="obsidian-team-section">
  <div class="team-container">
    <header class="team-header">
      <h2 class="team-title">Meet Our Team</h2>
      <p class="team-subtitle">The passionate people behind our success</p>
    </header>
    
    <div class="team-grid">
      <div class="team-member" data-member="john">
        <div class="member-image-wrapper">
          <img src="/wp-content/uploads/team/john-doe.jpg" alt="John Doe" class="member-image" loading="lazy">
          <div class="member-overlay">
            <span class="member-role">CEO & Founder</span>
          </div>
        </div>
        <div class="member-info">
          <h3 class="member-name">John Doe</h3>
          <p class="member-title">CEO & Founder</p>
          <p class="member-description">Leading our vision with 15+ years of industry experience. Passionate about innovation and building great teams.</p>
        </div>
      </div>
      
      <div class="team-member" data-member="sarah">
        <div class="member-image-wrapper">
          <img src="/wp-content/uploads/team/sarah-smith.jpg" alt="Sarah Smith" class="member-image" loading="lazy">
          <div class="member-overlay">
            <span class="member-role">CTO</span>
          </div>
        </div>
        <div class="member-info">
          <h3 class="member-name">Sarah Smith</h3>
          <p class="member-title">Chief Technology Officer</p>
          <p class="member-description">Architecting scalable solutions and leading our technical strategy. Expert in cloud technologies and team leadership.</p>
        </div>
      </div>
      
      <div class="team-member" data-member="mike">
        <div class="member-image-wrapper">
          <img src="/wp-content/uploads/team/mike-johnson.jpg" alt="Mike Johnson" class="member-image" loading="lazy">
          <div class="member-overlay">
            <span class="member-role">Lead Designer</span>
          </div>
        </div>
        <div class="member-info">
          <h3 class="member-name">Mike Johnson</h3>
          <p class="member-title">Lead Designer</p>
          <p class="member-description">Creating beautiful, user-centered designs that solve real problems. Specializes in UX research and interface design.</p>
        </div>
      </div>
      
      <div class="team-member" data-member="lisa">
        <div class="member-image-wrapper">
          <img src="/wp-content/uploads/team/lisa-chen.jpg" alt="Lisa Chen" class="member-image" loading="lazy">
          <div class="member-overlay">
            <span class="member-role">Senior Developer</span>
          </div>
        </div>
        <div class="member-info">
          <h3 class="member-name">Lisa Chen</h3>
          <p class="member-title">Senior Developer</p>
          <p class="member-description">Building robust applications with clean, maintainable code. Full-stack expertise with a focus on performance optimization.</p>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function generateTeamCSS(theme) {
  // Extract theme values for use in CSS
  const colors = theme.colors;
  const typography = theme.typography;
  const spacing = theme.spacing.sizes;
  const layout = theme.layout;
  
  return `
/* Team Section - Using Obsidian Theme Design Tokens */
.obsidian-team-section {
  padding: ${spacing['160'].value} ${spacing['40'].value};
  background: ${colors.base.value};
  font-family: ${typography.fontFamilies.inter.value};
}

.team-container {
  max-width: ${layout.wideSize};
  margin: 0 auto;
}

/* Header Section */
.team-header {
  text-align: center;
  margin-bottom: ${spacing['120'].value};
}

.team-title {
  font-size: ${typography.fontSizes['3xl'].value};
  font-weight: 700;
  color: ${colors.primary.value};
  margin: 0 0 ${spacing['40'].value} 0;
  line-height: 1.2;
}

.team-subtitle {
  font-size: ${typography.fontSizes.lg.value};
  color: ${colors.neutral.value};
  margin: 0;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}

/* Team Grid */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${spacing['80'].value};
  margin-top: ${spacing['120'].value};
}

/* Team Member Cards */
.team-member {
  background: ${colors.base.value};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid rgba(${hexToRgb(colors.neutral.value)}, 0.1);
}

.team-member:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border-color: rgba(${hexToRgb(colors.primary.value)}, 0.2);
}

/* Member Image */
.member-image-wrapper {
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
}

.member-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.team-member:hover .member-image {
  transform: scale(1.05);
}

.member-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  padding: ${spacing['60'].value} ${spacing['40'].value} ${spacing['40'].value};
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.team-member:hover .member-overlay {
  transform: translateY(0);
}

.member-role {
  color: ${colors.base.value};
  font-size: ${typography.fontSizes.base.value};
  font-weight: 500;
}

/* Member Info */
.member-info {
  padding: ${spacing['60'].value} ${spacing['40'].value} ${spacing['80'].value};
}

.member-name {
  font-size: ${typography.fontSizes.xl.value};
  font-weight: 600;
  color: ${colors.contrast.value};
  margin: 0 0 ${spacing['20'].value} 0;
}

.member-title {
  font-size: ${typography.fontSizes.base.value};
  font-weight: 500;
  color: ${colors.primary.value};
  margin: 0 0 ${spacing['40'].value} 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.member-description {
  font-size: ${typography.fontSizes.base.value};
  color: ${colors.neutral.value};
  line-height: 1.6;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .obsidian-team-section {
    padding: ${spacing['120'].value} ${spacing['40'].value};
  }
  
  .team-grid {
    grid-template-columns: 1fr;
    gap: ${spacing['60'].value};
  }
  
  .team-title {
    font-size: ${typography.fontSizes['2xl'].value};
  }
  
  .member-info {
    padding: ${spacing['40'].value} ${spacing['40'].value} ${spacing['60'].value};
  }
}

@media (max-width: 480px) {
  .obsidian-team-section {
    padding: ${spacing['80'].value} ${spacing['40'].value};
  }
  
  .team-header {
    margin-bottom: ${spacing['80'].value};
  }
}

/* Utility function result - convert hex to rgb */
/* This would be processed by the AI to convert ${colors.neutral.value} hex to rgb values */
`;
}

function generateTeamJS(theme) {
  return `
(function($) {
  'use strict';
  
  class ObsidianTeamSection {
    constructor(element) {
      this.element = element;
      this.members = this.element.querySelectorAll('.team-member');
      this.init();
    }
    
    init() {
      this.setupIntersectionObserver();
      this.setupAccessibility();
      this.setupImageLazyLoading();
    }
    
    setupIntersectionObserver() {
      // Animate team members as they come into view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, index * 100); // Stagger animation
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      this.members.forEach(member => {
        member.style.opacity = '0';
        member.style.transform = 'translateY(20px)';
        member.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(member);
      });
    }
    
    setupAccessibility() {
      // Add ARIA labels and keyboard navigation
      this.members.forEach((member, index) => {
        member.setAttribute('role', 'article');
        member.setAttribute('aria-label', \`Team member \${index + 1}\`);
        member.setAttribute('tabindex', '0');
        
        // Add focus styles
        member.addEventListener('focus', () => {
          member.style.outline = \`2px solid ${theme.colors.primary.value}\`;
          member.style.outlineOffset = '2px';
        });
        
        member.addEventListener('blur', () => {
          member.style.outline = 'none';
        });
      });
    }
    
    setupImageLazyLoading() {
      // Enhanced lazy loading with fade-in effect
      const images = this.element.querySelectorAll('.member-image');
      
      images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        if (img.complete) {
          img.style.opacity = '1';
        } else {
          img.addEventListener('load', () => {
            img.style.opacity = '1';
          });
        }
        
        // Error handling
        img.addEventListener('error', () => {
          img.src = '/wp-content/plugins/obsidian/assets/images/placeholder-avatar.svg';
          img.style.opacity = '1';
        });
      });
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const teamSections = document.querySelectorAll('.obsidian-team-section');
    teamSections.forEach(section => {
      new ObsidianTeamSection(section);
    });
  });
  
  // Re-initialize if content is dynamically loaded
  document.addEventListener('obsidian:content-updated', function() {
    const teamSections = document.querySelectorAll('.obsidian-team-section:not([data-initialized])');
    teamSections.forEach(section => {
      section.setAttribute('data-initialized', 'true');
      new ObsidianTeamSection(section);
    });
  });
  
})(jQuery);

// Helper function to convert hex to RGB (would be processed by AI)
function hexToRgb(hex) {
  const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
  return result ? 
    \`\${parseInt(result[1], 16)}, \${parseInt(result[2], 16)}, \${parseInt(result[3], 16)}\` : 
    '0, 0, 0';
}`;
}
```

### Step 4: Verify Component Creation

```javascript
const result = await componentResponse.json();

if (result.success) {
  console.log('✅ Team component created successfully!');
  console.log('Component Details:', {
    handle: result.component.handle,
    type: result.component.type,
    scriptUrl: result.component.script_url,
    cssUrl: result.component.css_url
  });
} else {
  console.error('❌ Component creation failed:', result.message);
}
```

### Step 5: Verify Page Update

```javascript
// Get updated page to confirm component was added (no authentication required)
const updatedPageResponse = await fetch('/wp-json/obsidian-plugin/v1/pages/15');
const updatedPage = await updatedPageResponse.json();

console.log('✅ Page updated:', {
  title: updatedPage.title,
  status: updatedPage.status, // Should be 'draft'
  blocksCount: updatedPage.blocks.length,
  hasTeamComponent: updatedPage.content.includes('obsidian-team-section')
});
```

---

## Key Theme Integration Points

### 1. **Color Usage Strategy**
```javascript
// AI actively uses theme colors for semantic purposes:
const colorMapping = {
  primary: theme.colors.primary.value,    // #2563eb - Headings, CTAs, accents
  secondary: theme.colors.secondary.value, // #7c3aed - Secondary elements
  accent: theme.colors.accent.value,      // #06b6d4 - Highlights, hover states
  neutral: theme.colors.neutral.value,    // #64748b - Body text, descriptions
  base: theme.colors.base.value,          // #ffffff - Backgrounds
  contrast: theme.colors.contrast.value   // #1e293b - High contrast text
};
```

### 2. **Typography Consistency**
```javascript
// AI respects theme typography hierarchy:
const typographyUsage = {
  fontFamily: theme.typography.fontFamilies.inter.value, // Consistent font
  headingLarge: theme.typography.fontSizes['3xl'].value, // Section titles
  headingMedium: theme.typography.fontSizes.xl.value,   // Member names
  bodyLarge: theme.typography.fontSizes.lg.value,       // Subtitles
  bodyBase: theme.typography.fontSizes.base.value       // Descriptions
};
```

### 3. **Spacing Harmony**
```javascript
// AI uses theme spacing scale for consistent rhythm:
const spacingUsage = {
  sectionPadding: theme.spacing.sizes['160'].value, // 4rem - Large sections
  elementSpacing: theme.spacing.sizes['80'].value,  // 2rem - Between elements
  contentSpacing: theme.spacing.sizes['60'].value,  // 1.5rem - Content areas
  smallSpacing: theme.spacing.sizes['40'].value,    // 1rem - Small gaps
  microSpacing: theme.spacing.sizes['20'].value     // 0.5rem - Fine details
};
```

### 4. **Layout Constraints**
```javascript
// AI respects theme layout boundaries:
const layoutUsage = {
  maxWidth: theme.layout.wideSize,        // 64rem - Component max width
  contentWidth: theme.layout.contentSize, // 42rem - Text content width
  gridSystem: 'CSS Grid with theme spacing' // Consistent grid gaps
};
```

---

## Expected Result

The AI agent creates a professional team section that:

✅ **Perfectly matches the theme** - Uses exact colors, fonts, and spacing from theme.json  
✅ **Maintains visual consistency** - Looks like it was designed as part of the original theme  
✅ **Responsive design** - Works across all device sizes using theme breakpoints  
✅ **Accessible** - Proper ARIA labels, keyboard navigation, focus states  
✅ **Performance optimized** - Lazy loading, efficient animations, clean code  
✅ **Draft workflow** - Created as draft for user review before publishing  

### User Experience:
1. **User sees the request processed** - AI explains what it's creating
2. **Draft appears in Obsidian editor** - User can preview and edit
3. **Perfect theme integration** - Component looks native to the site
4. **User publishes when ready** - Full control over when content goes live

---

## Advanced Theme Integration Examples

### Dynamic Color Adaptation
```javascript
// AI can adapt to different theme color schemes
if (theme.colors.primary.value.includes('dark')) {
  // Adjust contrast ratios for dark themes
  cssVariables['--text-contrast'] = 'rgba(255, 255, 255, 0.9)';
} else {
  // Light theme adjustments
  cssVariables['--text-contrast'] = theme.colors.contrast.value;
}
```

### Typography Scale Awareness
```javascript
// AI understands typography relationships
const fontSizeScale = Object.keys(theme.typography.fontSizes);
const headingSize = fontSizeScale[fontSizeScale.length - 2]; // Second largest
const bodySize = theme.typography.fontSizes.base.value;
```

### Spacing Rhythm Calculation
```javascript
// AI calculates harmonious spacing relationships
const baseSpacing = parseFloat(theme.spacing.sizes['40'].value);
const sectionSpacing = baseSpacing * 4; // 4rem
const elementSpacing = baseSpacing * 2; // 2rem
const contentSpacing = baseSpacing * 1.5; // 1.5rem
```

This workflow demonstrates how the AI agent becomes a **theme-aware design system**, creating components that feel native to the site while maintaining the user's full control over the publishing process.