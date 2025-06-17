# Obsidian Plugin REST API Documentation

This document provides detailed information about the Obsidian Plugin REST API endpoints designed for AI agent integration.

## Base URLs

**Plugin API (AI Agent):** `https://your-site.com/wp-json/obsidian-plugin/v1`  
**Theme API (Styling):** `https://your-site.com/wp-json/obsidian/v1`

> **Important:** Plugin and theme APIs are completely separate. The AI agent uses the plugin API for content management, while theme API handles styling and design tokens.

## Authentication

Most endpoints require WordPress authentication with appropriate permissions:
- **Page editing**: `edit_posts` capability
- **Site management**: `manage_options` capability  
- **Menu management**: `edit_theme_options` capability

## Core Philosophy: Draft-First Workflow

The AI agent **always works with drafts**. When a user requests changes:

1. **AI creates/modifies drafts only** - never published content
2. **User controls publishing** via the Obsidian editor interface
3. **History is preserved** through WordPress revisions
4. **No hallucination risk** from publish/save operations

This approach ensures the user maintains full control over what goes live.

---

## Endpoints

### 1. Page Management (High-Level Operations)

#### Read Page with Full Context
**Endpoint:** `GET /pages/{id}`

**Description:** Gets complete page information including content, blocks, metadata, and scripts.

**Response Example:**
```json
{
  "id": 123,
  "title": "About Us",
  "content": "<!-- wp:paragraph -->...",
  "status": "draft",
  "type": "page",
  "slug": "about-us",
  "permalink": "https://site.com/about-us",
  "preview_url": "https://site.com/about-us?preview=true&obsidian_preview=1",
  "modified": "2025-01-15T10:30:00+00:00",
  "author": "John Doe",
  "featured_image": "https://site.com/wp-content/uploads/hero.jpg",
  "excerpt": "Learn about our company...",
  "meta": {
    "seo_title": "About Our Company",
    "seo_description": "Discover our story...",
    "custom_scripts": {
      "team-carousel-abc123": {
        "handle": "team-carousel-abc123",
        "src": "/wp-content/plugins/obsidian/assets/js/dynamic/team-carousel-abc123.js"
      }
    }
  },
  "blocks": [
    {
      "blockName": "core/paragraph",
      "attrs": {},
      "innerBlocks": [],
      "innerHTML": "<p>Welcome to our company...</p>"
    }
  ]
}
```

#### Create New Page
**Endpoint:** `POST /pages`

**Description:** Creates a new page (always as draft).

**Parameters:**
- `title` (optional): Page title (default: "Untitled Page")
- `content` (optional): Page content as Gutenberg blocks
- `type` (optional): Post type ("page" or "post", default: "page")

**Example Request:**
```json
{
  "title": "New Landing Page",
  "content": "<!-- wp:paragraph --><p>Welcome to our new page!</p><!-- /wp:paragraph -->",
  "type": "page"
}
```

#### Update Page
**Endpoint:** `PUT /pages/{id}`

**Description:** Updates page content. If page is published, creates a new draft version.

**Parameters:**
- `title` (optional): New page title
- `content` (optional): New page content
- `excerpt` (optional): Page excerpt
- `custom_scripts` (optional): Array of custom scripts

**Smart Draft Handling:**
- If page is **published**: Creates new draft version, leaves published version untouched
- If page is **draft**: Updates the existing draft
- User decides when to publish via the Obsidian editor

#### Delete Page
**Endpoint:** `DELETE /pages/{id}`

**Description:** Permanently deletes a page.

---

### 2. Dynamic Component Creation

#### Create Component
**Endpoint:** `POST /components`

**Description:** Creates a dynamic component with custom HTML, CSS, and JavaScript.

**Parameters:**
- `type` (required): Component type identifier (e.g., "team-carousel", "contact-form")
- `html` (required): HTML structure for the component
- `css` (optional): CSS styles for the component
- `javascript` (optional): JavaScript functionality for the component
- `page_id` (optional): If provided, adds component to this page immediately

**Example Request:**
```json
{
  "type": "team-carousel",
  "html": "<div class=\"team-carousel\">\n  <div class=\"team-member\">\n    <img src=\"/images/john.jpg\" alt=\"John Doe\">\n    <h3>John Doe</h3>\n    <p>CEO & Founder</p>\n  </div>\n  <div class=\"team-member\">\n    <img src=\"/images/jane.jpg\" alt=\"Jane Smith\">\n    <h3>Jane Smith</h3>\n    <p>CTO</p>\n  </div>\n</div>",
  "css": ".team-carousel { position: relative; overflow: hidden; }\n.team-member { display: none; text-align: center; }\n.team-member.active { display: block; }",
  "javascript": "(function($) {\n  class TeamCarousel {\n    constructor(element) {\n      this.element = element;\n      this.init();\n    }\n    init() {\n      // Carousel logic here\n    }\n  }\n  $(document).ready(() => {\n    $('.team-carousel').each(function() {\n      new TeamCarousel(this);\n    });\n  });\n})(jQuery);",
  "page_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "component": {
    "handle": "obsidian-team-carousel-abc123",
    "type": "team-carousel",
    "html": "...",
    "script_url": "/wp-content/plugins/obsidian/assets/js/dynamic/obsidian-team-carousel-abc123.js",
    "css_url": "/wp-content/plugins/obsidian/assets/css/dynamic/obsidian-team-carousel-abc123.css",
    "version": "unique-version-id",
    "created": "2025-01-15 10:30:00"
  },
  "message": "Component created successfully"
}
```

---

### 3. Site Management

#### Get Site Information
**Endpoint:** `GET /site`

**Description:** Gets comprehensive site information including pages, menus, and settings.

**Response Example:**
```json
{
  "title": "My Website",
  "tagline": "Building amazing experiences",
  "url": "https://mysite.com",
  "admin_email": "admin@mysite.com",
  "language": "en_US",
  "timezone": "America/New_York",
  "icon": {
    "url": "https://mysite.com/wp-content/uploads/favicon.png",
    "id": 123
  },
  "theme": {
    "name": "Obsidian Theme Hello Child",
    "version": "1.0.0"
  },
  "pages": [
    {
      "id": 1,
      "title": "Home",
      "slug": "home",
      "status": "publish",
      "url": "https://mysite.com/",
      "modified": "2025-01-15T10:30:00+00:00"
    }
  ],
  "menus": [
    {
      "id": 2,
      "name": "Main Navigation",
      "locations": ["primary"]
    }
  ]
}
```

#### Update Site Information
**Endpoint:** `PUT /site`

**Parameters:**
- `title` (optional): Site title
- `tagline` (optional): Site tagline
- `icon_id` (optional): Media ID for site icon

---

### 4. Menu Management

#### Get All Menus
**Endpoint:** `GET /menus`

**Response Example:**
```json
[
  {
    "id": 2,
    "name": "Main Navigation",
    "slug": "main-navigation",
    "locations": ["primary"],
    "items": [
      {
        "id": 10,
        "title": "Home",
        "url": "/",
        "parent": 0,
        "order": 1
      },
      {
        "id": 11,
        "title": "About",
        "url": "/about",
        "parent": 0,
        "order": 2
      }
    ]
  }
]
```

#### Update Menu
**Endpoint:** `PUT /menus/{id}`

**Parameters:**
- `items` (required): Array of menu items

**Example Request:**
```json
{
  "items": [
    {
      "title": "Home",
      "url": "/",
      "parent": 0
    },
    {
      "title": "About",
      "url": "/about",
      "parent": 0
    },
    {
      "title": "Our Team",
      "url": "/about/team",
      "parent": 11
    }
  ]
}
```

---

### 5. Theme Integration

#### Get Theme Settings
**Endpoint:** `GET /theme`

**Description:** Proxy to theme API for getting design tokens (colors, typography, spacing).

**Response:** Same as theme API `/theme/settings` endpoint.

---

## AI Agent Workflow Examples

### Example 1: Creating a Complete Landing Page

When user says: *"Create a landing page for our new product with a hero section, features list, and contact form"*

```javascript
// 1. Create the page
const pageResponse = await fetch('/wp-json/obsidian-plugin/v1/pages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Product Landing Page',
    content: '<!-- wp:paragraph --><p>Landing page content will be added...</p><!-- /wp:paragraph -->'
  })
});

const page = await pageResponse.json();

// 2. Create hero component
const heroComponent = await fetch('/wp-json/obsidian-plugin/v1/components', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'hero-section',
    html: '<section class="hero">...</section>',
    css: '.hero { background: linear-gradient(...); }',
    javascript: '// Hero animations',
    page_id: page.data.id
  })
});

// 3. Create contact form component
const formComponent = await fetch('/wp-json/obsidian-plugin/v1/components', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    type: 'contact-form',
    html: '<form class="contact-form">...</form>',
    css: '.contact-form { ... }',
    javascript: '// Form validation and submission',
    page_id: page.data.id
  })
});
```

### Example 2: Updating Site Navigation

When user says: *"Update the main menu to include our new services page"*

```javascript
// 1. Get current site info
const siteInfo = await fetch('/wp-json/obsidian-plugin/v1/site');
const site = await siteInfo.json();

// 2. Find main menu
const mainMenu = site.menus.find(menu => menu.locations.includes('primary'));

// 3. Update menu with new item
const updatedMenu = await fetch(`/wp-json/obsidian-plugin/v1/menus/${mainMenu.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [
      { title: 'Home', url: '/', parent: 0 },
      { title: 'About', url: '/about', parent: 0 },
      { title: 'Services', url: '/services', parent: 0 }, // New item
      { title: 'Contact', url: '/contact', parent: 0 }
    ]
  })
});
```

---

## Best Practices for AI Agents

### 1. Always Work with Full Context
- Use `GET /pages/{id}` to get complete page information before making changes
- Consider existing content, blocks, and scripts when adding new components
- Respect the current page structure and flow

### 2. Component Generation
- **Generate unique, tailored components** for each specific use case
- **Include proper accessibility** (ARIA labels, keyboard navigation, semantic HTML)
- **Make components responsive** by default
- **Handle edge cases** in JavaScript (empty states, loading states, errors)

### 3. Draft-First Approach
- **Never modify published content directly**
- **Always create drafts** for AI-generated changes
- **Let users control publishing** through the editor interface
- **Preserve content history** through WordPress revisions

### 4. Integration with Theme
- **Fetch theme settings** via `/theme` endpoint before generating components
- **Use theme colors, fonts, and spacing** in generated CSS
- **Maintain visual consistency** with existing site design
- **Respect theme breakpoints** and layout constraints

### 5. Error Handling
- **Always validate responses** before proceeding with dependent operations
- **Provide meaningful error messages** to users
- **Handle network failures gracefully**
- **Don't make assumptions** about API success

---

## Error Responses

All endpoints return standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (missing/invalid parameters)
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

Error response format:
```json
{
  "code": "missing_params",
  "message": "Component type and HTML content are required",
  "data": {
    "status": 400,
    "params": ["type", "html"]
  }
}
```

---

## Separation from Theme API

The plugin API (`/obsidian-plugin/v1`) is completely separate from the theme API (`/obsidian/v1`):

**Plugin API handles:**
- Page/post content management
- Dynamic component creation
- Site structure (menus, pages)
- Draft workflow management

**Theme API handles:**
- Design tokens (colors, typography, spacing)
- Theme settings and customization
- Visual styling configuration

This separation ensures clean responsibilities and prevents conflicts between content management and styling operations.