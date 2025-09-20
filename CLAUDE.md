# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Obsidian plugin called "Reading Highlight" that provides persistent text highlighting functionality across reading and source modes. The plugin uses Obsidian's native `==text==` syntax to store highlights directly in markdown files, ensuring seamless synchronization between modes. It features touch-optimized interactions for mobile devices and a modern, responsive design.

## Development Commands

- `npm install` - Install dependencies
- `npm run build` - Build the plugin (requires: `npx esbuild main.ts --bundle --outdir=. --format=cjs --platform=node --external:obsidian`)
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier
- `npm run dev` - Start development server with file watching
- `npm run copy` - Copy built plugin to Obsidian vault

## Key Features

1. **Persistent Highlight Storage**: Uses `==text==` syntax to store highlights directly in markdown files
2. **Cross-Mode Synchronization**: Highlights seamlessly sync between reading and source modes
3. **Mobile-Optimized Interface**: Touch-friendly popup menus with large buttons and gesture support
4. **Desktop Experience**: Floating highlight button with modern gradient design
5. **File-Based Storage**: Highlights persist across plugin reloads and file relocations
6. **Customizable Appearance**: Adjustable highlight colors and opacity for reading mode display
7. **Obsidian Native Integration**: Leverages built-in `==text==` highlighting syntax

## Architecture

### Main Components

- `main.ts` - Core plugin implementation with:
  - `ReadingHighlightPlugin` class - Main plugin logic
  - `ReadingHighlightSettingTab` - Settings interface
  - File-based highlight management using `==text==` syntax
  - Dual input handling: mouse (desktop) and touch (mobile)
  - Direct file modification for persistent storage
  - Smart positioning for mobile highlight menus

- `manifest.json` - Plugin metadata and distribution info
- `styles.css` - Responsive styling with mobile-optimized animations
- `package.json` - Dependencies and build scripts
- `tsconfig.json` - TypeScript configuration

### Source Files

- `main-real.ts` - Current implementation with persistent storage
- `main-simple.ts` - Simplified version for debugging
- `main-test.ts` - Basic testing version

### Mobile-Specific Features

- Touch-optimized popup menus with large buttons (44px minimum height)
- Smart menu positioning that avoids screen boundaries
- Gesture support with touch-action manipulation
- Responsive design with media queries for different screen sizes
- Native mobile animations and transitions
- Auto-dismiss on outside touch/click

### Settings Management

- Highlight color customization (affects reading mode display only)
- Opacity control (0.1-1.0) for reading mode highlights
- Toggle between button mode and direct highlighting
- Mobile-optimized settings interface

## File Structure

```
obsidian-reading-highlight/
├── main-real.ts     # Current implementation (persistent storage)
├── main-simple.ts   # Simplified debugging version
├── main-test.ts     # Basic testing version
├── main.ts          # Main plugin code (symlink to main-real.ts)
├── main.js          # Built plugin output
├── manifest.json    # Plugin metadata
├── styles.css       # Plugin styling with mobile optimization
├── package.json     # Dependencies and build scripts
├── tsconfig.json    # TypeScript config
├── dev.js           # Development utilities
└── CLAUDE.md        # This documentation file
```

## Development Notes

### Core Architecture

1. **File-Based Storage**: Instead of in-memory storage, highlights are saved directly to markdown files using `==text==` syntax
2. **Direct File Modification**: Uses `app.vault.read()` and `app.vault.modify()` to persist highlights
3. **Cross-Platform Input**: Dual event handling for desktop (mouseup) and mobile (touchend) interactions
4. **Obsidian Integration**: Leverages native `==text==` syntax, ensuring compatibility with core features
5. **Error Handling**: Comprehensive try-catch blocks for file operations and DOM manipulation

### Mobile Development Considerations

1. **Touch Event Handling**: Uses passive event listeners for better performance
2. **Smart Positioning**: Menus are positioned to avoid screen boundaries and device notches
3. **Responsive Design**: Media queries and touch-optimized CSS properties
4. **Gesture Support**: Implements touch-action manipulation for better touch response
5. **Performance**: Optimized for mobile devices with efficient event delegation

### Building and Deployment

The plugin uses ESBuild for fast TypeScript compilation and bundling. The `dev.js` utility handles automatic deployment to the Obsidian vault during development.

## User Experience

### Desktop Usage
1. Select any text in reading mode
2. Click the floating 🖍️ button that appears
3. Text is immediately highlighted and saved as `==text==` in the file
4. Switch to source mode to see the persistent `==text==` markers

### Mobile Usage
1. Long-press text to enter selection mode
2. Drag handles to adjust selection range
3. Release to see the highlight menu popup
4. Tap "高亮" to highlight or "取消" to dismiss
5. Menu is intelligently positioned to avoid screen edges

### Cross-Mode Sync
- **Reading Mode**: Shows colored highlights with customizable appearance
- **Source Mode**: Displays `==text==` syntax directly in markdown
- **Real-time Sync**: Changes in either mode are immediately reflected

## Plugin Deployment

The plugin is configured to automatically copy to the Obsidian vault at:
- **Vault Path**: `/mnt/c/Users/wuxiaobai24/test` (configurable via `OBSIDIAN_VAULT_PATH` env var)
- **Plugin Directory**: `.obsidian/plugins/reading-highlight`

Use `npm run copy` to deploy the plugin to your Obsidian vault after building.

## Testing

### Desktop Testing
1. **Development Mode**: Run `npm run dev` to start file watching and automatic building
2. **Manual Deployment**: Run `npm run copy` to copy built files to Obsidian
3. **In Obsidian**: Enable the plugin in Settings → Community plugins → Reading Highlight
4. **Test Features**:
   - Open any markdown file in reading mode
   - Select text and highlight using the floating button
   - Switch to source mode to verify `==text==` syntax
   - Test settings customization (colors, opacity)

### Mobile Testing
1. **Device Testing**: Test on actual mobile devices for touch interactions
2. **Responsive Design**: Verify menu positioning and button sizes
3. **Gesture Support**: Test touch selection and menu interactions
4. **Cross-Mode**: Verify highlights persist between reading and source modes

### Compatibility Testing
- **Obsidian Versions**: Test with minimum supported version (0.15.0+)
- **File Formats**: Test with various markdown file types
- **Special Characters**: Verify highlighting works with Unicode and special characters
- **Performance**: Test with large files and numerous highlights