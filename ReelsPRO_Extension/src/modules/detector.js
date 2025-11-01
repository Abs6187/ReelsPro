// detector.js
// This module exports detector functions and variables

import { createError, ErrorLogger } from './errorHandler.js';

// Configurable model paths
const MODEL_PATHS = {
    nsfw: "src/assets/models/nsfwjs/model.json",
    human: "https://cdn.jsdelivr.net/npm/@vladmandic/human/models/",
};

const getNsfwUrl = () => {
    try {
        return chrome.runtime.getURL(MODEL_PATHS.nsfw);
    } catch (error) {
        console.error("RP==Failed to get NSFW model URL:", error);
        throw new Error("NSFW model path not accessible");
    }
};

const getHumanConfig = () => ({
    modelBasePath: MODEL_PATHS.human,
    backend: "humangl",
    // debug: true,
    cacheSensitivity: 0.9,
    warmup: "none",
    async: true,
    filter: {
        enabled: false,
        // width: 224,
        // height: 224,
    },
    face: {
        enabled: true,
        iris: { enabled: false },
        mesh: { enabled: false },
        emotion: { enabled: false },
        detector: {
            modelPath: "blazeface.json",
            maxDetected: 2,
            minConfidence: 0.25,
        },
        description: {
            enabled: true,
            modelPath: "faceres.json",
        },
    },
    body: {
        enabled: false,
    },
    hand: {
        enabled: false,
    },
    gesture: {
        enabled: false,
    },
    object: {
        enabled: false,
    },
});

const NSFW_CONFIG = {
    size: 224,
    tfScalar: 255,
    topK: 3,
    skipTime: 4000,
    skipFrames: 99,
    cacheSensitivity: 0.9,
    maxCacheAge: 5000, // 5 seconds cache expiration
};

const getNsfwClasses = (factor = 0) => {
    // factor is a number between 0 and 1
    // it's used to increase the threshold for nsfw classes
    // the numbers are based on trial and error
    return {
        0: {
            className: "Drawing",
            nsfw: false,
            thresh: 0.5,
        },
        1: {
            className: "Hentai",
            nsfw: true,
            thresh: 0.5 + (1 - factor) * 0.5, // decrease the factor to make it less strict
        },
        2: {
            className: "Neutral",
            nsfw: false,
            thresh: 0.5 + factor * 0.5, // increase the factor to make it less strict
        },
        3: {
            className: "Porn",
            nsfw: true,
            thresh: 0.1 + (1 - factor) * 0.4, // decrease the factor to make it less strict
        },
        4: {
            className: "Sexy",
            nsfw: true,
            thresh: 0.1 + (1 - factor) * 0.4, // decrease the factor to make it less strict
        },
    };
};

class Detector {
    constructor() {
        this._human = null;
        this._nsfwModel = null;
        this.nsfwCache = {
            predictions: [],
            timestamp: 0,
            skippedFrames: 0,
            lastInputTensor: null,
            recentResults: [], // Track recent detection results for adaptive caching
            maxRecentResults: 10, // Keep last 10 results
        };
    }

    get human() {
        return this._human;
    }

    get nsfwModel() {
        return this._nsfwModel;
    }

    initHuman = async () => {
        // Check if Human library is available globally
        if (typeof Human === 'undefined' || !Human.Human) {
            const error = createError.humanLibraryNotFound();
            ErrorLogger.logError(error);
            throw error;
        }
        
        try {
            const config = getHumanConfig();
            this._human = new Human.Human(config);
            await this._human.load();
            this._human.tf.enableProdMode();
            
            // warmup the model
            const tensor = this._human.tf.zeros([1, 224, 224, 3]);
            await this._human.detect(tensor);
            this._human.tf.dispose(tensor);
            ErrorLogger.logInfo("Human model warmed up successfully");
        } catch (error) {
            const reelsPROError = createError.humanInitFailed(error);
            ErrorLogger.logError(reelsPROError);
            throw reelsPROError;
        }
    };

    humanModelClassify = async (tensor, needToResize) => {
        if (!this._human) await this.initHuman();
        return new Promise((resolve, reject) => {
            const promise = needToResize
                ? this._human.detect(tensor, {
                      filter: {
                          enabled: true,
                          width: needToResize?.newWidth,
                          height: needToResize?.newHeight,
                      },
                  })
                : this._human.detect(tensor);
            promise
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    };

    initNsfwModel = async () => {
        try {
            // load the model from indexedDB if it exists, otherwise load from url
            const indexedDBModel =
                typeof indexedDB !== "undefined" &&
                (await this._human.tf.io.listModels());

            // if the model exists in indexedDB, load it from there
            if (indexedDBModel?.["indexeddb://nsfw-model"]) {
                console.log("RP==Loading NSFW model from IndexedDB");
                this._nsfwModel = await this._human.tf.loadGraphModel(
                    "indexeddb://nsfw-model"
                );
            }
            // otherwise load it from the url
            else {
                console.log("RP==Loading NSFW model from URL");
                const nsfwUrl = getNsfwUrl();
                this._nsfwModel = await this._human.tf.loadGraphModel(nsfwUrl);
                // save the model to indexedDB
                try {
                    await this._nsfwModel.save("indexeddb://nsfw-model");
                    console.log("RP==NSFW model saved to IndexedDB");
                } catch (saveError) {
                    console.warn("RP==Failed to save NSFW model to IndexedDB:", saveError);
                }
            }
            
            // Warmup the model
            const tensor = this._human.tf.zeros([1, 224, 224, 3]);
            await this._nsfwModel.predict(tensor);
            this._human.tf.dispose(tensor);
            console.log("RP==NSFW model warmed up");
        } catch (error) {
            console.error("RP==Failed to initialize NSFW model:", error);
            throw new Error(`NSFW model initialization failed: ${error.message}`);
        }
    };

    nsfwModelSkip = async (input, config) => {
        const tf = this._human.tf;
        let skipFrame = false;
        
        try {
            // Enhanced cache validation
            if (
                config.cacheSensitivity === 0 ||
                !input?.shape ||
                input?.shape.length !== 4 ||
                input?.shape[1] > 3840 ||
                input?.shape[2] > 2160 ||
                input?.shape[1] < 32 ||
                input?.shape[2] < 32
            ) {
                return skipFrame; // cache disabled or input is invalid
            }

            // Time-based cache expiration
            const currentTime = performance.now();
            const cacheAge = currentTime - this.nsfwCache.timestamp;
            const maxCacheAge = config.maxCacheAge || 5000; // 5 seconds default
            
            if (cacheAge > maxCacheAge) {
                this.clearCache();
                return skipFrame;
            }

            if (!this.nsfwCache.lastInputTensor) {
                this.nsfwCache.lastInputTensor = tf.clone(input);
                this.nsfwCache.timestamp = currentTime;
            } else if (
                this.nsfwCache.lastInputTensor.shape[1] !== input.shape[1] ||
                this.nsfwCache.lastInputTensor.shape[2] !== input.shape[2]
            ) {
                // input resolution changed - clear cache
                this.clearCache();
                this.nsfwCache.lastInputTensor = tf.clone(input);
                this.nsfwCache.timestamp = currentTime;
            } else {
                // Calculate similarity with improved algorithm
                const similarity = await this.calculateFrameSimilarity(input, this.nsfwCache.lastInputTensor);
                
                // Update cache
                tf.dispose(this.nsfwCache.lastInputTensor);
                this.nsfwCache.lastInputTensor = tf.clone(input);
                
                // Adaptive sensitivity based on recent results
                const adaptiveSensitivity = this.getAdaptiveSensitivity(config.cacheSensitivity);
                skipFrame = similarity >= adaptiveSensitivity;
            }
        } catch (error) {
            console.error("RP==Cache skip error:", error);
            this.clearCache();
            skipFrame = false;
        }
        
        return skipFrame;
    };

    calculateFrameSimilarity = async (input1, input2) => {
        const tf = this._human.tf;
        let similarity = 0;
        
        try {
            // Use structural similarity instead of just pixel difference
            const diff = tf.sub(input1, input2);
            const squared = tf.square(diff);
            const mean = tf.mean(squared);
            const mse = await mean.data();
            
            // Convert MSE to similarity score (0-1, where 1 is identical)
            const maxPixelValue = 255;
            const normalizedMse = mse[0] / (maxPixelValue * maxPixelValue);
            similarity = Math.max(0, 1 - normalizedMse);
            
            tf.dispose([diff, squared, mean]);
        } catch (error) {
            console.error("RP==Similarity calculation error:", error);
        }
        
        return similarity;
    };

    getAdaptiveSensitivity = (baseSensitivity) => {
        // Adjust sensitivity based on recent detection results
        const recentResults = this.nsfwCache.recentResults || [];
        const positiveRate = recentResults.filter(r => r).length / Math.max(recentResults.length, 1);
        
        // Lower sensitivity if many positive detections (more conservative caching)
        // Higher sensitivity if few positive detections (more aggressive caching)
        const adjustment = (0.5 - positiveRate) * 0.2;
        return Math.max(0.1, Math.min(0.9, baseSensitivity + adjustment));
    };

    clearCache = () => {
        const tf = this._human.tf;
        if (this.nsfwCache.lastInputTensor) {
            tf.dispose(this.nsfwCache.lastInputTensor);
            this.nsfwCache.lastInputTensor = null;
        }
        this.nsfwCache.predictions = [];
        this.nsfwCache.timestamp = 0;
        this.nsfwCache.skippedFrames = 0;
    };

    nsfwModelClassify = async (tensor, config = NSFW_CONFIG) => {
        if (!this._human) await this.initHuman();
        if (!this._nsfwModel) await this.initNsfwModel();
        const tf = this._human.tf;
        if (!tensor) return [];
        let resized, expanded;
        try {
            const skipAllowed = await this.nsfwModelSkip(tensor, config);
            const skipFrame =
                this.nsfwCache.skippedFrames < (config.skipFrames || 0);
            const skipTime =
                (config.skipTime || 0) >
                (performance?.now?.() || Date.now()) - this.nsfwCache.timestamp;

            // if skip is not allowed or skip time is not reached or skip frame is not reached or cache is empty then run the model
            if (
                !skipAllowed ||
                !skipTime ||
                !skipFrame ||
                this.nsfwCache.predictions.length === 0
            ) {
                // if size is not 224, resize the image
                if (
                    tensor.shape[1] !== config.size ||
                    tensor.shape[2] !== config.size
                ) {
                    resized = tf.image.resizeNearestNeighbor(tensor, [
                        config.size,
                        config.size,
                    ]);
                }
                // if 3d tensor, add a dimension
                if (
                    (resized && resized.shape.length === 3) ||
                    tensor.shape.length === 3
                ) {
                    expanded = tf.expandDims(resized || tensor, 0);
                }
                const scalar = tf.scalar(config.tfScalar);
                const normalized = tf.div(
                    expanded || resized || tensor,
                    scalar
                );
                const logits = await this._nsfwModel.predict(normalized);

                this.nsfwCache.predictions = await this.getTopKClasses(
                    logits,
                    config.topK
                );
                this.nsfwCache.timestamp = performance?.now?.() || Date.now();
                this.nsfwCache.skippedFrames = 0;

                tf.dispose(
                    [scalar, normalized, logits]
                        .concat(expanded ? [expanded] : [])
                        .concat(resized ? [resized] : [])
                );
            } else {
                this.nsfwCache.skippedFrames++;
            }

            return this.nsfwCache.predictions;
        } catch (error) {
            console.error("RP==NSFW Detection Error", resized || tensor, error);
        }
    };

    getTopKClasses = async (logits, topK) => {
        const values = await logits.data();

        const valuesAndIndices = [];
        for (let i = 0; i < values.length; i++) {
            valuesAndIndices.push({ value: values[i], index: i });
        }
        valuesAndIndices.sort((a, b) => {
            return b.value - a.value;
        });
        const topkValues = new Float32Array(topK);
        const topkIndices = new Int32Array(topK);
        for (let i = 0; i < topK; i++) {
            topkValues[i] = valuesAndIndices[i].value;
            topkIndices[i] = valuesAndIndices[i].index;
        }

        const topClassesAndProbs = [];
        for (let i = 0; i < topkIndices.length; i++) {
            topClassesAndProbs.push({
                className: getNsfwClasses()?.[topkIndices[i]].className,
                probability: topkValues[i],
                id: topkIndices[i],
            });
        }
        return topClassesAndProbs;
    };
}

const containsNsfw = (nsfwDetections, strictness) => {
    if (!nsfwDetections?.length) return false;
    let highestNsfwDelta = 0;
    let highestSfwDelta = 0;

    const nsfwClasses = getNsfwClasses(strictness);
    nsfwDetections.forEach((det) => {
        if (nsfwClasses?.[det.id].nsfw) {
            highestNsfwDelta = Math.max(
                highestNsfwDelta,
                det.probability - nsfwClasses[det.id].thresh
            );
        } else {
            highestSfwDelta = Math.max(
                highestSfwDelta,
                det.probability - nsfwClasses[det.id].thresh
            );
        }
    });
    return highestNsfwDelta > highestSfwDelta;
};

const genderPredicate = (gender, score, detectMale, detectFemale) => {
    const mPredicate =
        (gender === "male" && score > 0.3) ||
        (gender === "female" && score < 0.2);

    const fePredicate = gender === "female" && score > 0.25;

    if (detectMale && detectFemale) return mPredicate || fePredicate;

    if (detectMale && !detectFemale) {
        return mPredicate;
    }
    if (!detectMale && detectFemale) {
        return fePredicate;
    }

    return false;
};

const containsGenderFace = (detections, detectMale, detectFemale) => {
    if (!detections?.face?.length) {
        return false;
    }

    const faces = detections.face;
    if (detectMale || detectFemale)
        return faces.some(
            (face) =>
                face.age > 20 &&
                genderPredicate(
                    face.gender,
                    face.genderScore,
                    detectMale,
                    detectFemale
                )
        );
    else return false;
};
// export the human variable and the HUMAN_CONFIG object
export { getNsfwClasses, containsNsfw, containsGenderFace, Detector };
