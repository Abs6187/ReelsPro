# ReelsPRO Extension Architecture

## Project Structure Overview

```
ReelsPRO/
├── .github/           # GitHub workflow and CI/CD configurations
├── .husky/            # Git hooks for code quality
├── demos/             # Project demonstration resources
├── dist/              # Compiled and distribution files
├── src/               # Main source code directory
│   ├── assets/        # Static assets (icons, images)
│   ├── modules/       # Modular JavaScript components
│   ├── translations.js # Internationalization support
│   ├── popup.html     # Extension popup user interface
│   ├── popup.js       # Popup interaction logic
│   ├── background.js  # Background service worker
│   ├── content.js     # Content script for web page manipulation
│   ├── offscreen.js   # Offscreen processing script
│   └── constants.js   # Shared constants and configuration
├── tfjs/              # TensorFlow.js related files
├── manifest.json      # Browser extension configuration
└── vite.config.js     # Build configuration
```

## Detailed File Breakdown

### 1. Manifest Configuration (`manifest.json`)
- **Purpose**: Defines the extension's metadata, permissions, and runtime behavior
- **Key Configurations**:
  - Manifest Version 3 compliant
  - Defines extension name, description, and version
  - Specifies permissions: storage, offscreen, context menus
  - Configures background service worker
  - Sets up content scripts and web-accessible resources

### 2. Background Script (`src/background.js`)
- **Responsibilities**:
  - Manages extension-wide state
  - Handles communication between different extension components
  - Manages offscreen document creation
  - Implements context menu interactions
- **Key Functionalities**:
  - Initializes extension settings
  - Manages cross-tab communication
  - Handles machine learning model loading

### 3. Content Script (`src/content.js`)
- **Purpose**: Directly interacts with web page content
- **Functionalities**:
  - Detects and modifies images and videos
  - Applies blur and grayscale effects
  - Implements hover-to-unblur mechanism
  - Communicates with background script for detection

### 4. Popup Interface (`src/popup.html` and `src/popup.js`)
- **HTML (`popup.html`)**: 
  - Defines the extension's user interface
  - Includes settings for blur amount, strictness, media selection
  - Supports internationalization
- **JavaScript (`popup.js`)**:
  - Handles user interactions
  - Saves and loads user preferences
  - Manages dynamic UI updates
  - Implements language switching

### 5. Offscreen Processing (`src/offscreen.js`)
- **Purpose**: Perform heavy computational tasks
- **Functionalities**:
  - Run machine learning inference
  - Process face and NSFW detection
  - Prevent blocking of main thread
  - Communicate detection results back to content script

### 6. Translations (`src/translations.js`)
- **Purpose**: Internationalization support
- **Features**:
  - Defines translation mappings
  - Supports multiple languages
  - Dynamic language switching
  - Translates UI elements

### 7. Constants (`src/constants.js`)
- **Purpose**: Centralized configuration management
- **Contents**:
  - Default settings
  - Constant values used across scripts
  - Configuration parameters

### 8. TensorFlow.js Integration (`tfjs/`)
- **Purpose**: Machine Learning Model Management
- **Functionalities**:
  - Load face detection models
  - Prepare NSFW detection models
  - Perform inference on images and videos

### 9. Build Configuration (`vite.config.js`)
- **Purpose**: Modern build tooling configuration
- **Features**:
  - Optimizes extension build process
  - Configures development and production builds
  - Manages asset handling

## Key Technologies

- **Machine Learning**: TensorFlow.js
- **Face Detection**: Human Library
- **NSFW Detection**: NSFWJS
- **Build Tool**: Vite
- **Browser APIs**: Web Extensions API

## Privacy and Performance Considerations

- Offscreen processing for non-blocking inference
- Configurable detection strictness
- Minimal performance impact
- User-controlled privacy settings

## Extensibility

The modular architecture allows easy:
- Adding new detection models
- Implementing additional language support
- Extending blur and detection capabilities 




# ReelsPRO Browser Extension Architecture Explained

Hi everyone! Today, I’m going to walk you through the architecture of the **ReelsPRO Browser Extension**, which uses machine learning to detect and blur sensitive content like faces or NSFW material on web pages.

Let’s break down the flowchart step-by-step:

---

## User Interaction

It all starts with the **User**, who configures their preferences through the **Popup UI** — this is the extension’s popup window built with `popup.html` and `popup.js`.

The popup lets the user change settings and then saves or loads these settings by talking to the **Background Service**.

At the same time, the popup stores user preferences locally in **Storage** to keep them persistent across browser sessions.

---

## Background Service

The **Background Service** is the extension’s brain that runs continuously in the background (`background.js`).

It triggers machine learning processing by sending commands to the **Offscreen Processing** module. This helps run heavy ML tasks without slowing down the main browser threads.

The background service also communicates detection rules and updated settings to the **Content Script**, which runs inside web pages.

Like the popup, the background service reads from and writes to **Storage** to maintain configuration consistency.

---

## Content Script

The **Content Script** (`content.js`) is injected into web pages. It detects sensitive content such as images and videos.

When the **Offscreen Processing** finishes analyzing content using ML models, it sends the detection results back to the content script.

Using this data and the stored configurations, the content script applies blur or grayscale effects to images and videos on the page — helping protect user privacy or hide inappropriate content.

---

## Machine Learning Components

The heavy lifting is done by the ML models running inside **Offscreen Processing** (`offscreen.js`):

- **TensorFlow.js** for running general machine learning models right in the browser.
- **Human.js** for precise face detection.
- **NSFWJS** for classifying not-safe-for-work content.

These models analyze images and videos and send their results to the content script for applying visual effects.

---

## Summary

To summarize:

- The **User** interacts through the popup UI.
- The **Background Service** coordinates tasks and handles storage.
- The **Offscreen Processing** runs the ML models.
- The **Content Script** modifies the actual web page content.
- All components work together seamlessly to detect and blur sensitive images and videos on the web page in real time.

---

Thanks for listening! If you want to know more about how we built this or want a demo, feel free to ask.
