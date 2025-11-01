import { loadImage } from "./helpers.js";

class Queue {
    constructor(runDetectionFn) {
        this.loadingQueue = [];
        this.detectionQueue = [];
        this.queuingStarted = false;
        this.activeProcessing = 0;
        this.activeLoading = 0;
        this.maxLoading = 100;
        this.maxProcessing = 1;
        this.runDetection = runDetectionFn;
        this.isProcessing = false; // Prevent race conditions
    }

    async handleElementLoading(img, onSuccess, onError) {
        let node = null;
        try {
            node = await loadImage(img.src, img.width, img.height);
            await this.processNextElement(node, onSuccess, onError);
        } catch (error) {
            console.error("HB=== image failed to load", img.src, error);
            onError({
                message: "Failed to load image",
                src: img.src,
                error: error.message || error,
            });
        } finally {
            this.activeLoading = Math.max(0, this.activeLoading - 1);
            // Process next item in queue
            this.processLoadingQueue();
        }
    }

    async handleElementProcessing(node, onSuccess, onError) {
        try {
            const result = await this.runDetection(node);
            onSuccess(result);
        } catch (error) {
            console.error("Offscreen== handleElementProcessing error", error);
            onError({
                message: "Failed to process image",
                error: error.message || error,
            });
        } finally {
            this.activeProcessing = Math.max(0, this.activeProcessing - 1);
            // Clean up node reference
            if (node) {
                node.src = "";
                node = null;
            }
            // Process next item in queue
            this.processDetectionQueue();
        }
    }

    async processNextElement(node, onSuccess, onError) {
        if (!node) {
            onError({ message: "Invalid node provided" });
            return;
        }

        try {
            if (this.activeProcessing < this.maxProcessing) {
                this.activeProcessing++;
                await this.handleElementProcessing(node, onSuccess, onError);
            } else {
                this.detectionQueue.push([node, onSuccess, onError]);
            }
        } catch (error) {
            console.error("Offscreen== processNextElement error", error);
            onError({
                message: "Failed to queue element for processing",
                error: error.message || error,
            });
        }
    }

    processLoadingQueue() {
        if (this.loadingQueue.length > 0 && this.activeLoading < this.maxLoading) {
            const nextItem = this.loadingQueue.shift();
            if (nextItem) {
                this.activeLoading++;
                // Use setTimeout to prevent stack overflow
                setTimeout(() => {
                    this.handleElementLoading(...nextItem);
                }, 0);
            }
        }
    }

    processDetectionQueue() {
        if (this.detectionQueue.length > 0 && this.activeProcessing < this.maxProcessing) {
            const nextItem = this.detectionQueue.shift();
            if (nextItem) {
                this.activeProcessing++;
                // Use setTimeout to prevent stack overflow
                setTimeout(() => {
                    this.handleElementProcessing(...nextItem);
                }, 0);
            }
        }
    }

    async add(img, onSuccess, onError) {
        if (!img || !img.src) {
            onError({ message: "Invalid image provided" });
            return;
        }

        try {
            if (this.activeLoading < this.maxLoading) {
                this.activeLoading++;
                // Use setTimeout to prevent blocking
                setTimeout(() => {
                    this.handleElementLoading(img, onSuccess, onError);
                }, 0);
            } else {
                this.loadingQueue.push([img, onSuccess, onError]);
            }
        } catch (error) {
            console.error("HB== addToQueue error", error);
            onError({
                message: "Failed to add image to queue",
                error: error.message || error,
            });
        }
    }

    // Method to clear queues and reset state
    clear() {
        this.loadingQueue.length = 0;
        this.detectionQueue.length = 0;
        this.activeProcessing = 0;
        this.activeLoading = 0;
        this.isProcessing = false;
    }

    // Method to get queue status
    getStatus() {
        return {
            loadingQueue: this.loadingQueue.length,
            detectionQueue: this.detectionQueue.length,
            activeLoading: this.activeLoading,
            activeProcessing: this.activeProcessing,
            maxLoading: this.maxLoading,
            maxProcessing: this.maxProcessing,
        };
    }
}

export default Queue;
