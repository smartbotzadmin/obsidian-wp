# Obsidian Plugin REST API Documentation

This document provides detailed information about the Obsidian Plugin REST API endpoints designed for AI agent integration.

## Base URL

```
https://your-wordpress-site.com/wp-json/obsidian/v1
```

## Authentication

Most endpoints require WordPress authentication with appropriate permissions:
- **Post editing**: `edit_post` capability for specific post
- **Site management**: `manage_options` capability
- **Menu management**: `edit_theme_options` capability

## Core Philosophy: Dynamic Component Generation

Unlike traditional page builders that rely on pre-built components, Obsidian empowers the AI agent to **generate custom components on-demand**. When a user requests a specific functionality (e.g., "add a team carousel"), the AI agent should:

1. **Generate the HTML structure** tailored to the user's needs
2. **Create custom JavaScript** for the specific functionality
3. **Generate accompanying CSS** for styling
4. **Inject the component** into the page at the desired location

This approach provides unlimited flexibility and ensures each component is perfectly suited to the user's requirements.

---

## Endpoints

### 1. Post Management

#### Get Post Data
**Endpoint:** `GET /posts/{id}`

**Description:** Retrieves post data including content, custom scripts, and metadata.

**Response Example:**
```json
{
  "id": 123,
  "title": "Sample Page",
  "content": "<!-- wp:paragraph -->...",
  "status": "draft",
  "type": "page",
  "permalink": "https://site.com/sample-page",
  "preview_url": "https://site.com/sample-page?preview=true",
  "custom_scripts": {
    "carousel-component-abc123": {
      "handle": "carousel-component-abc123",
      "src": "/wp-content/plugins/obsidian/assets/js/dynamic/carousel-component-abc123.js",
      "component_type": "carousel"
    }
  }
}
```

#### Update Post Content
**Endpoint:** `POST /posts/{id}`

**Parameters:**
- `title` (optional): New post title
- `content` (optional): New post content (Gutenberg blocks)

---

### 2. Dynamic Component Generation

#### Generate Dynamic Script
**Endpoint:** `POST /generate-script`

**Description:** Creates a new dynamic component with custom JavaScript and CSS.

**Parameters:**
- `component_type` (required): Type identifier (e.g., "carousel", "slider", "contact-form")
- `script_content` (required): JavaScript code for the component
- `css_content` (optional): CSS styles for the component
- `requirements` (optional): Description of component requirements

**Example Request:**
```json
{
  "component_type": "team-carousel",
  "requirements": "Responsive carousel showing team members with auto-play and navigation dots",
  "script_content": "(function($) {\n  class TeamCarousel {\n    constructor(element) {\n      this.element = element;\n      this.init();\n    }\n    \n    init() {\n      // Custom carousel logic here\n      const items = this.element.querySelectorAll('.team-member');\n      // Implementation...\n    }\n  }\n  \n  $(document).ready(() => {\n    $('.team-carousel').each(function() {\n      new TeamCarousel(this);\n    });\n  });\n})(jQuery);",
  "css_content": ".team-carousel {\n  position: relative;\n  overflow: hidden;\n}\n\n.team-member {\n  display: none;\n  text-align: center;\n}\n\n.team-member.active {\n  display: block;\n}"
}
```

**Response:**
```json
{
  "success": true,
  "component": {
    "handle": "obsidian-team-carousel-abc123",
    "type": "team-carousel",
    "script_url": "/wp-content/plugins/obsidian/assets/js/dynamic/obsidian-team-carousel-abc123.js",
    "css_url": "/wp-content/plugins/obsidian/assets/css/dynamic/obsidian-team-carousel-abc123.css",
    "version": "unique-version-id",
    "created": "2025-01-15 10:30:00"
  }
}
```

#### Add Dynamic Component to Post
**Endpoint:** `POST /posts/{id}/add-dynamic-component`

**Description:** Adds a generated dynamic component to a specific post.

**Parameters:**
- `component_handle` (required): Handle returned from generate-script
- `html_content` (required): HTML structure for the component
- `position` (optional): Where to insert ("start", "end", or block index)
- `config` (optional): Component-specific configuration

**Example Request:**
```json
{
  "component_handle": "obsidian-team-carousel-abc123",
  "html_content": "<div class=\"team-carousel\">\n  <div class=\"team-member active\">\n    <img src=\"/images/john.jpg\" alt=\"John Doe\">\n    <h3>John Doe</h3>\n    <p>CEO & Founder</p>\n  </div>\n  <div class=\"team-member\">\n    <img src=\"/images/jane.jpg\" alt=\"Jane Smith\">\n    <h3>Jane Smith</h3>\n    <p>CTO</p>\n  </div>\n</div>",
  "position": "end",
  "config": {
    "autoplay": true,
    "speed": 3000,
    "showDots": true
  }
}
```

---

### 3. Block Management

#### Add Block to Post
**Endpoint:** `POST /posts/{id}/blocks`

**Description:** Adds standard Gutenberg blocks to a post.

**Parameters:**
- `block_type` (required): Type of block ("html", "paragraph", "heading", etc.)
- `content` (required): Block content
- `position` (optional): Where to insert the block

**Example for HTML Block:**
```json
{
  "block_type": "html",
  "content": "<div class=\"custom-section\">\n  <h2>Custom HTML Section</h2>\n  <p>This is custom HTML content.</p>\n</div>",
  "position": "end"
}
```

---

### 4. Site Identity Management

#### Get Site Settings
**Endpoint:** `GET /site/settings`

**Response:**
```json
{
  "title": "My Website",
  "tagline": "Just another WordPress site",
  "icon_url": "https://site.com/wp-content/uploads/2025/01/favicon.png",
  "icon_id": 123
}
```

#### Update Site Settings
**Endpoint:** `POST /site/settings`

**Parameters:**
- `title` (optional): Site title
- `tagline` (optional): Site tagline
- `icon_id` (optional): Media ID for site icon

---

### 5. Menu Management

#### Get All Menus
**Endpoint:** `GET /menus`

#### Get Specific Menu
**Endpoint:** `GET /menus/{id}`

#### Update Menu
**Endpoint:** `POST /menus/{id}`

**Parameters:**
- `name` (optional): Menu name
- `items` (optional): Array of menu items

**Example Menu Items:**
```json
{
  "name": "Main Navigation",
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
      "parent": 2
    }
  ]
}
```

---

### 6. Draft Management

#### Create Draft
**Endpoint:** `POST /drafts`

**Parameters:**
- `title` (optional): Draft title
- `content` (optional): Initial content
- `type` (optional): Post type ("page" or "post")

#### Get Drafts
**Endpoint:** `GET /drafts`

**Description:** Returns list of user's draft posts.

---

## AI Agent Workflow Examples

### Example 1: Creating a Team Carousel

When user says: *"Add a team carousel showing our 4 team members with their photos and titles"*

1. **Generate the component:**
```javascript
POST /generate-script
{
  "component_type": "team-carousel",
  "requirements": "Display 4 team members with photos, names, titles, auto-rotation",
  "script_content": "/* Custom carousel JavaScript */",
  "css_content": "/* Responsive carousel styles */"
}
```

2. **Add to the page:**
```javascript
POST /posts/123/add-dynamic-component
{
  "component_handle": "returned-handle-from-step-1",
  "html_content": "<div class=\"team-carousel\">/* Team member HTML */</div>",
  "position": "end"
}
```

### Example 2: Creating a Contact Form

When user says: *"Add a contact form with name, email, message fields and validation"*

1. **Generate form component with validation:**
```javascript
POST /generate-script
{
  "component_type": "contact-form",
  "script_content": "/* Form validation and AJAX submission */",
  "css_content": "/* Form styling with error states */"
}
```

2. **Add form to page:**
```javascript
POST /posts/123/add-dynamic-component
{
  "html_content": "<form class=\"contact-form\">/* Form fields */</form>",
  "config": {
    "ajax_submit": true,
    "validation_rules": {
      "email": "required|email",
      "name": "required|min:2"
    }
  }
}
```

---

## Best Practices for AI Agents

### 1. Component Generation
- **Always generate unique, tailored code** rather than using templates
- **Include proper error handling** in JavaScript components
- **Make components responsive** by default
- **Follow accessibility guidelines** (ARIA labels, keyboard navigation)

### 2. HTML Structure
- Use **semantic HTML** elements
- Include **proper class names** for styling hooks
- Add **data attributes** for JavaScript targeting
- Ensure **valid HTML structure**

### 3. CSS Generation
- Use **CSS custom properties** for easy theming
- Include **responsive breakpoints**
- Follow **BEM methodology** for class naming
- Ensure **cross-browser compatibility**

### 4. JavaScript Best Practices
- Use **modern ES6+ syntax** when appropriate
- Include **proper event cleanup**
- Handle **edge cases and errors gracefully**
- Make components **configurable through data attributes**

### 5. Integration
- Always **test component functionality** after creation
- **Respect existing theme styles** and integrate smoothly
- **Provide fallbacks** for when JavaScript is disabled
- **Consider performance impact** of generated code

---

## Error Handling

All endpoints return standard HTTP status codes:
- `200`: Success
- `400`: Bad Request (missing parameters)
- `401`: Unauthorized
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

Error responses include details:
```json
{
  "code": "missing_params",
  "message": "Component type and script content are required",
  "data": {
    "status": 400,
    "params": ["component_type", "script_content"]
  }
}
```

---

## Theme Integration

The plugin automatically integrates with the Obsidian theme by:
- **Fetching theme settings** via `/theme/settings` proxy endpoint
- **Respecting theme colors and typography** in generated components
- **Using theme-defined spacing and layout** systems
- **Maintaining visual consistency** across all generated components

The AI agent should always consider the current theme settings when generating components to ensure visual harmony.