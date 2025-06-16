# Obsidian Theme REST API Documentation

This document provides detailed information for testing the Obsidian Theme REST API endpoints using Postman or similar tools.

## Base URL

```
https://your-wordpress-site.com/wp-json/obsidian/v1
```

Replace `your-wordpress-site.com` with your actual WordPress site URL.

## Authentication

For endpoints that modify data (POST requests), you need to authenticate as a WordPress user with `edit_theme_options` capability (typically an Administrator).

### Method 1: Application Passwords (Recommended for API testing)

1. Go to WordPress Admin → Users → Your Profile
2. Scroll to "Application Passwords" section
3. Enter a name (e.g., "Postman") and click "Add New Application Password"
4. Copy the generated password (you won't see it again)

**In Postman:**
- Authorization Type: Basic Auth
- Username: Your WordPress username
- Password: The application password you generated

### Method 2: Cookie Authentication (For browser-based testing)

1. Log into WordPress admin
2. Get the authentication cookies from your browser
3. Include these cookies in your requests

### Method 3: Nonce (For plugin/theme integration)

Include the header:
```
X-WP-Nonce: YOUR_NONCE_HERE
```

Generate nonce in WordPress: `wp_create_nonce('wp_rest')`

## Endpoints

### 1. Get All Theme Settings

**Endpoint:** `GET /theme/settings`

**Description:** Retrieves all theme settings including colors, typography, spacing, and layout.

**Authentication:** Not required (public endpoint)

**Headers:**
```
Content-Type: application/json
```

**Response Example:**
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
    }
    // ... more colors
  },
  "typography": {
    "fontFamilies": {
      "inter": {
        "value": "'Inter', sans-serif",
        "name": "Inter"
      }
      // ... more fonts
    },
    "fontSizes": {
      "base": {
        "value": "1rem",
        "name": "Base"
      }
      // ... more sizes
    }
  },
  "spacing": {
    "sizes": {
      "40": {
        "value": "1rem",
        "name": "4"
      }
      // ... more sizes
    },
    "units": ["px", "em", "rem", "vh", "vw", "%"]
  },
  "layout": {
    "contentSize": "42rem",
    "wideSize": "64rem"
  }
}
```

### 2. Get Colors

**Endpoint:** `GET /theme/colors`

**Description:** Retrieves only the color settings.

**Authentication:** Not required

**Response Example:**
```json
{
  "primary": {
    "value": "#2563eb",
    "name": "Primary"
  },
  "secondary": {
    "value": "#7c3aed",
    "name": "Secondary"
  }
  // ... more colors
}
```

### 3. Update Colors

**Endpoint:** `POST /theme/colors`

**Description:** Updates theme colors. Changes are saved to theme.json.

**Authentication:** Required (Administrator)

**Headers:**
```
Content-Type: application/json
Authorization: Basic base64(username:application_password)
```

**Request Body:**
```json
{
  "colors": {
    "primary": {
      "value": "#ff0000"
    },
    "secondary": {
      "value": "#00ff00"
    }
  }
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Colors updated successfully",
  "colors": {
    "primary": {
      "value": "#ff0000"
    },
    "secondary": {
      "value": "#00ff00"
    }
  }
}
```

### 4. Get Typography

**Endpoint:** `GET /theme/typography`

**Description:** Retrieves typography settings including font families and sizes.

**Authentication:** Not required

**Response Example:**
```json
{
  "fontFamilies": {
    "inter": {
      "value": "'Inter', sans-serif",
      "name": "Inter"
    }
    // ... more fonts
  },
  "fontSizes": {
    "base": {
      "value": "1rem",
      "name": "Base"
    }
    // ... more sizes
  }
}
```

### 5. Update Typography

**Endpoint:** `POST /theme/typography`

**Description:** Updates typography settings. Changes are saved to theme.json.

**Authentication:** Required (Administrator)

**Headers:**
```
Content-Type: application/json
Authorization: Basic base64(username:application_password)
```

**Request Body:**
```json
{
  "typography": {
    "fontFamilies": {
      "inter": {
        "value": "'Roboto', sans-serif",
        "name": "Roboto"
      }
    },
    "fontSizes": {
      "base": {
        "value": "18px"
      }
    }
  }
}
```

### 6. Get Spacing

**Endpoint:** `GET /theme/spacing`

**Description:** Retrieves spacing settings.

**Authentication:** Not required

**Response Example:**
```json
{
  "sizes": {
    "40": {
      "value": "1rem",
      "name": "4"
    }
    // ... more sizes
  },
  "units": ["px", "em", "rem", "vh", "vw", "%"]
}
```

### 7. Get Layout

**Endpoint:** `GET /theme/layout`

**Description:** Retrieves layout settings.

**Authentication:** Not required

**Response Example:**
```json
{
  "contentSize": "42rem",
  "wideSize": "64rem"
}
```

### 8. Get Available Google Fonts

**Endpoint:** `GET /theme/google-fonts`

**Description:** Retrieves a curated list of available Google Fonts.

**Authentication:** Not required

**Response Example:**
```json
{
  "inter": {
    "name": "Inter",
    "category": "sans-serif",
    "variants": ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
  },
  "roboto": {
    "name": "Roboto",
    "category": "sans-serif",
    "variants": ["100", "300", "400", "500", "700", "900"]
  }
  // ... more fonts
}
```

## Postman Collection Setup

### 1. Create Environment Variables

In Postman, create an environment with these variables:

```
base_url: https://your-wordpress-site.com/wp-json/obsidian/v1
username: your-wordpress-username
app_password: your-application-password
```

### 2. Collection Authorization

Set collection-level authorization:
- Type: Basic Auth
- Username: `{{username}}`
- Password: `{{app_password}}`

### 3. Example Requests

#### Get All Settings (No Auth Required)
```
GET {{base_url}}/theme/settings
```

#### Update Primary Color
```
POST {{base_url}}/theme/colors
Authorization: Basic Auth
Content-Type: application/json

Body:
{
  "colors": {
    "primary": {
      "value": "#ff6b6b"
    }
  }
}
```

#### Update Body Font
```
POST {{base_url}}/theme/typography
Authorization: Basic Auth
Content-Type: application/json

Body:
{
  "typography": {
    "fontFamilies": {
      "inter": {
        "value": "'Lato', sans-serif",
        "name": "Lato"
      }
    }
  }
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "code": "rest_forbidden",
  "message": "Sorry, you are not allowed to do that.",
  "data": {
    "status": 401
  }
}
```

### 404 Not Found
```json
{
  "code": "rest_no_route",
  "message": "No route was found matching the URL and request method.",
  "data": {
    "status": 404
  }
}
```

### 400 Bad Request
```json
{
  "code": "rest_missing_callback_param",
  "message": "Missing parameter(s): colors",
  "data": {
    "status": 400,
    "params": ["colors"]
  }
}
```

## Testing Tips

1. **Test GET endpoints first** - They don't require authentication
2. **Use Application Passwords** - They're more secure and easier to manage than cookies
3. **Check theme.json** - After POST requests, verify changes in `/wp-content/themes/obsidian-theme-hello-child-/theme.json`
4. **Clear caches** - If changes don't appear, clear any caching plugins
5. **Check permissions** - Ensure your user has Administrator role

## Rate Limiting

WordPress doesn't impose rate limits by default, but your hosting provider might. If you encounter 429 errors, add delays between requests.

## CORS

If testing from a browser-based tool, ensure CORS is properly configured on your WordPress site. You may need to add headers:

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');