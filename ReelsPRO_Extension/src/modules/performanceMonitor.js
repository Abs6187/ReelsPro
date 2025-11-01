/**
 * Performance monitoring and metrics collection for ReelsPRO extension
 */

/**
 * Performance metrics collector
 */
export class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.timers = new Map();
        this.counters = new Map();
        this.memoryBaseline = null;
        this.isEnabled = true;
    }

    /**
     * Start timing an operation
     * @param {string} name - Name of the operation
     * @param {Object} context - Additional context information
     */
    startTimer(name, context = {}) {
        if (!this.isEnabled) return;
        
        this.timers.set(name, {
            startTime: performance.now(),
            context
        });
    }

    /**
     * End timing an operation and record the duration
     * @param {string} name - Name of the operation
     * @param {Object} additionalContext - Additional context to merge
     */
    endTimer(name, additionalContext = {}) {
        if (!this.isEnabled) return;
        
        const timer = this.timers.get(name);
        if (!timer) {
            console.warn(`HB==Timer '${name}' not found`);
            return;
        }

        const duration = performance.now() - timer.startTime;
        this.recordMetric(name, duration, {
            ...timer.context,
            ...additionalContext,
            type: 'duration'
        });

        this.timers.delete(name);
    }

    /**
     * Record a performance metric
     * @param {string} name - Metric name
     * @param {number} value - Metric value
     * @param {Object} context - Additional context
     */
    recordMetric(name, value, context = {}) {
        if (!this.isEnabled) return;

        const metric = {
            name,
            value,
            timestamp: Date.now(),
            context
        };

        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }

        const metrics = this.metrics.get(name);
        metrics.push(metric);

        // Keep only last 100 metrics per type to prevent memory bloat
        if (metrics.length > 100) {
            metrics.shift();
        }

        // Log significant performance issues
        this.checkPerformanceThresholds(name, value, context);
    }

    /**
     * Increment a counter
     * @param {string} name - Counter name
     * @param {number} increment - Amount to increment (default: 1)
     * @param {Object} context - Additional context
     */
    incrementCounter(name, increment = 1, context = {}) {
        if (!this.isEnabled) return;

        const current = this.counters.get(name) || 0;
        this.counters.set(name, current + increment);

        this.recordMetric(`${name}_count`, current + increment, {
            ...context,
            type: 'counter'
        });
    }

    /**
     * Record memory usage
     * @param {string} operation - Operation name
     */
    recordMemoryUsage(operation) {
        if (!this.isEnabled || !performance.memory) return;

        const memory = {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
        };

        this.recordMetric(`memory_${operation}`, memory.used, {
            type: 'memory',
            total: memory.total,
            limit: memory.limit,
            utilization: (memory.used / memory.total) * 100
        });

        // Set baseline on first measurement
        if (!this.memoryBaseline) {
            this.memoryBaseline = memory.used;
        }

        // Check for memory leaks
        const growth = memory.used - this.memoryBaseline;
        if (growth > 50 * 1024 * 1024) { // 50MB growth
            console.warn('HB==Potential memory leak detected:', {
                operation,
                growth: `${(growth / 1024 / 1024).toFixed(2)}MB`,
                current: `${(memory.used / 1024 / 1024).toFixed(2)}MB`
            });
        }
    }

    /**
     * Check if metrics exceed performance thresholds
     * @param {string} name - Metric name
     * @param {number} value - Metric value
     * @param {Object} context - Metric context
     */
    checkPerformanceThresholds(name, value, context) {
        const thresholds = {
            'image_processing': 5000, // 5 seconds
            'video_frame_processing': 1000, // 1 second
            'model_loading': 30000, // 30 seconds
            'detection_inference': 2000, // 2 seconds
        };

        const threshold = thresholds[name];
        if (threshold && value > threshold) {
            console.warn(`HB==Performance threshold exceeded for ${name}:`, {
                value: `${value.toFixed(2)}ms`,
                threshold: `${threshold}ms`,
                context
            });
        }
    }

    /**
     * Get performance summary
     * @returns {Object} Performance summary statistics
     */
    getSummary() {
        const summary = {
            timestamp: Date.now(),
            metrics: {},
            counters: Object.fromEntries(this.counters),
            memory: performance.memory ? {
                current: performance.memory.usedJSHeapSize,
                baseline: this.memoryBaseline,
                growth: this.memoryBaseline ? 
                    performance.memory.usedJSHeapSize - this.memoryBaseline : 0
            } : null
        };

        // Calculate statistics for each metric type
        for (const [name, metrics] of this.metrics.entries()) {
            if (metrics.length === 0) continue;

            const values = metrics.map(m => m.value);
            const recent = metrics.slice(-10); // Last 10 measurements

            summary.metrics[name] = {
                count: metrics.length,
                min: Math.min(...values),
                max: Math.max(...values),
                avg: values.reduce((a, b) => a + b, 0) / values.length,
                recent: recent.map(m => ({
                    value: m.value,
                    timestamp: m.timestamp
                }))
            };
        }

        return summary;
    }

    /**
     * Clear all metrics and reset counters
     */
    reset() {
        this.metrics.clear();
        this.timers.clear();
        this.counters.clear();
        this.memoryBaseline = performance.memory ? performance.memory.usedJSHeapSize : null;
    }

    /**
     * Enable or disable performance monitoring
     * @param {boolean} enabled - Whether to enable monitoring
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled) {
            this.reset();
        }
    }

    /**
     * Log performance summary to console
     */
    logSummary() {
        if (!this.isEnabled) return;
        
        const summary = this.getSummary();
        console.log('HB==Performance Summary:', summary);
    }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator function for timing method execution
 * @param {string} metricName - Name for the performance metric
 * @returns {Function} Decorator function
 */
export function timed(metricName) {
    return function(target, propertyName, descriptor) {
        const method = descriptor.value;

        descriptor.value = async function(...args) {
            const fullMetricName = `${target.constructor.name}_${metricName || propertyName}`;
            performanceMonitor.startTimer(fullMetricName);
            
            try {
                const result = await method.apply(this, args);
                performanceMonitor.endTimer(fullMetricName, { success: true });
                return result;
            } catch (error) {
                performanceMonitor.endTimer(fullMetricName, { success: false, error: error.message });
                throw error;
            }
        };

        return descriptor;
    };
}

/**
 * Helper function to wrap async functions with performance monitoring
 * @param {string} name - Operation name
 * @param {Function} fn - Function to wrap
 * @returns {Function} Wrapped function
 */
export function withPerformanceMonitoring(name, fn) {
    return async function(...args) {
        performanceMonitor.startTimer(name);
        performanceMonitor.recordMemoryUsage(`${name}_start`);
        
        try {
            const result = await fn.apply(this, args);
            performanceMonitor.endTimer(name, { success: true });
            performanceMonitor.recordMemoryUsage(`${name}_end`);
            performanceMonitor.incrementCounter(`${name}_success`);
            return result;
        } catch (error) {
            performanceMonitor.endTimer(name, { success: false, error: error.message });
            performanceMonitor.incrementCounter(`${name}_error`);
            throw error;
        }
    };
}