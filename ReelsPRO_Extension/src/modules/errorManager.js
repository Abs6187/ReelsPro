/**
 * Centralized Error Management System for ReelsPro Extension
 * Handles error logging, rate limiting, and deduplication
 */

class ErrorManager {
    constructor() {
        this.errorCounts = new Map();
        this.errorHistory = new Map();
        this.rateLimits = new Map();
        this.maxErrorsPerType = 5;
        this.rateLimitWindow = 60000; // 1 minute
        this.backoffMultiplier = 2;
        this.maxBackoffTime = 300000; // 5 minutes
    }

    /**
     * Log an error with rate limiting and context
     * @param {string} type - Error type (cors, dom_exception, video_processing, etc.)
     * @param {string} message - Error message
     * @param {object} context - Additional context information
     * @param {string} source - Source URL or identifier
     */
    logError(type, message, context = {}, source = 'unknown') {
        const errorKey = `${type}:${source}`;
        const now = Date.now();

        // Initialize error tracking for this key
        if (!this.errorCounts.has(errorKey)) {
            this.errorCounts.set(errorKey, 0);
            this.errorHistory.set(errorKey, []);
        }

        const errorCount = this.errorCounts.get(errorKey);
        const errorHistory = this.errorHistory.get(errorKey);

        // Check if we're in a rate limit period
        if (this.isRateLimited(errorKey, now)) {
            return false; // Error was rate limited
        }

        // Increment error count
        this.errorCounts.set(errorKey, errorCount + 1);
        errorHistory.push(now);

        // Clean old entries (older than rate limit window)
        const cutoff = now - this.rateLimitWindow;
        const recentErrors = errorHistory.filter(timestamp => timestamp > cutoff);
        this.errorHistory.set(errorKey, recentErrors);

        // Only log if under the rate limit
        if (recentErrors.length <= this.maxErrorsPerType) {
            const logLevel = this.getLogLevel(type, recentErrors.length);
            const contextStr = Object.keys(context).length > 0 ? JSON.stringify(context) : '';
            
            switch (logLevel) {
                case 'error':
                    console.error(`HB==${type.toUpperCase()}: ${message}`, contextStr);
                    break;
                case 'warn':
                    console.warn(`HB==${type.toUpperCase()}: ${message}`, contextStr);
                    break;
                case 'info':
                    console.info(`HB==${type.toUpperCase()}: ${message}`, contextStr);
                    break;
                default:
                    console.log(`HB==${type.toUpperCase()}: ${message}`, contextStr);
            }

            // Set rate limit if we've hit the threshold
            if (recentErrors.length >= this.maxErrorsPerType) {
                this.setRateLimit(errorKey, now);
                console.warn(`HB==Rate limiting ${type} errors for ${source} - too many recent errors`);
            }

            return true; // Error was logged
        }

        return false; // Error was suppressed due to rate limiting
    }

    /**
     * Check if an error type/source combination is currently rate limited
     */
    isRateLimited(errorKey, now = Date.now()) {
        const rateLimitUntil = this.rateLimits.get(errorKey);
        return rateLimitUntil && now < rateLimitUntil;
    }

    /**
     * Set rate limit for an error type/source combination
     */
    setRateLimit(errorKey, now = Date.now()) {
        const errorCount = this.errorCounts.get(errorKey) || 0;
        const backoffTime = Math.min(
            1000 * Math.pow(this.backoffMultiplier, Math.floor(errorCount / this.maxErrorsPerType)),
            this.maxBackoffTime
        );
        this.rateLimits.set(errorKey, now + backoffTime);
    }

    /**
     * Get appropriate log level based on error type and frequency
     */
    getLogLevel(type, errorCount) {
        if (type === 'cors' && errorCount > 2) return 'warn';
        if (type === 'dom_exception') return 'error';
        if (type === 'video_processing' && errorCount > 3) return 'warn';
        if (errorCount > 4) return 'info';
        return 'warn';
    }

    /**
     * Get error statistics for debugging
     */
    getStats() {
        const stats = {};
        for (const [key, count] of this.errorCounts.entries()) {
            const [type, source] = key.split(':');
            if (!stats[type]) stats[type] = { total: 0, sources: {} };
            stats[type].total += count;
            stats[type].sources[source] = count;
        }
        return stats;
    }

    /**
     * Clear error history for a specific source (useful for cleanup)
     */
    clearErrorsForSource(source) {
        const keysToDelete = [];
        for (const key of this.errorCounts.keys()) {
            if (key.endsWith(`:${source}`)) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => {
            this.errorCounts.delete(key);
            this.errorHistory.delete(key);
            this.rateLimits.delete(key);
        });
    }

    /**
     * Reset all error tracking (useful for testing)
     */
    reset() {
        this.errorCounts.clear();
        this.errorHistory.clear();
        this.rateLimits.clear();
    }
}

// Create singleton instance
const errorManager = new ErrorManager();

export { errorManager };