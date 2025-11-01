# ReelsPRO Extension - Store Submission Guide

**Version:** 0.2.7
**Last Updated:** November 1, 2025
**Manifest Version:** 3 (Chrome & Firefox)

---

## 📋 Table of Contents

1. [Pre-Submission Checklist](#pre-submission-checklist)
2. [Building for Production](#building-for-production)
3. [Creating Submission Packages](#creating-submission-packages)
4. [Chrome Web Store Submission](#chrome-web-store-submission)
5. [Firefox Add-ons Submission](#firefox-add-ons-submission)
6. [Important Notes](#important-notes)
7. [Troubleshooting](#troubleshooting)

---

## ✅ Pre-Submission Checklist

Before submitting to either store, ensure:

- [ ] All code is tested and working
- [ ] Version number is updated in all manifests (0.2.7)
- [ ] No console.log statements in production build
- [ ] All dependencies are up to date
- [ ] README.md is complete and accurate
- [ ] Privacy policy is available (if collecting data)
- [ ] Icon files are correctly named and referenced
- [ ] No references to original project names

---

## 🔨 Building for Production

### Step 1: Install Dependencies

```bash
cd ReelsPRO_Extension
npm install
```

### Step 2: Run Production Build

```bash
# For Chrome/Edge
npm run build

# This runs: NODE_ENV=production vite build
# Output will be in: dist/content.js (minified, no console logs)
```

### Step 3: Verify Build

```bash
# Check file size
ls -lh dist/content.js

# Verify no console statements
grep -c "console\." dist/content.js  # Should return 0

# Check build output
# Expected: ~21KB minified, ~6.7KB gzipped
```

---

## 📦 Creating Submission Packages

### Chrome Web Store Package

**Files to Include:**

```
ReelsPRO_Extension/
├── manifest.json          # Chrome Manifest V3
├── dist/
│   └── content.js        # Built bundle (minified)
├── src/
│   ├── background.js     # Service worker
│   ├── popup.html        # Extension popup
│   ├── popup.js          # Popup logic
│   ├── offscreen.html    # Offscreen document
│   ├── offscreen.js      # Offscreen worker
│   ├── constants.js      # Constants
│   ├── translations.js   # i18n support
│   ├── assets/
│   │   ├── rp-icon-48.png
│   │   ├── rp-icon-128.png
│   │   └── models/       # AI models (NSFW.js)
│   └── modules/
│       ├── detector.js
│       ├── errorHandler.js
│       ├── errorManager.js
│       ├── helpers.js
│       ├── observers.js
│       ├── performanceMonitor.js
│       ├── processing2.js
│       ├── queues.js
│       ├── settings.js
│       ├── style.js
│       └── videoTimeTracker.js
└── README.md (optional)
```

**Creating the ZIP:**

```bash
# Option 1: Using build script (if available)
npm run build:chrome

# Option 2: Manual creation
cd ReelsPRO_Extension
zip -r reelspro-chrome-0.2.7.zip \
  manifest.json \
  dist/ \
  src/ \
  -x "*.git*" "node_modules/*" "*.md" "package*.json"
```

### Firefox Add-ons Package

**Files to Include:**

Same as Chrome, but with:
- `manifest-firefox.json` renamed to `manifest.json` in the zip
- OR use `manifest-firefox.json` directly (AMO accepts both)

**Creating the ZIP:**

```bash
# Option 1: Using build script
npm run build:firefox

# Option 2: Manual creation
cd ReelsPRO_Extension
cp manifest-firefox.json manifest.json
zip -r reelspro-firefox-0.2.7.zip \
  manifest.json \
  dist/ \
  src/ \
  -x "*.git*" "node_modules/*" "*.md" "package*.json" "manifest.json.bak"
```

---

## 🌐 Chrome Web Store Submission

### Requirements

✅ **Manifest V3** - Required (already implemented)
✅ **No remote code** - All code is bundled
✅ **Service Worker** - Using `src/background.js`
✅ **Host Permissions** - Declared in `host_permissions`
✅ **Minimum Chrome 109** - Set in manifest

### Submission Steps

1. **Go to Chrome Web Store Developer Dashboard**
   - URL: https://chrome.google.com/webstore/devconsole
   - Sign in with your Google account

2. **Create New Item** (First time) OR **Update Existing**
   - Click "New Item" button
   - Upload `reelspro-chrome-0.2.7.zip`

3. **Fill Required Fields:**
   - **Name:** ReelsPRO
   - **Description:** (copy from manifest.json)
   - **Category:** Productivity or Social & Communication
   - **Language:** English
   - **Privacy Policy:** (required if using host_permissions)
   - **Screenshots:** At least 1 (1280x800 or 640x400)
   - **Promo Tile:** 440x280 (optional but recommended)

4. **Permissions Justification:**
   ```
   - storage: Save user settings and preferences
   - offscreen: Process images/videos for content detection
   - contextMenus: Enable/disable detection per video
   - host_permissions: Detect and blur content on all websites
   ```

5. **Review & Publish:**
   - Review all fields
   - Click "Submit for Review"
   - Review typically takes 1-3 business days

### Store Listing Details

**Short Description (132 chars max):**
```
Protect your privacy by auto-detecting and blurring unwanted content in images and videos across all websites.
```

**Detailed Description:**
```
ReelsPRO is a privacy-focused browser extension that automatically detects and blurs sensitive or unwanted content in images and videos across the web.

🔒 Privacy-First Design
• All processing happens locally on your device
• No data is sent to external servers
• No tracking or analytics

✨ Key Features
• Auto-detect and blur unwanted content in images and videos
• Real-time video time tracking with on-screen timer
• Customizable blur intensity and settings
• Hover to temporarily unblur content
• Whitelist specific websites
• Gender-specific detection options
• Works on YouTube, Instagram, Facebook, and all websites

🎯 Perfect For
• Privacy-conscious users
• Families and schools
• Professional environments
• Anyone wanting a safer browsing experience

⚙️ Customizable Settings
• Blur amount control
• Strictness levels
• Enable/disable for images or videos separately
• Grayscale option
• Blurry-start mode
• Per-video detection controls

🚀 Performance
• Lightweight and fast
• Uses advanced AI models (TensorFlow.js, NSFW.js)
• Minimal impact on browsing speed

📊 Video Time Tracking
• NEW! Track time spent watching videos and shorts
• Real-time timer overlay
• Daily totals and statistics

Open source and actively maintained.
```

---

## 🦊 Firefox Add-ons Submission

### Requirements (2025 Update)

✅ **Manifest V3** - Updated (was V2, now V3)
✅ **Extension ID** - Set in `browser_specific_settings.gecko.id`
✅ **Data Collection Disclosure** - Required as of Nov 3, 2025
✅ **No remote code** - All code is bundled
✅ **Source code** - Must be provided if using build tools

### Critical: Data Collection Permissions

**Our Configuration (No Data Collection):**
```json
"browser_specific_settings": {
  "gecko": {
    "id": "reelspro@reelspro.extension",
    "data_collection_permissions": {
      "required": ["none"]
    }
  }
}
```

This declares that the extension **does not collect or transmit** any personal data.

### Submission Steps

1. **Go to Firefox Add-on Developer Hub**
   - URL: https://addons.mozilla.org/developers/
   - Sign in with Firefox Account

2. **Submit New Add-on** OR **Update Existing**
   - Click "Submit a New Add-on"
   - Upload `reelspro-firefox-0.2.7.zip`

3. **Source Code Submission (REQUIRED)**

   Firefox requires source code for review. Create a source package:

   ```bash
   # Include everything needed to build
   zip -r reelspro-source-0.2.7.zip \
     src/ \
     vite.config.js \
     package.json \
     package-lock.json \
     tsconfig.json \
     manifest-firefox.json \
     README.md \
     SUBMISSION_GUIDE.md \
     -x "node_modules/*" "dist/*" ".git/*"
   ```

   **Include BUILD_INSTRUCTIONS.md:**
   ```markdown
   # Build Instructions for ReelsPRO v0.2.7

   ## Prerequisites
   - Node.js v18 or higher
   - npm v9 or higher

   ## Build Steps
   1. Install dependencies: `npm install`
   2. Build production: `npm run build`
   3. Output will be in: `dist/content.js`

   ## Verification
   - Check no console logs: `grep -c "console\." dist/content.js` (should be 0)
   - Verify minification: `ls -lh dist/content.js` (~21KB)

   ## Note
   All source code is unmodified except for Terser minification
   which removes console.log statements in production builds.
   ```

4. **Fill Required Fields:**
   - **Name:** ReelsPRO
   - **Summary:** (132 chars, same as Chrome)
   - **Categories:** Privacy & Security, Social & Communication
   - **Support Email:** contact2abhaygupta@gmail.com
   - **License:** MIT (or your chosen license)
   - **Privacy Policy:** Required

5. **Version Notes:**
   ```
   Version 0.2.7 Changes:
   - Updated to Manifest V3 (from V2)
   - Added data collection disclosure (none)
   - Fixed all production errors
   - Added video time tracking feature
   - Removed all console logging in production
   - Updated icons and branding
   - Complete code rebrand
   ```

6. **Review & Publish:**
   - Automated validation runs first
   - Manual review typically takes 1-7 days
   - More thorough than Chrome review

---

## 🔑 Important Notes

### Chrome-Specific

1. **Offscreen API:** Only available in Chrome 109+
   - Fallback not needed as minimum_chrome_version is set

2. **Service Worker Type:**
   - Set to `"type": "module"` for ES6 imports
   - Ensure background.js doesn't use `window` or `document`

3. **Host Permissions:**
   - Required for content scripts to access all sites
   - User will see "Read and change all your data" warning
   - Justify in store listing

### Firefox-Specific

1. **Extension ID:**
   - **CRITICAL:** Must be set for MV3
   - Format: `name@domain.extension`
   - Cannot be changed after submission

2. **Data Collection:**
   - **REQUIRED** as of November 3, 2025
   - Set to `["none"]` if not collecting data
   - Will be enforced for all extensions by H1 2026

3. **Background Scripts:**
   - Use `src/background-firefox.js` (browserAPI compatibility)
   - Array format: `"scripts": ["src/background-firefox.js"]`

4. **Source Code Review:**
   - **ALWAYS REQUIRED** for built/minified code
   - Include package.json and build instructions
   - All dependencies must be from npm or included

### Privacy Policy

**Required for both stores** when using host_permissions.

**Recommended Policy Points:**
```markdown
# Privacy Policy for ReelsPRO

## Data Collection
ReelsPRO does not collect, store, or transmit any personal data.

## Local Processing
All image and video processing occurs locally on your device.
No content is sent to external servers.

## Permissions Used
- storage: Save your preferences locally
- host_permissions: Access web pages to detect content
- contextMenus: Enable right-click menu options
- offscreen (Chrome): Process images without blocking UI

## Third-Party Services
None. This extension is fully self-contained.

## Changes to Policy
Updates will be posted on our GitHub repository.

Contact: contact2abhaygupta@gmail.com
```

---

## 🐛 Troubleshooting

### Build Issues

**Problem:** `vite: command not found`
```bash
# Solution
npm install
```

**Problem:** Build includes console.log statements
```bash
# Verify you're using production build
npm run build  # NOT npm run build:dev

# Check Terser is installed
npm list terser
```

**Problem:** Icons not found
```bash
# Verify icon files exist
ls -la src/assets/*.png

# Should show:
# rp-icon-48.png
# rp-icon-128.png
```

### Chrome Web Store

**Error:** "Manifest version 2 is deprecated"
- **Fix:** Using manifest.json (v3) - already correct

**Error:** "Background page must be a service worker"
- **Fix:** Already using service_worker in manifest

**Warning:** "Requires broad host permissions"
- **Expected:** Justify in submission form

### Firefox Add-ons

**Error:** "Extension ID required for Manifest V3"
- **Fix:** Already set in browser_specific_settings.gecko.id

**Error:** "Data collection permissions missing"
- **Fix:** Already added in manifest v0.2.7

**Error:** "Source code required"
- **Fix:** Always submit source code package with build instructions

**Error:** "Failed to build from source"
- **Fix:** Ensure package-lock.json is included
- **Fix:** Add detailed BUILD_INSTRUCTIONS.md

---

## 📊 Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.2.7 | Nov 1, 2025 | MV3 for Firefox, data collection disclosure, icon updates |
| 0.2.6 | Oct 2025 | Production error fixes, console removal |
| 0.2.5 | Oct 2025 | Initial release |

---

## 📞 Support

**Issues:** https://github.com/Abs6187/ReelsPRO/issues
**Email:** contact2abhaygupta@gmail.com
**Repository:** https://github.com/Abs6187/ReelsPRO

---

## ✅ Final Checklist Before Submission

- [ ] Version updated to 0.2.7 in all files
- [ ] Production build completed successfully
- [ ] No console statements in dist/content.js
- [ ] Icons renamed to rp-icon-*.png
- [ ] Chrome manifest.json uses MV3 with host_permissions
- [ ] Firefox manifest uses MV3 with data_collection_permissions
- [ ] ZIP files created and tested
- [ ] Source code package prepared (Firefox)
- [ ] Store listing descriptions written
- [ ] Screenshots prepared (1280x800 minimum)
- [ ] Privacy policy published
- [ ] Support email configured

---

**Good luck with your submission! 🚀**
