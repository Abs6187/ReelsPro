# Release v0.2.9 - Firefox AMO & Chrome Web Store Ready

## 🎯 Summary

This PR releases **ReelsPRO Browser Extension v0.2.9** with full compliance for Firefox Add-ons (AMO) and Chrome Web Store submissions. All validation errors have been resolved and both extension packages are ready for immediate submission.

## 📦 What's New in v0.2.9

### Version Updates
- Bumped version to **0.2.9** across all manifests and package.json
- Updated BUILD_INSTRUCTIONS.md to version 1.1

### 📦 **NEW: Complete Source Code Package**
- Created `reelspro-source-v0.2.9.zip` for Firefox AMO source code submission
- Includes all source files, build scripts, and documentation
- **Build tested and verified** - successfully reproduces extension-firefox.zip
- Size: ~18MB (51 files total)
- Contains: All source code, all 7 model files, build scripts, package.json with locked dependencies

### 🦊 Firefox AMO Compliance

Following **Firefox Extension Workshop** guidelines, all validation errors have been fixed:

#### Critical Fixes
- ✅ **Background script path**: Fixed reference from `src/background-firefox.js` to `src/background.js` (file now exists at correct location)
- ✅ **Manifest compatibility**: Removed `background.type` field and bumped minimum Firefox version to 112.0
- ✅ **Icon size mismatch**: Removed incorrect 16px icon entry that referenced 48px file
- ✅ **ZIP structure**: Files packaged at root level (no wrapper directories)

#### Security Improvements
- ✅ **innerHTML sanitization**: Replaced with `textContent` in style.js (3 instances fixed)
- ✅ **Security documentation**: Added detailed comments explaining safe innerHTML usage in popup.js

### 📋 Firefox Extension Workshop Requirements Met

#### Source Code Submission
- ✅ Comprehensive BUILD_INSTRUCTIONS.md with step-by-step instructions
- ✅ Package lockfile (package-lock.json) included for reproducible builds
- ✅ All build dependencies documented (Node.js 18+, npm 8+)
- ✅ Open source build tools only (vite, npm, bestzip)
- ✅ Build script included: `scripts/build-firefox.cjs`
- ✅ Reproducible build command: `npm install && npm run build:firefox`

#### Package Structure
- ✅ ZIP contains files at root level (manifest.json, dist/, src/, tfjs/)
- ✅ No wrapper directories in archive
- ✅ Total size: ~18MB (well under 200MB limit)

### 🔒 Security & Code Quality

**Fixed Security Warnings:**
- Replaced `innerHTML` with `textContent` in `src/modules/style.js` for CSS injection (safer for `<style>` elements)
- Added security documentation in `src/popup.js` explaining controlled translation strings

**Remaining Acceptable Warnings:**
- `innerHTML` in popup.js (1 instance): Uses controlled translation strings from `translations.js`, not user input
- `innerHTML` in dist/content.js (3 instances): Transpiled code for extension's own content creation

These warnings are acceptable per Firefox guidelines as they don't involve user-controllable data.

### 📦 Extension Contents

Both extension packages include:
- ✅ All **7 NSFW detection model files** (~20MB total)
  - model.json (131 KB)
  - group1-shard1of1 (2.5 MB)
  - group1-shard1of5.bin through group1-shard5of5.bin (17 MB)
- ✅ All source code (non-minified except dist/content.js)
- ✅ Complete build system and documentation

## 🧪 Testing & Validation

### Firefox Extension (extension-firefox.zip)
- ✅ ZIP structure validated (files at root level)
- ✅ Manifest JSON validated (no syntax errors)
- ✅ Background script exists at `src/background.js`
- ✅ All 7 model files present and accessible
- ✅ Version 0.2.9 in manifest
- ✅ Minimum Firefox version: 112.0
- ✅ No icon size mismatches
- ✅ **Zero critical validation errors expected on AMO**

### Chrome Extension (extension-chrome.zip)
- ✅ Valid manifest v3 structure
- ✅ All model files included
- ✅ Version 0.2.9 in manifest
- ✅ Ready for Chrome Web Store submission

## 📊 Validation Checklist

| Requirement | Status | Notes |
|------------|--------|-------|
| Background script found | ✅ PASS | Exists at src/background.js |
| Manifest compatibility | ✅ PASS | Firefox 112.0, no warnings |
| Icon sizes | ✅ PASS | No mismatches |
| ZIP structure | ✅ PASS | Files at root level |
| ZIP size | ✅ PASS | 18MB (< 200MB limit) |
| Model files | ✅ PASS | All 7 files present |
| Build instructions | ✅ PASS | Comprehensive guide |
| Package lockfile | ✅ PASS | package-lock.json included |
| Open source tools | ✅ PASS | vite, npm, bestzip |
| No obfuscation | ✅ PASS | Only minified dist/content.js |

## 🚀 Ready for Submission

### Firefox Add-ons (AMO)
- **Built Extension**: `ReelsPRO_Extension/extension-firefox.zip` (~18MB)
- **Source Code**: `ReelsPRO_Extension/reelspro-source-v0.2.9.zip` (~18MB) - **NEW!**
- **Status**: ✅ **READY - No errors expected**
- **Submission**: Upload both files to addons.mozilla.org
  - Upload Version: extension-firefox.zip
  - Source Code: reelspro-source-v0.2.9.zip

### Chrome Web Store
- **File**: `ReelsPRO_Extension/extension-chrome.zip`
- **Status**: ✅ **READY - All requirements met**
- **Size**: ~18MB
- **Submission**: Upload to Chrome Web Store Developer Dashboard

## 📝 Files Changed

### Version Updates
- `ReelsPRO_Extension/manifest.json` - Version 0.2.9
- `ReelsPRO_Extension/manifest-firefox.json` - Version 0.2.9, manifest fixes
- `ReelsPRO_Extension/package.json` - Version 0.2.9

### Documentation
- `ReelsPRO_Extension/BUILD_INSTRUCTIONS.md` - Comprehensive build guide v1.1

### Source Code
- `ReelsPRO_Extension/src/modules/style.js` - Security: innerHTML → textContent
- `ReelsPRO_Extension/src/popup.js` - Security: Added documentation

### Distribution
- `ReelsPRO_Extension/extension-firefox.zip` - Firefox-ready package
- `ReelsPRO_Extension/extension-chrome.zip` - Chrome-ready package
- `ReelsPRO_Extension/reelspro-source-v0.2.9.zip` - **NEW** Complete source code package for AMO

## 📚 References

- [Firefox Extension Workshop - Source Code Submission](https://extensionworkshop.com/documentation/publish/source-code-submission/)
- [Firefox Extension Workshop - Package Your Extension](https://extensionworkshop.com/documentation/publish/package-your-extension/)
- [Firefox Extension Workshop - Submitting an Add-on](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/)

## ✅ Merge Checklist

- [x] Version bumped to 0.2.9 in all files
- [x] All Firefox AMO validation errors fixed
- [x] Security warnings addressed/documented
- [x] Build instructions comprehensive
- [x] Extension packages tested and validated
- [x] Model files included in both packages
- [x] ZIP structure correct (files at root)
- [x] **Source code package created and tested**
- [x] **Reproducible build verified**
- [x] All commits properly documented

## 🎉 Impact

This release makes ReelsPRO ready for immediate submission to both Firefox Add-ons and Chrome Web Store with:
- **Zero critical validation errors**
- **Full compliance** with Firefox Extension Workshop requirements
- **Comprehensive documentation** for reviewers
- **Reproducible builds** from source

Ready to merge and submit! 🚀
