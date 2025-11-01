// style.js
// This module exports the style sheet and blur effect functions

import { emitEvent, listenToEvent } from "./helpers.js";

// Blurry start timeout is now configurable via settings

let rpStyleSheet, blurryStartStyleSheet, _settings;

const initStylesheets = ({ detail }) => {
    _settings = detail;
    // console.log("RP==INIT STYLESHEETS")
    rpStyleSheet = document.createElement("style");
    rpStyleSheet.id = "rp-stylesheet";
    document.head.appendChild(rpStyleSheet);
};

const setStyle = ({ detail: settings }) => {
    _settings = settings;
    // console.log("RP==SET STYLE")
    if (!rpStyleSheet) {
        initStylesheets();
    }
    if (!_settings.shouldDetect()) {
        // Using textContent for security - safer than innerHTML for style elements
        rpStyleSheet.textContent = "";
        return;
    }
    const shouldBlurImages = _settings.shouldBlurImages();
    const shouldBlurVideos = _settings.shouldBlurVideos();
    const shouldUnblurImagesOnHover = _settings.shouldUnblurImages();
    const shouldUnblurVideosOnHover = _settings.shouldUnblurVideos();

    let blurSelectors = [];
    if (shouldBlurImages) blurSelectors.push("img" + ".rp-blur");
    if (shouldBlurVideos) blurSelectors.push("video" + ".rp-blur");
    blurSelectors = blurSelectors.join(", ");

    let unblurSelectors = [];
    if (shouldUnblurImagesOnHover)
        unblurSelectors.push("img" + ".rp-blur:hover");
    if (shouldUnblurVideosOnHover)
        unblurSelectors.push("video" + ".rp-blur:hover");
    unblurSelectors = unblurSelectors.join(", ");

    // Using textContent for security - CSS is generated from settings (not user input)
    // textContent is safer than innerHTML and works correctly for <style> elements
    let cssContent = `
    ${blurSelectors} {
      filter: blur(${_settings.getBlurAmount()}px) ${
          _settings.isGray() ? "grayscale(100%)" : ""
      } !important;
      transition: filter 0.1s ease !important;
      opacity: unset !important;
    }

  `;
    if (unblurSelectors) {
        cssContent += `
		${unblurSelectors} {
			filter: blur(0px) ${_settings.isGray() ? "grayscale(0%)" : ""} !important;
			transition: filter 0.5s ease !important;
			transition-delay: 1s !important;
		  }
	`;
    }

    cssContent += `
	.rp-blur-temp {
		animation: rp-blur-temp ${_settings.getBlurryStartTimeout()}ms ease-in-out forwards !important;
	}

	#rp-in-canvas {
		display: none !important;
		visibility: hidden !important;
	}

	@keyframes rp-blur-temp {
		0% { filter: blur(${_settings.getBlurAmount()}px) ${
            _settings.isGray() ? "grayscale(100%)" : ""
        }; }
		95% { filter: blur(${_settings.getBlurAmount()}px) ${
            _settings.isGray() ? "grayscale(100%)" : ""
        }; }
		100% { filter: blur(0px) ${_settings.isGray() ? "grayscale(0%)" : ""}; }
	}
  `;

    rpStyleSheet.textContent = cssContent;
};
const applyBlurryStart = (node) => {
    if (_settings?.isBlurryStartMode()) {
        node.classList.add("rp-blur-temp");
    }
};

const removeBlurryStart = (node) => {
    node.classList.remove("rp-blur-temp");
};

const attachStyleListener = () => {
    listenToEvent("settingsLoaded", initStylesheets);
    listenToEvent("toggleOnOffStatus", setStyle);
    listenToEvent("changeBlurAmount", setStyle);
    listenToEvent("changeGray", setStyle);
};

export { attachStyleListener, applyBlurryStart, removeBlurryStart };
