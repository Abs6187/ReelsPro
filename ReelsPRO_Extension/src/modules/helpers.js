// import { STATUSES } from "./observers";

import { STATUSES } from "../constants.js";
import { errorManager } from "./errorManager.js";

const MAX_IMG_HEIGHT = 300;
const MAX_IMG_WIDTH = 400;
const MIN_IMG_WIDTH = 32;
const MIN_IMG_HEIGHT = 32;
// maintain 1920x1080 aspect ratio
const MAX_VIDEO_WIDTH = 1920 / 4.5;
const MAX_VIDEO_HEIGHT = 1080 / 4.5;

// Track failed image URLs to prevent repeated attempts
const failedImages = new Map();
const imageLoadAttempts = new Map();

/**
 * Asynchronously loads an image with enhanced CORS fallback and error handling
 * @param {string} imgSrc - Source URL of the image
 * @param {number} imgWidth - Expected width of the image
 * @param {number} imgHeight - Expected height of the image
 * @returns {Promise<HTMLImageElement>} Promise that resolves to loaded image element
 */
const loadImage = async (imgSrc, imgWidth, imgHeight) => {
    // Check if this image has failed recently
    const now = Date.now();
    const failureInfo = failedImages.get(imgSrc);
    
    if (failureInfo && now < failureInfo.retryAfter) {
        throw new Error(`Image loading blocked due to recent failures: ${imgSrc}`);
    }

    // Track loading attempts
    const attempts = imageLoadAttempts.get(imgSrc) || 0;
    imageLoadAttempts.set(imgSrc, attempts + 1);

    return await new Promise((resolve, reject) => {
        let corsAttempted = false;
        let loadTimeout;
        
        const cleanup = () => {
            if (loadTimeout) {
                clearTimeout(loadTimeout);
            }
        };

        const handleSuccess = (img) => {
            cleanup();
            // Clear any previous failure records on success
            failedImages.delete(imgSrc);
            imageLoadAttempts.delete(imgSrc);
            resolve(img);
        };

        const handleFailure = (error, isCorsError = false) => {
            cleanup();
            
            const context = {
                attempts: attempts + 1,
                dimensions: { width: imgWidth, height: imgHeight },
                corsAttempted,
                errorType: isCorsError ? 'cors' : 'load_failure'
            };

            // Log error with rate limiting
            const wasLogged = errorManager.logError(
                isCorsError ? 'cors' : 'image_load',
                `Failed to load image: ${imgSrc}`,
                context,
                new URL(imgSrc).hostname
            );

            // Set exponential backoff for failed images
            const backoffTime = Math.min(1000 * Math.pow(2, attempts), 300000); // Max 5 minutes
            failedImages.set(imgSrc, {
                retryAfter: now + backoffTime,
                attempts: attempts + 1
            });

            reject(error);
        };

        const tryLoad = (useCors = true) => {
            const newImg = new Image(224, 224);
            
            // Set loading timeout (30 seconds)
            loadTimeout = setTimeout(() => {
                handleFailure(new Error('Image loading timeout'), false);
            }, 30000);

            if (useCors) {
                newImg.setAttribute("crossorigin", "anonymous");
            }

            newImg.onload = () => {
                // Validate image dimensions
                if (newImg.naturalWidth === 0 || newImg.naturalHeight === 0) {
                    handleFailure(new Error('Image has invalid dimensions'), false);
                    return;
                }
                handleSuccess(newImg);
            };

            newImg.onerror = (e) => {
                if (useCors && !corsAttempted) {
                    corsAttempted = true;
                    // Only log CORS warning once per image
                    if (!errorManager.isRateLimited(`cors:${new URL(imgSrc).hostname}`)) {
                        errorManager.logError('cors', `CORS failed for image, trying without crossorigin: ${imgSrc}`, {}, new URL(imgSrc).hostname);
                    }
                    tryLoad(false);
                } else {
                    handleFailure(e, corsAttempted);
                }
            };

            try {
                newImg.src = imgSrc;
            } catch (e) {
                if (useCors && !corsAttempted) {
                    corsAttempted = true;
                    tryLoad(false);
                } else {
                    handleFailure(e, false);
                }
            }
        };
        
        tryLoad(true);
    });
};

/**
 * Check if a video is too small for processing
 * @param {HTMLVideoElement|Object} video - Video element or object with dimension properties
 * @returns {boolean} True if video is smaller than minimum processing size
 */
const isVideoTooSmall = (video) => {
    const width = video.videoWidth || video.clientWidth || 0;
    const height = video.videoHeight || video.clientHeight || 0;
    return width < MIN_IMG_WIDTH || height < MIN_IMG_HEIGHT;
};

const loadVideo = async (video) => {
    const videoSrc = video.src || video.currentSrc || 'unknown';
    
    return await new Promise((resolve, reject) => {
        let corsAttempted = false;
        let loadTimeout;
        
        const cleanup = () => {
            if (loadTimeout) {
                clearTimeout(loadTimeout);
            }
            video.onloadeddata = null;
            video.onerror = null;
        };

        const handleSuccess = () => {
            cleanup();
            resolve(true);
        };

        const handleFailure = (error, isCorsError = false) => {
            cleanup();
            
            const context = {
                videoSrc,
                readyState: video.readyState,
                dimensions: { width: video.videoWidth, height: video.videoHeight },
                corsAttempted
            };

            errorManager.logError(
                isCorsError ? 'cors' : 'video_load',
                `Failed to load video: ${error}`,
                context,
                videoSrc ? new URL(videoSrc).hostname : 'unknown'
            );

            reject(error);
        };
        
        const tryLoadVideo = (useCors = true) => {
            // Set loading timeout (45 seconds for videos)
            loadTimeout = setTimeout(() => {
                handleFailure('Video loading timeout', false);
            }, 45000);

            if (useCors) {
                video.setAttribute("crossorigin", "anonymous");
            } else {
                video.removeAttribute("crossorigin");
            }
            
            // Check if video is already loaded
            if (video.readyState >= 3 && video.videoHeight) {
                handleSuccess();
                return;
            }
            
            video.onloadeddata = () => {
                if (!video.videoHeight || video.videoHeight === 0) {
                    handleFailure("Video has no height", false);
                    return;
                }
                
                if (isVideoTooSmall(video)) {
                    handleFailure("Video is too small for processing", false);
                    return;
                }
                
                handleSuccess();
            };
            
            video.onerror = (e) => {
                if (useCors && !corsAttempted) {
                    corsAttempted = true;
                    // Rate-limited CORS warning
                    if (!errorManager.isRateLimited(`cors:${videoSrc ? new URL(videoSrc).hostname : 'unknown'}`)) {
                        errorManager.logError('cors', `CORS failed for video, trying without crossorigin: ${videoSrc}`, {}, videoSrc ? new URL(videoSrc).hostname : 'unknown');
                    }
                    tryLoadVideo(false);
                } else {
                    handleFailure("Failed to load video: " + (e.message || e), corsAttempted);
                }
            };
        };
        
        tryLoadVideo(true);
    });
};

/**
 * Check if an image is too small for processing
 * @param {HTMLImageElement|Object} img - Image element or object with width/height properties
 * @returns {boolean} True if image is smaller than minimum processing size
 */
const isImageTooSmall = (img) => {
    return img.width < MIN_IMG_WIDTH || img.height < MIN_IMG_HEIGHT;
};

const calcResize = (width, height, type = "image") => {
    let newWidth = width;
    let newHeight = height;

    if (!width || !height) return { newWidth, newHeight };

    let actualMaxWidth = type === "image" ? MAX_IMG_WIDTH : MAX_VIDEO_WIDTH;
    let actualMaxHeight = type === "image" ? MAX_IMG_HEIGHT : MAX_VIDEO_HEIGHT;

    // if the aspect ratio is reversed (portrait image/video), swap max width and max height
    if (newWidth < newHeight) {
        const temp = actualMaxWidth;
        actualMaxWidth = actualMaxHeight;
        actualMaxHeight = temp;
    }

    // if image is smaller than max size, don't resize
    if (!(newWidth < actualMaxWidth && newHeight < actualMaxHeight)) {
        // calculate new width to resize image to
        const ratio = Math.min(
            actualMaxWidth / newWidth,
            actualMaxHeight / newHeight
        );
        newWidth = newWidth * ratio;
        newHeight = newHeight * ratio;
    }

    return { newWidth, newHeight };
};

const hasBeenProcessed = (element) => {
    if (!element) throw new Error("No element provided");
    if (
        element.dataset.HBstatus &&
        element.dataset.HBstatus >= STATUSES.PROCESSING
    )
        return true;
    return false;
};

const processNode = (node, callBack) => {
    // if the node has any images or videos as children, add them to the array
    const imgs = node?.getElementsByTagName?.("img") ?? [];

    const videos = node?.getElementsByTagName?.("video") ?? [];

    // process each image/video
    // nodes that don't get callback (observed) are:
    // 1. images
    // 1.1. that are too small (but we have to make sure they have loaded first, cause they might be too small because they haven't loaded yet)

    for (let i = 0; i < imgs.length + videos.length; i++) {

        const node = i < imgs.length ? imgs[i] : videos[i - imgs.length];
        if (node.tagName === "VIDEO") {
            callBack(node);
        } else if (node.tagName === "IMG") {
            // (like a 1x1 pixel image, icon, etc.) don't process it
            
            node.complete && isImageTooSmall(node) && node.naturalHeight
                ? null
                : callBack(node);
        }
    }

    if (node.tagName === "IMG" || node.tagName === "VIDEO") {
        callBack(node);
    }
};

const resetElement = (element) => {
    // remove crossOrigin attribute
    element.removeAttribute("crossOrigin");
    // remove blur class
    element.classList.remove("hb-blur-temp");
    element.classList.remove("hb-blur");
};

const emitEvent = (eventName, detail = "") => {
    const event = new CustomEvent(eventName, { detail });
    document.dispatchEvent(event);
};

const listenToEvent = (eventName, callBack) => {
    document.addEventListener(eventName, callBack);
};

const now = () => {
    return performance?.now?.() || Date.now();
};

const timeTaken = (fnToRun) => {
    const beforeRun = now();
    fnToRun();
    const afterRun = now();
    return afterRun - beforeRun;
};

const getCanvas = (width, height, offscreen = true) => {
    let c;

    if (!offscreen) {
        c =
            document.getElementById("hb-in-canvas") ??
            document.createElement("canvas");
        c.id = "hb-in-canvas";
        c.width = width;
        c.height = height;
        // uncomment this to see the canvas (debugging)
        // c.style.position = "absolute";
        // c.style.top = "0";
        // c.style.left = "0";
        // c.style.zIndex = 9999;

        // if it's not appended to the DOM, append it
        if (!c.parentElement) {
            document.body.appendChild(c);
        }
    } else {
        c = new OffscreenCanvas(width, height);
    }

    return c;
};

const canvToBlob = (canv, options) => {
    //if it's an offscreen canvas
    if (canv.convertToBlob) {
        return canv.convertToBlob(options);
    }
    return new Promise((resolve, reject) => {
        canv.toBlob(
            (blob) => {
                resolve(blob);
            },
            options?.type || "image/jpeg",
            options?.quality || 0.8
        );
    });
};

const disableVideo = (video) => {
    video.dataset.HBstatus = STATUSES.DISABLED;
    video.classList.remove("hb-blur");
};

const enableVideo = (video) => {
    video.dataset.HBstatus = STATUSES.PROCESSING;
};

function updateBGvideoStatus(videosInProcess) {
    // checks if there are any disabled videos in the videosInProcess array, sends a message to the background to disable/enable the extension icon
    const disabledVideos =
        videosInProcess.filter(
            (video) =>
                video.dataset.HBstatus === STATUSES.DISABLED &&
                !video.paused &&
                video.currentTime > 0
        ) ?? [];

    chrome.runtime.sendMessage({
        type: "video-status",
        status: disabledVideos.length === 0,
    });
}

const requestIdleCB =
    window.requestIdleCallback ||
    function (cb) {
        var start = Date.now();
        return setTimeout(function () {
            cb({
                didTimeout: false,
                timeRemaining: function () {
                    return Math.max(0, 50 - (Date.now() - start));
                },
            });
        }, 1);
    };

const cancelIdleCB =
    window.cancelIdleCallback ||
    function (id) {
        clearTimeout(id);
    };

const cleanupVideo = (video) => {
    if (!video) return;
    
    // Cancel animation frame
    if (video.HBrafId) {
        cancelAnimationFrame(video.HBrafId);
        video.HBrafId = null;
    }
    
    // Remove event listeners
    video.onplay = null;
    video.onloadeddata = null;
    video.onerror = null;
    
    // Remove attributes
    video.removeAttribute("crossorigin");
    
    // Clear custom properties
    delete video.HBprevTime;
    delete video.HBpositiveCount;
    delete video.HBnegativeCount;
    delete video.HBerrored;
    
    console.log("HB==Video cleanup completed for:", video.src);
};

export {
    loadImage,
    loadVideo,
    calcResize,
    hasBeenProcessed,
    processNode,
    emitEvent,
    listenToEvent,
    now,
    timeTaken,
    resetElement,
    isImageTooSmall,
    isVideoTooSmall,
    getCanvas,
    disableVideo,
    enableVideo,
    updateBGvideoStatus,
    requestIdleCB,
    cancelIdleCB,
    canvToBlob,
    cleanupVideo,
};
