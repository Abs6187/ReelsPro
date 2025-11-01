# ReelsPRO Browser Extension - Build Instructions

## Overview
This document provides complete step-by-step instructions to build the ReelsPRO browser extension from source code for both Chrome and Firefox browsers.

## System Requirements

### Operating System
- **Linux**: Ubuntu 20.04 or later (tested)
- **macOS**: 10.15 or later
- **Windows**: 10 or later

### Required Software

#### Node.js
- **Version Required**: 18.0.0 or later
- **Tested Version**: v22.21.0
- **Installation**:
  - Visit https://nodejs.org/
  - Download and install the LTS (Long Term Support) version
  - Verify installation: `node --version`

#### npm (Node Package Manager)
- **Version Required**: 8.0.0 or later
- **Tested Version**: 10.9.4
- **Installation**: Comes bundled with Node.js
- **Verify installation**: `npm --version`

#### Git (Optional, for cloning repository)
- **Version**: Any recent version
- **Installation**: https://git-scm.com/downloads

## Pre-Build Information

### Source Files Structure
The extension source code includes:
- **JavaScript/TypeScript source files**: All `.js`, `.ts` files in `src/` directory
- **Manifest files**: `manifest.json` (Chrome), `manifest-firefox.json` (Firefox)
- **Build scripts**: Located in `scripts/` directory
- **AI Model files**: Pre-trained NSFW detection model in `src/assets/models/nsfwjs/`
  - `model.json` - Model architecture (131 KB)
  - `group1-shard1of1` - Model weights (2.5 MB)
  - `group1-shard1of5.bin` through `group1-shard5of5.bin` - Model weights (total ~17 MB)
- **TensorFlow.js files**: Located in `tfjs/` directory
- **Assets**: Icons and resources in `src/assets/`

### Build Process Overview
The build process performs the following steps:
1. Installs all required npm dependencies
2. Transpiles and bundles TypeScript/ES6+ code using Vite
3. Copies all necessary files to a build directory
4. Creates a ZIP archive for distribution

**Note**: Only the `src/content.ts` file is transpiled to `dist/content.js`. All other source files (background scripts, popup, modules) remain in their original, non-minified form.

## Step-by-Step Build Instructions

### Step 1: Navigate to Extension Directory
```bash
cd ReelsPRO_Extension
```

### Step 2: Install Dependencies
```bash
npm install
```

**What this does**:
- Reads `package.json` to determine required packages
- Downloads and installs all dependencies to `node_modules/`
- Creates/updates `package-lock.json` for reproducible builds
- Installs development dependencies including:
  - `vite` - Build tool for bundling content script
  - `typescript` - TypeScript compiler
  - `bestzip` - ZIP file creation utility
  - `@tensorflow/tfjs` and `nsfwjs` - AI model dependencies

**Expected output**: Should show package installation progress and complete without errors.

**Warning messages you can ignore**:
- Deprecated package warnings (domexception, abab)
- Husky git hooks warnings
- Optional dependency warnings

### Step 3: Build the Extension

#### For Chrome/Edge:
```bash
npm run build:chrome
```

**What this does**:
1. Runs `NODE_ENV=production vite build` to create `dist/content.js`
2. Executes `scripts/build-chrome.cjs` which:
   - Creates `build-chrome/` temporary directory
   - Copies `manifest.json` to build directory
   - Copies Chrome-compatible background script (`src/background.js`)
   - Copies all source files: popup, offscreen, constants, translations
   - Recursively copies directories:
     - `dist/` - Built content script
     - `src/assets/` - **Including all model files** (~20MB)
     - `src/modules/` - Helper modules
     - `tfjs/` - TensorFlow.js runtime files
   - Creates `extension-chrome.zip` in the root directory
   - Cleans up temporary build directory

**Expected output**:
```
> reelspro-extension@0.2.7 build
> NODE_ENV=production vite build

vite v5.4.21 building for production...
✓ 9 modules transformed.
dist/content.js  21.36 kB │ gzip: 6.71 kB
✓ built in 568ms

Building Chrome extension...
Creating Chrome package...
Chrome extension packaged successfully!
Chrome build complete!
```

**Output file**: `extension-chrome.zip` (approximately 20-25 MB)

#### For Firefox:
```bash
npm run build:firefox
```

**What this does**:
1. Runs `NODE_ENV=production vite build` to create `dist/content.js`
2. Executes `scripts/build-firefox.cjs` which:
   - Creates `build-firefox/` temporary directory with proper structure
   - Copies `manifest-firefox.json` as `manifest.json` in build root
   - Copies Firefox-compatible background script (`src/background-firefox.js`)
   - Copies all source files maintaining `src/` directory structure
   - Recursively copies directories:
     - `dist/` - Built content script
     - `src/assets/` - **Including all model files** (~20MB)
     - `src/modules/` - Helper modules
     - `tfjs/` - TensorFlow.js runtime files
   - Creates `extension-firefox.zip` in the root directory
   - Cleans up temporary build directory

**Expected output**:
```
> reelspro-extension@0.2.7 build
> NODE_ENV=production vite build

vite v5.4.21 building for production...
✓ 9 modules transformed.
dist/content.js  21.36 kB │ gzip: 6.71 kB
✓ built in 568ms

Building Firefox extension...
Creating Firefox package...
Firefox extension packaged successfully!
Firefox build complete!
```

**Output file**: `extension-firefox.zip` (approximately 20-25 MB)

#### For Both Browsers:
```bash
npm run build:all
```

**What this does**: Runs both Chrome and Firefox builds sequentially.

**Output files**:
- `extension-chrome.zip`
- `extension-firefox.zip`

## Verifying the Build

### Check Output Files
```bash
ls -lh extension-*.zip
```

You should see:
- `extension-chrome.zip` (~20-25 MB)
- `extension-firefox.zip` (~20-25 MB)

### Verify ZIP Contents

#### For Chrome:
```bash
unzip -l extension-chrome.zip | head -30
```

Should contain:
- `manifest.json`
- `background.js`, `popup.js`, `popup.html`, `offscreen.js`, `offscreen.html`
- `constants.js`, `translations.js`
- `dist/content.js`
- `assets/` directory with icons and **model files**
- `modules/` directory with all helper scripts
- `tfjs/` directory with TensorFlow.js files

#### For Firefox:
```bash
unzip -l extension-firefox.zip | head -30
```

Should contain:
- `manifest.json` (Firefox version at root)
- `src/background.js`, `src/popup.js`, `src/popup.html`
- `src/constants.js`, `src/translations.js`
- `dist/content.js`
- `src/assets/` directory with icons and **model files**
- `src/modules/` directory with all helper scripts
- `tfjs/` directory with TensorFlow.js files

### Verify Model Files are Included
```bash
unzip -l extension-firefox.zip | grep "models/nsfwjs"
```

Should show all 7 model files:
- `model.json`
- `group1-shard1of1`
- `group1-shard1of5.bin` through `group1-shard5of5.bin`

## Testing the Extension

### Chrome/Edge Testing
1. Open Chrome/Edge browser
2. Navigate to `chrome://extensions/` or `edge://extensions/`
3. Enable "Developer mode" (toggle in top-right)
4. Extract `extension-chrome.zip` to a folder
5. Click "Load unpacked"
6. Select the extracted folder
7. Extension should load without errors

### Firefox Testing
1. Open Firefox browser
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `extension-firefox.zip` file (or extract and select `manifest.json`)
5. Extension should load without errors

### Functionality Testing
After loading:
1. Click extension icon - popup should open
2. Visit a webpage with images (e.g., news site)
3. Extension should process images in background
4. Check browser console (F12) - should see extension logs
5. Model files should load successfully from the extension

## Troubleshooting

### Build Fails: "vite: not found"
**Solution**: Run `npm install` to install dependencies first.

### Build Fails: "bestzip: command not found"
**Solution**: Ensure `bestzip` is installed via `npm install`.

### ZIP file is too small (< 10 MB)
**Problem**: Model files might not be included.
**Solution**:
- Check that `src/assets/models/nsfwjs/` directory exists with all files
- Verify build script copies `src/assets/` recursively
- Run build again with `npm run build:chrome` or `npm run build:firefox`

### Extension won't load in browser
**Solution**:
- Check browser console for errors
- Verify manifest.json is valid JSON
- Ensure all referenced files in manifest exist in the ZIP

### Model files won't load in extension
**Solution**:
- Verify model files are in correct directory structure
- Check web_accessible_resources in manifest.json includes "src/assets/*"
- Check browser console for 404 errors

## Additional Build Scripts

### Development Build (with watch mode)
```bash
npm run dev
```
Watches for file changes and rebuilds automatically.

### Type Checking
```bash
npm run type-check
```
Validates TypeScript types without building.

### Linting
```bash
npm run lint        # Check code formatting
npm run lint:fix    # Auto-fix formatting issues
```

### Testing
```bash
npm run test              # Run tests once
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
```

## Build Environment Details

### Dependencies (from package.json)

#### Runtime Dependencies:
- `@tensorflow/tfjs: ^4.22.0` - TensorFlow.js library for AI model
- `nsfwjs: ^4.2.0` - NSFW content detection model

#### Development Dependencies:
- `vite: ^5.4.8` - Build tool and bundler
- `typescript: ^5.6.3` - TypeScript compiler
- `bestzip: ^2.2.1` - ZIP file creation
- `@types/chrome: ^0.0.277` - TypeScript types for Chrome extensions
- `prettier: ^3.3.3` - Code formatter
- `jest: ^29.7.0` - Testing framework

### Build Configuration

#### vite.config.js
Configures Vite to:
- Build `src/content.ts` to `dist/content.js`
- Use Terser for minification
- Target ES2020 JavaScript
- Generate sourcemaps for debugging

#### tsconfig.json
TypeScript configuration:
- Target: ES2020
- Module: ESNext
- Includes type definitions for Chrome extensions

## Support and Contact

For build issues or questions:
- GitHub Issues: https://github.com/Abs6187/ReelsPRO/issues
- Email: contact2abhaygupta@gmail.com

## License
MIT License - See LICENSE file for details

---

**Last Updated**: 2024-11-01
**Extension Version**: 0.2.9
**Document Version**: 1.1
