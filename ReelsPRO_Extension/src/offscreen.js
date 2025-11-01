import {
    containsNsfw,
    containsGenderFace,
    Detector,
} from "./modules/detector.js";
import Queue from "./modules/queues.js";
import Settings from "./modules/settings.js";

var settings;
var queue;
var detector = new Detector();

const loadModels = async () => {
    try {
        console.log("RP==Starting model loading...");
        
        // Load Human model with progress
        console.log("RP==Loading Human library...");
        await detector.initHuman();
        console.log("RP==Human library loaded successfully");
        
        // Load NSFW model with progress
        console.log("RP==Loading NSFW model...");
        await detector.initNsfwModel();
        console.log("RP==NSFW model loaded successfully");
        
        // Add error listener
        detector.human.events?.addEventListener("error", (e) => {
            console.error("RP==Human library error:", e);
            chrome.runtime.sendMessage({ type: "reloadExtension" });
        });
        
        console.log("RP==All models loaded successfully");
    } catch (e) {
        console.error("RP==Error loading models:", e);
        throw e;
    }
};

const handleImageDetection = (request, sender, sendResponse) => {
    try {
        if (!request?.image?.src) {
            sendResponse({
                type: "error",
                message: "Invalid image request - missing src",
                code: "INVALID_REQUEST"
            });
            return;
        }

        queue.add(
            request.image,
            (result) => {
                try {
                    sendResponse(result);
                } catch (responseError) {
                    console.error("RP==Error sending response:", responseError);
                }
            },
            (error) => {
                const errorResponse = {
                    type: "error",
                    message: error.message || "Unknown error occurred",
                    code: error.code || "PROCESSING_ERROR",
                    src: request.image?.src
                };
                try {
                    sendResponse(errorResponse);
                } catch (responseError) {
                    console.error("RP==Error sending error response:", responseError);
                }
            }
        );
    } catch (error) {
        console.error("RP==Error in handleImageDetection:", error);
        try {
            sendResponse({
                type: "error",
                message: "Failed to process image detection request",
                code: "HANDLER_ERROR"
            });
        } catch (responseError) {
            console.error("RP==Error sending handler error response:", responseError);
        }
    }
};
let activeFrame = false;
let frameImage = new Image();

const handleVideoDetection = async (request, sender, sendResponse) => {
    try {
        const { frame } = request;
        
        if (!frame?.data || !frame?.timestamp) {
            sendResponse({ 
                result: "error", 
                message: "Invalid frame data",
                code: "INVALID_FRAME"
            });
            return;
        }

        const { data, timestamp } = frame;
        
        if (activeFrame) {
            sendResponse({ result: "skipped", reason: "processing_busy" });
            return;
        }
        
        activeFrame = true;
        
        // Set timeout to prevent hanging
        const timeoutId = setTimeout(() => {
            if (activeFrame) {
                activeFrame = false;
                console.warn("RP==Video detection timeout");
                sendResponse({ 
                    result: "error", 
                    message: "Detection timeout",
                    code: "TIMEOUT"
                });
            }
        }, 10000); // 10 second timeout

        frameImage.onload = () => {
            clearTimeout(timeoutId);
            runDetection(frameImage, true)
                .then((result) => {
                    activeFrame = false;
                    sendResponse({ type: "detectionResult", result, timestamp });
                })
                .catch((error) => {
                    console.error("RP==Error in video detection:", error);
                    activeFrame = false;
                    sendResponse({ 
                        result: "error",
                        message: error.message || "Detection failed",
                        code: "DETECTION_ERROR"
                    });
                });
        };
        
        frameImage.onerror = (error) => {
            clearTimeout(timeoutId);
            console.error("RP==Frame image load error:", error);
            activeFrame = false;
            sendResponse({ 
                result: "error",
                message: "Failed to load frame image",
                code: "IMAGE_LOAD_ERROR"
            });
        };
        
        frameImage.src = data;
    } catch (error) {
        console.error("RP==Error in handleVideoDetection:", error);
        activeFrame = false;
        sendResponse({ 
            result: "error",
            message: "Video detection handler failed",
            code: "HANDLER_ERROR"
        });
    }
};

const startListening = () => {
    settings.listenForChanges();
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === "imageDetection") {
            handleImageDetection(request, sender, sendResponse);
        }
        if (request.type === "videoDetection") {
            handleVideoDetection(request, sender, sendResponse);
        }
        return true;
    });
};

const runDetection = async (img, isVideo = false) => {
    let tensor = null;
    try {
        if (!settings?.shouldDetect() || !img) {
            return false;
        }

        if (!detector.human?.tf) {
            throw new Error("TensorFlow not available");
        }

        tensor = detector.human.tf.browser.fromPixels(img);
        
        // NSFW Detection
        const nsfwResult = await detector.nsfwModelClassify(tensor);
        const strictness = settings.getStrictness() * (isVideo ? 0.75 : 1);
        
        if (containsNsfw(nsfwResult, strictness)) {
            return "nsfw";
        }
        
        // Gender Detection (if enabled)
        if (!settings.shouldDetectGender()) {
            return false;
        }
        
        const predictions = await detector.humanModelClassify(tensor);
        
        if (containsGenderFace(
            predictions,
            settings.shouldDetectMale(),
            settings.shouldDetectFemale()
        )) {
            return "face";
        }
        
        return false;
    } catch (error) {
        console.error("RP==Detection error:", error);
        throw new Error(`Detection failed: ${error.message}`);
    } finally {
        // Always dispose tensor to prevent memory leaks
        if (tensor && detector.human?.tf) {
            try {
                detector.human.tf.dispose(tensor);
            } catch (disposeError) {
                console.warn("RP==Error disposing tensor:", disposeError);
            }
        }
        activeFrame = false;
    }
};

const init = async () => {
    try {
        console.log("RP==Initializing offscreen worker...");
        
        // Load settings
        console.log("RP==Loading settings...");
        let _settings = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ type: "getSettings" }, (settings) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                } else {
                    resolve(settings);
                }
            });
        });
        
        settings = await Settings.init(_settings);
        console.log("RP==Settings loaded successfully");
        
        // Load models with progress tracking
        await loadModels();
        
        // Initialize queue and start listening
        console.log("RP==Initializing processing queue...");
        queue = new Queue(runDetection);
        
        console.log("RP==Starting message listeners...");
        startListening();
        
        console.log("RP==Offscreen worker initialization complete");
    } catch (error) {
        console.error("RP==Failed to initialize offscreen worker:", error);
        chrome.runtime.sendMessage({ type: "reloadExtension" });
    }
};

init();
