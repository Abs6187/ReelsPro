// videoTimeTracker.js
// Module for tracking time spent watching videos and shorts

class VideoTimeTracker {
    constructor() {
        this.activeVideos = new Map();
        this.totalTimeSpent = 0;
        this.sessionStartTime = Date.now();
        this.loadStats();
    }

    async loadStats() {
        try {
            const result = await chrome.storage.local.get(['videoWatchStats']);
            if (result.videoWatchStats) {
                this.totalTimeSpent = result.videoWatchStats.totalTimeSpent || 0;
            }
        } catch (error) {
            console.error("HB==Error loading video watch stats:", error);
        }
    }

    async saveStats() {
        try {
            await chrome.storage.local.set({
                videoWatchStats: {
                    totalTimeSpent: this.totalTimeSpent,
                    lastUpdated: Date.now()
                }
            });
        } catch (error) {
            console.error("HB==Error saving video watch stats:", error);
        }
    }

    isShortVideo(video) {
        // Check if it's a short video based on URL patterns
        const url = window.location.href;
        return (
            url.includes('/shorts/') ||
            url.includes('/reel/') ||
            url.includes('tiktok.com') ||
            url.includes('/stories/') ||
            video.classList.contains('shorts-video') ||
            video.parentElement?.classList.contains('shorts-player')
        );
    }

    createTimerOverlay(video) {
        // Check if overlay already exists
        const existingOverlay = video.parentElement?.querySelector('.hb-video-timer');
        if (existingOverlay) {
            return existingOverlay;
        }

        const overlay = document.createElement('div');
        overlay.className = 'hb-video-timer';
        overlay.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
            z-index: 10000;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            gap: 4px;
        `;

        const currentTime = document.createElement('div');
        currentTime.className = 'hb-timer-current';
        currentTime.style.cssText = 'font-weight: bold; color: #4CAF50;';

        const totalTime = document.createElement('div');
        totalTime.className = 'hb-timer-total';
        totalTime.style.cssText = 'font-size: 11px; opacity: 0.8;';

        overlay.appendChild(currentTime);
        overlay.appendChild(totalTime);

        // Insert overlay relative to video
        if (video.parentElement) {
            const parentStyle = window.getComputedStyle(video.parentElement);
            if (parentStyle.position === 'static') {
                video.parentElement.style.position = 'relative';
            }
            video.parentElement.appendChild(overlay);
        }

        return overlay;
    }

    formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        if (hrs > 0) {
            return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updateTimerDisplay(video, overlay, elapsed) {
        const currentTime = overlay.querySelector('.hb-timer-current');
        const totalTime = overlay.querySelector('.hb-timer-total');

        if (currentTime) {
            currentTime.textContent = `⏱️ ${this.formatTime(elapsed)}`;
        }

        if (totalTime) {
            const todayTotal = this.totalTimeSpent;
            totalTime.textContent = `Today: ${this.formatTime(todayTotal)}`;
        }
    }

    startTracking(video) {
        if (!video || this.activeVideos.has(video)) {
            return;
        }

        const videoData = {
            startTime: Date.now(),
            lastUpdate: Date.now(),
            timeSpent: 0,
            overlay: null,
            updateInterval: null
        };

        // Create timer overlay
        videoData.overlay = this.createTimerOverlay(video);

        // Update timer every second
        videoData.updateInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - videoData.startTime) / 1000);

            videoData.timeSpent = elapsed;
            this.totalTimeSpent += Math.floor((now - videoData.lastUpdate) / 1000);
            videoData.lastUpdate = now;

            if (videoData.overlay) {
                this.updateTimerDisplay(video, videoData.overlay, elapsed);
            }

            // Save stats every 5 seconds
            if (elapsed % 5 === 0) {
                this.saveStats();
            }
        }, 1000);

        this.activeVideos.set(video, videoData);

        // Add event listeners
        video.addEventListener('pause', () => this.pauseTracking(video));
        video.addEventListener('ended', () => this.stopTracking(video));
        video.addEventListener('seeked', () => this.handleSeek(video));
    }

    pauseTracking(video) {
        const videoData = this.activeVideos.get(video);
        if (!videoData) return;

        if (videoData.updateInterval) {
            clearInterval(videoData.updateInterval);
            videoData.updateInterval = null;
        }

        const now = Date.now();
        this.totalTimeSpent += Math.floor((now - videoData.lastUpdate) / 1000);
        videoData.lastUpdate = now;

        this.saveStats();
    }

    resumeTracking(video) {
        const videoData = this.activeVideos.get(video);
        if (!videoData || videoData.updateInterval) return;

        videoData.lastUpdate = Date.now();

        videoData.updateInterval = setInterval(() => {
            const now = Date.now();
            const elapsed = Math.floor((now - videoData.startTime) / 1000);

            videoData.timeSpent = elapsed;
            this.totalTimeSpent += Math.floor((now - videoData.lastUpdate) / 1000);
            videoData.lastUpdate = now;

            if (videoData.overlay) {
                this.updateTimerDisplay(video, videoData.overlay, elapsed);
            }

            if (elapsed % 5 === 0) {
                this.saveStats();
            }
        }, 1000);
    }

    stopTracking(video) {
        const videoData = this.activeVideos.get(video);
        if (!videoData) return;

        if (videoData.updateInterval) {
            clearInterval(videoData.updateInterval);
        }

        const now = Date.now();
        this.totalTimeSpent += Math.floor((now - videoData.lastUpdate) / 1000);

        // Remove overlay
        if (videoData.overlay && videoData.overlay.parentElement) {
            videoData.overlay.remove();
        }

        this.activeVideos.delete(video);
        this.saveStats();
    }

    handleSeek(video) {
        const videoData = this.activeVideos.get(video);
        if (videoData) {
            videoData.lastUpdate = Date.now();
        }
    }

    observeVideos() {
        // Watch for video elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'VIDEO') {
                        this.attachVideoListeners(node);
                    } else if (node.querySelectorAll) {
                        const videos = node.querySelectorAll('video');
                        videos.forEach(video => this.attachVideoListeners(video));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Attach to existing videos
        document.querySelectorAll('video').forEach(video => {
            this.attachVideoListeners(video);
        });
    }

    attachVideoListeners(video) {
        if (video.dataset.hbTimeTrackerAttached) {
            return;
        }

        video.dataset.hbTimeTrackerAttached = 'true';

        video.addEventListener('play', () => {
            if (!this.activeVideos.has(video)) {
                this.startTracking(video);
            } else {
                this.resumeTracking(video);
            }
        });

        video.addEventListener('pause', () => {
            this.pauseTracking(video);
        });

        video.addEventListener('ended', () => {
            this.stopTracking(video);
        });

        // Start tracking if video is already playing
        if (!video.paused && video.currentTime > 0) {
            this.startTracking(video);
        }
    }

    async getStats() {
        await this.loadStats();
        return {
            totalTimeSpent: this.totalTimeSpent,
            activeVideos: this.activeVideos.size,
            sessionStartTime: this.sessionStartTime,
            formattedTotal: this.formatTime(this.totalTimeSpent)
        };
    }

    async resetStats() {
        this.totalTimeSpent = 0;
        await this.saveStats();
    }
}

// Create singleton instance
const videoTimeTracker = new VideoTimeTracker();

export default videoTimeTracker;
