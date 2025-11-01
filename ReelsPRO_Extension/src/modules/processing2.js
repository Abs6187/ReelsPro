import {
    calcResize,
    loadVideo,
    getCanvas,
    emitEvent,
    requestIdleCB,
    canvToBlob,
    cleanupVideo,
} from "./helpers";
import { removeBlurryStart } from "./style";
import { STATUSES } from "../constants.js";
import { errorManager } from "./errorManager.js";

const FRAME_RATE = 1000 / 25; // 25 fps

// threshold for number of consecutive frames that need to be positive for the image to be considered positive
const POSITIVE_THRESHOLD = 1; //at 25 fps, this is 0.04 seconds of consecutive positive detections
// threshold for number of consecutive frames that need to be negative for the image to be considered negative
const NEGATIVE_THRESHOLD = 3; //at 25 fps, this is 0.12 seconds of consecutive negative detections
/**
 * Object containing the possible results of image processing.
 * @typedef {Object} RESULTS
 * @property {string} CLEAR - Indicates that the image is clear and safe to display.
 * @property {string} NSFW - Indicates that the image contains NSFW content and should be blurred.
 * @property {string} FACE - Indicates that the image contains a face and should be blurred.
 * @property {string} ERROR - Indicates that an error occurred during processing.
 */
const RESULTS = {
    CLEAR: "CLEAR",
    NSFW: "NSFW",
    FACE: "FACE",
    ERROR: "ERROR",
};

let activeFrame = false;
let canv, ctx;

const processImage = (node, STATUSES) => {
    if (!node || !node.src) {
        errorManager.logError(
            'image_processing',
            'Invalid node provided for image processing',
            { nodeType: node?.tagName, hasSrc: !!node?.src },
            'unknown'
        );
        return;
    }

    try {
        node.dataset.HBstatus = STATUSES.PROCESSING;
        
        const imageData = {
            type: "imageDetection",
            image: {
                src: node.src,
                width: node.width || node.naturalWidth || 0,
                height: node.height || node.naturalHeight || 0,
            },
        };

        // Add timeout for message response
        let responseReceived = false;
        const timeoutId = setTimeout(() => {
            if (!responseReceived) {
                errorManager.logError(
                    'image_processing',
                    'Image processing timeout',
                    { timeout: '30s' },
                    node.src ? new URL(node.src).hostname : 'unknown'
                );
                removeBlurryStart(node);
                node.dataset.HBstatus = STATUSES.ERROR;
                node.dataset.HBerror = "timeout";
            }
        }, 15000); // 15 second timeout

        chrome.runtime.sendMessage(imageData, (response) => {
            responseReceived = true;
            clearTimeout(timeoutId);
            
            try {
                removeBlurryStart(node);
                
                if (chrome.runtime.lastError) {
                    errorManager.logError(
                        'runtime_error',
                        `Runtime error: ${chrome.runtime.lastError.message}`,
                        { errorCode: 'runtime_error' },
                        node.src ? new URL(node.src).hostname : 'unknown'
                    );
                    node.dataset.HBstatus = STATUSES.ERROR;
                    node.dataset.HBerror = "runtime_error";
                    return;
                }

                if (!response) {
                    console.warn("HB==No response received for image processing");
                    node.dataset.HBstatus = STATUSES.ERROR;
                    node.dataset.HBerror = "no_response";
                    return;
                }

                if (response.type === "error") {
                    console.warn("HB==Error while processing image:", response);
                    node.dataset.HBstatus = STATUSES.ERROR;
                    node.dataset.HBerror = response.code || "processing_error";
                    return;
                }

                if (response === "face" || response === "nsfw") {
                    node.dataset.HBstatus = STATUSES.PROCESSED;
                    node.classList.add("hb-blur");
                    node.dataset.HBresult = response;
                } else if (response === false) {
                    node.dataset.HBstatus = STATUSES.PROCESSED;
                    node.classList.remove("hb-blur");
                    delete node.dataset.HBresult;
                } else {
                    console.warn("HB==Unknown response from processing image:", response);
                    node.dataset.HBstatus = STATUSES.ERROR;
                    node.dataset.HBerror = "unknown_response";
                }
            } catch (processingError) {
                console.error("HB==Error processing response:", processingError);
                node.dataset.HBstatus = STATUSES.ERROR;
                node.dataset.HBerror = "response_processing_error";
            }
        });
    } catch (error) {
        console.error("HB==Error in processImage:", error);
        removeBlurryStart(node);
        node.dataset.HBstatus = STATUSES.ERROR;
        node.dataset.HBerror = "initialization_error";
    }
};

/**
 * Validate video element before processing
 */
const validateVideoElement = (video) => {
    if (!video) return { valid: false, reason: 'Video element is null' };
    if (!video.isConnected) return { valid: false, reason: 'Video not connected to DOM' };
    if (video.ended) return { valid: false, reason: 'Video has ended' };
    if (video.readyState < 2) return { valid: false, reason: 'Video not ready (readyState < 2)' };
    if (!video.videoWidth || !video.videoHeight) return { valid: false, reason: 'Invalid video dimensions' };
    if (video.videoWidth < 32 || video.videoHeight < 32) return { valid: false, reason: 'Video too small' };
    if (video.paused && video.currentTime === 0) return { valid: false, reason: 'Video not playing' };
    
    return { valid: true };
};

/**
 * Validate canvas context before drawing
 */
const validateCanvasContext = (ctx, canvas) => {
    if (!ctx) return { valid: false, reason: 'Canvas context is null' };
    if (!canvas) return { valid: false, reason: 'Canvas is null' };
    if (canvas.width <= 0 || canvas.height <= 0) return { valid: false, reason: 'Invalid canvas dimensions' };
    
    return { valid: true };
};

const processFrame = async (video, { width, height }) => {
    // Comprehensive video validation
    const videoValidation = validateVideoElement(video);
    if (!videoValidation.valid) {
        throw new Error(`Video validation failed: ${videoValidation.reason}`);
    }

    // Canvas context validation
    const canvasValidation = validateCanvasContext(ctx, canv);
    if (!canvasValidation.valid) {
        throw new Error(`Canvas validation failed: ${canvasValidation.reason}`);
    }

    return new Promise(async (resolve, reject) => {
        try {
            // Additional safety check before drawing
            if (video.videoWidth !== video.videoWidth || video.videoHeight !== video.videoHeight) {
                throw new Error('Video dimensions are NaN');
            }

            // Safe drawImage operation with error handling
            try {
                ctx.drawImage(video, 0, 0, width, height);
            } catch (drawError) {
                // Log DOMException errors with context
                const context = {
                    videoSrc: video.src || video.currentSrc,
                    videoDimensions: { width: video.videoWidth, height: video.videoHeight },
                    canvasDimensions: { width, height },
                    readyState: video.readyState,
                    currentTime: video.currentTime
                };

                errorManager.logError(
                    'dom_exception',
                    `drawImage failed: ${drawError.message}`,
                    context,
                    video.src ? new URL(video.src).hostname : 'unknown'
                );

                throw drawError;
            }

            const blob = await canvToBlob(canv, {
                type: "image/jpeg",
                quality: 0.6,
            });
            
            if (!blob || blob.size === 0) {
                throw new Error('Failed to create blob from canvas');
            }

            let data = URL.createObjectURL(blob);
            chrome.runtime.sendMessage(
                {
                    type: "videoDetection",
                    frame: {
                        data: data,
                        timestamp: video.currentTime,
                    },
                },
                (response) => {
                    // revoke the object url to free up memory
                    URL.revokeObjectURL(data);
                    resolve(response);
                }
            );
        } catch (e) {
            reject(e);
        }
    });
};

const videoDetectionLoop = async (video, { width, height }) => {
    // Check if video is still valid and not removed from DOM
    if (!video || !video.isConnected || video.dataset.HBstatus === STATUSES.ERROR) {
        cleanupVideo(video);
        return;
    }

    // get the current timestamp
    const currTime = performance.now();

    if (!video?.HBprevTime) {
        video.HBprevTime = currTime;
    }

    // calculate the time difference
    const diffTime = currTime - video.HBprevTime;

    if (video.dataset.HBstatus === STATUSES.DISABLED) {
        video.classList.remove("hb-blur");
    }
    
    if (
        !video.ended &&
        !video.paused &&
        video.dataset.HBstatus !== STATUSES.DISABLED
    ) {
        try {
            if (diffTime >= FRAME_RATE) {
                // store the current timestamp
                video.HBprevTime = currTime;

                if (!activeFrame) {
                    activeFrame = true;
                    processFrame(video, { width, height })
                        .then(({ result, timestamp }) => {
                            if (result === "error") {
                                throw new Error("HB==Error from processFrame");
                            }

                            // if frame was skipped, don't process it
                            if (result === "skipped") {
                                return;
                            }

                            // if the frame is too old, don't process it
                            if (video.currentTime - timestamp > 0.5) {
                                return;
                            }

                            // process the result
                            processVideoDetections(result, video);
                        })
                        .catch((error) => {
                            const errorCount = parseInt(video.dataset.HBerrored ?? 0) + 1;
                            video.dataset.HBerrored = errorCount;

                            const context = {
                                videoSrc: video.src || video.currentSrc,
                                errorCount,
                                videoDimensions: { width: video.videoWidth, height: video.videoHeight },
                                readyState: video.readyState,
                                currentTime: video.currentTime,
                                errorMessage: error.message || error.toString()
                            };

                            // Use centralized error logging
                            errorManager.logError(
                                'video_processing',
                                `Video processing error: ${error.message || error}`,
                                context,
                                video.src ? new URL(video.src).hostname : 'unknown'
                            );
                        })
                        .finally(() => {
                            activeFrame = false;
                        });
                }
            }
        } catch (error) {
            const errorCount = parseInt(video.dataset.HBerrored ?? 0) + 1;
            video.dataset.HBerrored = errorCount;

            const context = {
                videoSrc: video.src || video.currentSrc,
                errorCount,
                loopError: true,
                errorMessage: error.message || error.toString()
            };

            errorManager.logError(
                'video_processing',
                `Video detection loop error: ${error.message || error}`,
                context,
                video.src ? new URL(video.src).hostname : 'unknown'
            );
        }
    }

    // Enhanced error threshold with graceful degradation
    const errorCount = parseInt(video.dataset.HBerrored ?? 0);
    if (errorCount > 10) {
        errorManager.logError(
            'video_processing',
            `Video disabled due to excessive errors (${errorCount})`,
            {
                videoSrc: video.src || video.currentSrc,
                finalErrorCount: errorCount
            },
            video.src ? new URL(video.src).hostname : 'unknown'
        );
        cleanupVideo(video);
        return;
    }
    
    // Implement progressive backoff for problematic videos
    if (errorCount > 5) {
        const backoffDelay = Math.min(1000 * Math.pow(2, errorCount - 5), 10000); // Max 10 second delay
        setTimeout(() => {
            if (!video.paused && video.isConnected) {
                video.HBrafId = requestAnimationFrame(() =>
                    videoDetectionLoop(video, { width, height })
                );
            }
        }, backoffDelay);
        return;
    }
    
    if (!video.paused && video.isConnected) {
        video.HBrafId = requestAnimationFrame(() =>
            videoDetectionLoop(video, { width, height })
        );
    } else {
        video.onplay = () => {
            if (video.isConnected) {
                video.HBrafId = requestAnimationFrame(() =>
                    videoDetectionLoop(video, { width, height })
                );
            }
        };
    }
};


const processVideo = async (node) => {
    try {
        node.dataset.HBstatus = STATUSES.LOADING;
        await loadVideo(node);
        node.dataset.HBstatus = STATUSES.PROCESSING;
        const { newWidth, newHeight } = calcResize(
            node.videoWidth ?? node.clientWidth,
            node.videoHeight ?? node.clientHeight,
            "video"
        );
        if (!canv) {
            canv = getCanvas(newWidth, newHeight, true);
            ctx = canv.getContext("2d", {
                alpha: false,
                willReadFrequently: true,
            });
        }
        // set the width and height of the video
        node.width = newWidth;
        node.height = newHeight;

        if (canv.width !== newWidth || canv.height !== newHeight) {
            canv.width = newWidth;
            canv.height = newHeight;
        }

        removeBlurryStart(node);

        // start the video detection loop but don't block the main thread
        requestIdleCB(() => {
            videoDetectionLoop(node, { width: newWidth, height: newHeight });
        });
    } catch (e) {
        console.log("HB== processVideo error", e);
    }
};

const processVideoDetections = (result, video) => {
    const prevResult = video.dataset.HBresult;
    const isPrevResultClear = prevResult === RESULTS.CLEAR || !prevResult;
    const currentPositiveCount = parseInt(video.HBpositiveCount ?? 0);
    const currentNegativeCount = parseInt(video.HBnegativeCount ?? 0);
    let shouldBlur = null;

    if (result === "nsfw") {
        video.dataset.HBresult = RESULTS.NSFW;
        video.HBpositiveCount = currentPositiveCount + !isPrevResultClear;
        video.HBnegativeCount = 0;
        // if the positive count is greater than the threshold (i.e it's not a momentary blip), add the blur
        if (currentPositiveCount + !isPrevResultClear >= POSITIVE_THRESHOLD) {
            // video.pause()
            shouldBlur = true;
            video.HBpositiveCount = 0;
        }
    } else if (result === "face") {
        video.dataset.HBresult = RESULTS.FACE;
        video.HBpositiveCount = currentPositiveCount + !isPrevResultClear;
        video.HBnegativeCount = 0;
        // if the positive count is greater than the threshold (i.e it's not a momentary blip), add the blur
        if (currentPositiveCount + !isPrevResultClear >= POSITIVE_THRESHOLD) {
            // video.pause()
            shouldBlur = true;
            video.HBpositiveCount = 0;
        }
    } else {
        video.dataset.HBresult = RESULTS.CLEAR;
        video.HBnegativeCount = currentNegativeCount + isPrevResultClear;
        video.HBpositiveCount = 0;
        // if the negative count is greater than the threshold (i.e it's not a momentary blip), remove the blur
        if (currentNegativeCount + isPrevResultClear >= NEGATIVE_THRESHOLD) {
            shouldBlur = false;
            video.HBnegativeCount = 0;
        }
    }

    if (shouldBlur !== null) {
        shouldBlur
            ? video.classList.add("hb-blur")
            : video.classList.remove("hb-blur");
    }
};
export { processImage, processVideo };
