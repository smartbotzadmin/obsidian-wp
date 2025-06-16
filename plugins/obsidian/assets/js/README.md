# Obsidian Editor JavaScript Architecture

This document outlines the modular JavaScript architecture for the Obsidian Editor, following Elementor's best practices for maintainable and scalable code organization.

## Directory Structure

```
plugins/obsidian/assets/js/
├── packages/
│   ├── icons/
│   │   └── index.js              # SVG icon components
│   ├── ui/
│   │   └── index.js              # Reusable UI components
│   ├── components/
│   │   ├── index.js              # Main editor components
│   │   ├── app.js                # Main app component
│   │   ├── preview-frame.js      # Preview frame with responsive controls
│   │   └── modals.js             # Modal components
│   ├── store/                    # State management (future)
│   └── utils/                    # Utility functions (future)
├── app.js                        # Legacy monolithic file (deprecated)
└── app-loader.js                 # App initialization and dependency management
```

## Package Dependencies

### 1. Icons Package (`packages/icons/index.js`)
- **Dependencies**: React
- **Exports**: `window.ObsidianIcons`
- **Contains**: All SVG icon components (SendIcon, SettingsIcon, MonitorIcon, etc.)
- **Purpose**: Centralized icon system for consistent UI elements

### 2. UI Package (`packages/ui/index.js`)
- **Dependencies**: React, ObsidianIcons
- **Exports**: `window.ObsidianUI`
- **Contains**: Reusable UI components (Button, Modal, TextArea, etc.)
- **Purpose**: Base UI building blocks for the editor interface

### 3. Components Package (`packages/components/index.js`)
- **Dependencies**: React, ObsidianIcons, ObsidianUI
- **Exports**: `window.ObsidianComponents`
- **Contains**: Main editor components (Sidebar, TopBar, ResponsiveControls, etc.)
- **Purpose**: High-level editor functionality components

### 4. Preview Frame Component (`packages/components/preview-frame.js`)
- **Dependencies**: React, ObsidianComponents
- **Exports**: Extends `window.ObsidianComponents.PreviewFrame`
- **Contains**: Responsive preview frame with resize controls
- **Purpose**: Device-specific preview functionality

### 5. Modal Components (`packages/components/modals.js`)
- **Dependencies**: React, ObsidianUI
- **Exports**: Extends `window.ObsidianComponents.ExitModal`
- **Contains**: Modal dialogs (ExitModal, etc.)
- **Purpose**: User interaction dialogs

### 6. App Component (`packages/components/app.js`)
- **Dependencies**: React, ObsidianUI, ObsidianComponents, PreviewFrame, Modals
- **Exports**: Extends `window.ObsidianComponents.ObsidianApp`
- **Contains**: Main application component and layout
- **Purpose**: Root application component

### 7. App Loader (`app-loader.js`)
- **Dependencies**: ReactDOM, all packages
- **Purpose**: Initialize the React application with dependency checking

## Loading Order

The packages are loaded in the following order to ensure proper dependency resolution:

1. **React/ReactDOM** (WordPress core or CDN)
2. **obsidian-icons** - Icon system
3. **obsidian-ui** - UI components
4. **obsidian-components** - Main components
5. **obsidian-preview-frame** - Preview functionality
6. **obsidian-modals** - Modal dialogs
7. **obsidian-app-component** - Main app
8. **obsidian-app-loader** - App initialization

## Key Features

### Modular Architecture
- **Separation of Concerns**: Each package has a specific responsibility
- **Dependency Management**: Clear dependency chain prevents circular dependencies
- **Reusability**: Components can be reused across different parts of the editor
- **Maintainability**: Smaller, focused files are easier to maintain and debug

### Professional Responsive System
- **Device Switching**: Desktop, Tablet, Mobile views with proper constraints
- **Resizable Frames**: Drag-to-resize functionality for tablet/mobile previews
- **Visual Feedback**: Real-time dimension indicators and professional styling
- **Constraint Enforcement**: Min/max dimensions per device type

### Component-Based UI
- **Reusable Components**: Button, Modal, TextArea, etc.
- **Consistent Styling**: All components follow the same design system
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized React components with proper state management

## Migration from Legacy Code

The original `app.js` file (513+ lines) has been refactored into:
- **Icons**: 75 lines
- **UI Components**: 144 lines  
- **Main Components**: 243 lines
- **Preview Frame**: 105 lines
- **Modals**: 49 lines
- **App Component**: 58 lines
- **App Loader**: 42 lines

**Total**: ~716 lines across 7 focused files (vs 513 lines in 1 monolithic file)

## Benefits

1. **Maintainability**: Easier to find and fix issues in specific components
2. **Scalability**: New features can be added as separate packages
3. **Testing**: Individual components can be tested in isolation
4. **Performance**: Only necessary components are loaded
5. **Collaboration**: Multiple developers can work on different packages simultaneously
6. **Code Reuse**: Components can be shared across different editor modes

## Future Enhancements

- **Store Package**: Centralized state management with Redux or Zustand
- **Utils Package**: Common utility functions and helpers
- **API Package**: Centralized API communication layer
- **Testing**: Unit tests for each package
- **Build Process**: Webpack/Rollup for optimized bundles