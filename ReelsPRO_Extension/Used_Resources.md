# ReelsPRO: Privacy-First Web Browsing Extension

ReelsPRO is a browser extension that empowers users to navigate the web with enhanced privacy and reduced distractions. By leveraging advanced machine learning techniques, the extension automatically detects and blurs sensitive content across websites and social media platforms.

## Interesting Technical Techniques

- Uses [Web Extension API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions) for cross-browser compatibility
- Implements dynamic content filtering with [TensorFlow.js](https://www.tensorflow.org/js)
- Utilizes [CSS `filter` property](https://developer.mozilla.org/en-US/docs/Web/CSS/filter) for content blurring
- Employs [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) for background processing
- Implements internationalization with dynamic language switching

## Notable Technologies and Libraries

- [Human Library](https://github.com/vladmandic/human): Advanced face detection
- [NSFWJS](https://github.com/infinitered/nsfwjs/): NSFW content detection
- [TensorFlow.js](https://www.tensorflow.org/js): Machine learning in the browser
- [Vite](https://vitejs.dev/): Modern build tooling

## External Resources

- Fonts: [Poppins](https://fonts.google.com/specimen/Poppins) from Google Fonts
- Icons: SVG icons from various sources
- Localization: Multi-language support

## Project Structure
ReelsPRO/
├── src/
│ ├── assets/ # Static assets and icon resources
│ ├── modules/ # Modular JavaScript components
│ └── translations/ # Internationalization files
├── tfjs/ # TensorFlow.js related files
├── demos/ # Project demonstration resources
└── dist/ # Compiled extension files


## Contributions Welcome

Open-source and community-driven, ReelsPRO invites developers to contribute, improve detection algorithms, and expand browser support.

## Authors

Developed during HacksRIT Hackathon by a team of passionate developers focusing on privacy and machine learning.