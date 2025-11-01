/**
 * Standardized error handling and logging for ReelsPRO extension
 */

/**
 * Error codes for different types of failures
 */
export const ERROR_CODES = {
    // Library and initialization errors
    HUMAN_LIBRARY_NOT_FOUND: 'HUMAN_LIBRARY_NOT_FOUND',
    HUMAN_INIT_FAILED: 'HUMAN_INIT_FAILED',
    NSFW_MODEL_LOAD_FAILED: 'NSFW_MODEL_LOAD_FAILED',
    TENSORFLOW_NOT_AVAILABLE: 'TENSORFLOW_NOT_AVAILABLE',
    
    // Network and CORS errors
    CORS_ERROR: 'CORS_ERROR',
    IMAGE_LOAD_FAILED: 'IMAGE_LOAD_FAILED',
    VIDEO_LOAD_FAILED: 'VIDEO_LOAD_FAILED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    
    // Processing errors
    DETECTION_FAILED: 'DETECTION_FAILED',
    TENSOR_CREATION_FAILED: 'TENSOR_CREATION_FAILED',
    MEMORY_ERROR: 'MEMORY_ERROR',
    PROCESSING_TIMEOUT: 'PROCESSING_TIMEOUT',
    
    // Settings and storage errors
    SETTINGS_LOAD_FAILED: 'SETTINGS_LOAD_FAILED',
    SETTINGS_SAVE_FAILED: 'SETTINGS_SAVE_FAILED',
    STORAGE_ERROR: 'STORAGE_ERROR',
    
    // Queue and synchronization errors
    QUEUE_ERROR: 'QUEUE_ERROR',
    RACE_CONDITION: 'RACE_CONDITION',
    
    // General errors
    INVALID_INPUT: 'INVALID_INPUT',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

/**
 * Error severity levels
 */
export const ERROR_SEVERITY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL'
};

/**
 * Standardized error class for ReelsPRO
 */
export class ReelsPROError extends Error {
    /**
     * Create a new ReelsPRO error
     * @param {string} code - Error code from ERROR_CODES
     * @param {string} message - Human-readable error message
     * @param {string} severity - Error severity level
     * @param {Object} context - Additional context information
     * @param {Error} originalError - Original error that caused this error
     */
    constructor(code, message, severity = ERROR_SEVERITY.MEDIUM, context = {}, originalError = null) {
        super(message);
        this.name = 'ReelsPROError';
        this.code = code;
        this.severity = severity;
        this.context = context;
        this.originalError = originalError;
        this.timestamp = new Date().toISOString();
    }

    /**
     * Convert error to JSON for logging
     * @returns {Object} JSON representation of the error
     */
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            severity: this.severity,
            context: this.context,
            timestamp: this.timestamp,
            stack: this.stack,
            originalError: this.originalError ? {
                name: this.originalError.name,
                message: this.originalError.message,
                stack: this.originalError.stack
            } : null
        };
    }
}

/**
 * Centralized error logger
 */
export class ErrorLogger {
    static logError(error, additionalContext = {}) {
        const errorData = {
            timestamp: new Date().toISOString(),
            url: window.location?.href || 'unknown',
            userAgent: navigator.userAgent,
            ...additionalContext
        };

        if (error instanceof ReelsPROError) {
            errorData.error = error.toJSON();
        } else {
            errorData.error = {
                name: error.name || 'Error',
                message: error.message || 'Unknown error',
                stack: error.stack,
                code: ERROR_CODES.UNKNOWN_ERROR,
                severity: ERROR_SEVERITY.MEDIUM
            };
        }

        // Log to console with appropriate level
        const severity = errorData.error.severity;
        if (severity === ERROR_SEVERITY.CRITICAL || severity === ERROR_SEVERITY.HIGH) {
            console.error('HB==CRITICAL ERROR:', errorData);
        } else if (severity === ERROR_SEVERITY.MEDIUM) {
            console.warn('HB==ERROR:', errorData);
        } else {
            console.log('HB==INFO:', errorData);
        }

        // Could be extended to send to analytics service
        // this.sendToAnalytics(errorData);
    }

    static logInfo(message, context = {}) {
        console.log('HB==INFO:', {
            timestamp: new Date().toISOString(),
            message,
            context
        });
    }

    static logWarning(message, context = {}) {
        console.warn('HB==WARNING:', {
            timestamp: new Date().toISOString(),
            message,
            context
        });
    }
}

/**
 * Helper functions for creating standardized errors
 */
export const createError = {
    humanLibraryNotFound: (context = {}) => new ReelsPROError(
        ERROR_CODES.HUMAN_LIBRARY_NOT_FOUND,
        'Human library is not available. Please ensure human.js is loaded.',
        ERROR_SEVERITY.CRITICAL,
        context
    ),

    humanInitFailed: (originalError, context = {}) => new ReelsPROError(
        ERROR_CODES.HUMAN_INIT_FAILED,
        'Failed to initialize Human library',
        ERROR_SEVERITY.CRITICAL,
        context,
        originalError
    ),

    nsfwModelLoadFailed: (originalError, context = {}) => new ReelsPROError(
        ERROR_CODES.NSFW_MODEL_LOAD_FAILED,
        'Failed to load NSFW detection model',
        ERROR_SEVERITY.HIGH,
        context,
        originalError
    ),

    corsError: (url, context = {}) => new ReelsPROError(
        ERROR_CODES.CORS_ERROR,
        `CORS error loading resource: ${url}`,
        ERROR_SEVERITY.MEDIUM,
        { url, ...context }
    ),

    imageLoadFailed: (src, originalError, context = {}) => new ReelsPROError(
        ERROR_CODES.IMAGE_LOAD_FAILED,
        `Failed to load image: ${src}`,
        ERROR_SEVERITY.MEDIUM,
        { src, ...context },
        originalError
    ),

    detectionFailed: (originalError, context = {}) => new ReelsPROError(
        ERROR_CODES.DETECTION_FAILED,
        'Content detection failed',
        ERROR_SEVERITY.MEDIUM,
        context,
        originalError
    ),

    processingTimeout: (context = {}) => new ReelsPROError(
        ERROR_CODES.PROCESSING_TIMEOUT,
        'Processing operation timed out',
        ERROR_SEVERITY.MEDIUM,
        context
    ),

    invalidInput: (message, context = {}) => new ReelsPROError(
        ERROR_CODES.INVALID_INPUT,
        message || 'Invalid input provided',
        ERROR_SEVERITY.LOW,
        context
    )
};