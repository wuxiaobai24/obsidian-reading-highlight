# Reading Highlight for Obsidian

A powerful text highlighting plugin for Obsidian that seamlessly works in both reading and source modes. Select any text in reading mode and apply persistent highlights that are saved directly to your markdown files using Obsidian's native `==text==` syntax.

## ✨ Features

### 📝 Persistent Highlighting
- **File-based storage**: Highlights are saved directly to your markdown files using `==highlighted text==` format
- **Cross-mode synchronization**: Highlights seamlessly appear in both reading and source modes
- **Obsidian native syntax**: Uses standard Obsidian highlighting syntax that works across all platforms

### 🖥️ Desktop Experience
- **Floating highlight button**: Beautiful, modern button that appears when text is selected
- **One-click highlighting**: Select text and click to highlight instantly
- **Keyboard-friendly**: Full keyboard navigation support

### 📱 Mobile-Optimized
- **Touch-optimized interface**: Smart popup menus positioned near your text selection
- **Large touch targets**: Buttons sized for comfortable mobile interaction
- **Responsive design**: Adapts perfectly to different screen sizes
- **Gesture support**: Natural touch interactions for highlighting

### 🎨 Customizable Appearance
- **Color customization**: Choose any highlight color that matches your style
- **Opacity control**: Adjust transparency to your preference (0.1-1.0)
- **Professional styling**: Modern, clean design with smooth animations

### 🔧 Flexible Configuration
- **Button visibility toggle**: Choose between automatic highlighting or button-activated mode
- **Mobile detection**: Automatically adapts interface for mobile devices
- **Settings synchronization**: Preferences saved and synced across devices

## 🚀 Installation

### From Obsidian Community Plugins (Recommended)
1. Open Obsidian
2. Go to **Settings** → **Community plugins**
3. Click **Browse** and search for "Reading Highlight"
4. Click **Install** and then **Enable**

### Manual Installation
1. Download the latest release from the [GitHub Releases](https://github.com/your-username/obsidian-reading-highlight/releases) page
2. Extract the downloaded zip file
3. Copy the `obsidian-reading-highlight` folder to your Obsidian vault's `.obsidian/plugins/` directory
4. Enable the plugin in **Settings** → **Community plugins**

## 📖 Usage Guide

### Desktop Usage

#### Automatic Highlighting (Default)
1. Open any markdown file in **Reading Mode**
2. Select text with your mouse
3. Text is automatically highlighted! ✨

#### Button-Activated Highlighting
1. Enable "Show highlight button" in plugin settings
2. Select text in reading mode
3. Click the floating highlight button 🖍️ that appears
4. Your selected text will be highlighted

### Mobile Usage

#### Touch to Highlight
1. Open any markdown file in **Reading Mode**
2. Long-press and drag to select text
3. A popup menu appears near your selection
4. Tap **"高亮"** (Highlight) to apply highlighting
5. Tap **"取消"** (Cancel) to dismiss the menu

#### Mobile Tips
- **Menu positioning**: The popup automatically positions itself to stay on screen
- **Touch targets**: All buttons are sized for comfortable touch interaction
- **Gesture support**: Natural touch interactions just like native apps

### Removing Highlights

#### In Reading Mode
- **Desktop**: Click directly on any highlighted text to remove it
- **Mobile**: Tap on highlighted text to remove it

#### In Source Mode
- Simply edit the `==highlighted text==` markup directly
- Remove the `==` symbols around the text

## ⚙️ Settings

Access settings via **Settings** → **Community plugins** → **Reading Highlight** → **Options**

### Highlight Color
- Choose any color for your highlights
- Default: Warm yellow (#ffeb3b)
- Supports full color picker with preview

### Highlight Opacity
- Adjust transparency from 10% to 100%
- Default: 30% (0.3)
- Helps highlights blend with your theme

### Show Highlight Button
- **Enabled**: Requires clicking button to highlight (more control)
- **Disabled**: Automatic highlighting on text selection (faster workflow)
- Default: Enabled

## 🛠️ Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Obsidian installed for testing

### Setup
```bash
# Clone the repository
git clone https://github.com/your-username/obsidian-reading-highlight.git
cd obsidian-reading-highlight

# Install dependencies
npm install

# Build the plugin
npm run build

# Copy to Obsidian vault (or use npm run dev for development)
npm run copy
```

### Development Commands
```bash
npm run dev        # Start development with file watching
npm run build      # Build the plugin
npm run lint       # Run code quality checks
npm run format     # Format code with Prettier
npm run copy       # Copy built plugin to Obsidian
```

### Testing
1. Run `npm run dev` to start file watching
2. Copy files to your Obsidian vault's plugins directory
3. Enable the plugin in Obsidian settings
4. Test on both desktop and mobile devices

## 🏗️ Architecture

### Core Components
- **ReadingHighlightPlugin**: Main plugin class handling all functionality
- **ReadingHighlightSettingTab**: Settings interface with live preview
- **Mobile Detection**: Automatic device detection and UI adaptation
- **Event Management**: Cross-platform event handling (mouse + touch)

### Technical Implementation
- **File-based persistence**: Direct markdown file modification using Obsidian vault API
- **Cross-mode sync**: Uses Obsidian's native `==text==` highlighting syntax
- **Mobile optimization**: Touch events, responsive design, smart positioning
- **Performance optimized**: Minimal DOM manipulation, efficient file operations

### File Structure
```
obsidian-reading-highlight/
├── main.ts              # Main plugin implementation
├── main.js              # Built plugin output
├── manifest.json        # Plugin metadata
├── styles.css           # Plugin styling (mobile-responsive)
├── package.json         # Dependencies and build scripts
├── tsconfig.json        # TypeScript configuration
├── README.md           # This file
└── CLAUDE.md           # Technical documentation
```

## 📱 Mobile Experience

### Touch Optimization
- **Smart popup menus**: Positioned near text selection, auto-adjusts to screen boundaries
- **Large touch targets**: Minimum 44px height for comfortable tapping
- **Gesture support**: Natural touch interactions with visual feedback
- **Performance**: Smooth animations and responsive interactions

### Responsive Design
- **Adaptive layouts**: Different button sizes and spacing for mobile vs desktop
- **Screen boundary detection**: Menus automatically reposition to stay visible
- **Theme compatibility**: Works with both light and dark themes

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

### Development Guidelines
- Follow TypeScript best practices
- Test on both desktop and mobile devices
- Use Prettier for code formatting
- Add JSDoc comments for public methods
- Include tests for new features

### Reporting Issues
Please include:
- Obsidian version
- Plugin version
- Operating system and device
- Steps to reproduce the issue
- Expected vs actual behavior

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Obsidian API](https://docs.obsidian.md/Plugins/Getting+started/Build+a+plugin)
- Inspired by the need for seamless reading-to-editing workflow
- Thanks to the Obsidian community for feedback and suggestions

## 🔄 Changelog

### v1.1.0 (Current)
- ✅ **Persistent highlighting**: Highlights now save directly to markdown files
- 🎨 **Modern icons**: Professional SVG icons replacing simple emoji
- 📱 **Mobile optimization**: Complete touch-optimized interface
- ⚙️ **Settings revamp**: More intuitive configuration options
- 🐛 **Bug fixes**: Resolved loading and functionality issues

### v1.0.0
- 🎉 Initial release
- 📝 Basic text highlighting functionality
- 🖥️ Desktop support with floating button

---

**Made with ❤️ for the Obsidian community**

For questions, suggestions, or issues, please visit our [GitHub repository](https://github.com/wuxiaobai24/obsidian-reading-highlight).

## 📁 Project Structure

### Core Files
- **`main.ts`** → Main plugin implementation (symlink to main-real.ts)
- **`main-real.ts`** → Complete plugin with persistent storage and mobile optimization
- **`main.js`** → Built plugin output (compiled from TypeScript)
- **`manifest.json`** → Plugin metadata and configuration
- **`styles.css`** → Mobile-responsive styling with animations

### Development Files
- **`main-simple.ts`** → Simplified version for debugging and testing
- **`main-test.ts`** → Basic testing version with minimal functionality
- **`test-simple.js/.ts`** → Testing utilities and scripts
- **`dev.js`** → Development server and deployment utilities
- **`tsconfig.json`** → TypeScript compiler configuration

### Configuration Files
- **`package.json`** → Node.js dependencies and build scripts
- **`package-lock.json`** → Dependency version lock file
- **`CLAUDE.md`** → Technical documentation for Claude Code
- **`simple-test-manifest.json`** → Test configuration for development

### Resources
- **`icons/`** → SVG icon files for the plugin interface
  - `highlighter-flat.svg` → Flat design highlighter icon
  - `highlighter-gradient.svg` → Modern gradient highlighter icon
  - `marker-minimal.svg` → Minimal marker icon
  - `star-highlight.svg` → Star-style highlight icon

### Key Features by File
- **main-real.ts**: Core highlighting logic, file persistence, cross-mode sync
- **styles.css**: Touch-optimized UI, responsive design, animations
- **dev.js**: Automated deployment to Obsidian vault during development
- **manifest.json**: Plugin ID, version, compatibility settings
- **icons/**: Professional vector graphics for mobile and desktop interfaces