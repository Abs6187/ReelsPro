import { emitEvent } from "./helpers.js";
import { DEFAULT_SETTINGS } from "../constants.js";

/**
 * Settings management class for ReelsPRO extension
 * Handles all user preferences and configuration options
 */
class Settings {
    /**
     * Creates a new Settings instance
     * @param {Object} settings - Initial settings object, defaults to DEFAULT_SETTINGS
     * @private
     */
    constructor(settings = DEFAULT_SETTINGS) {
        this._settings = settings;
    }

    /**
     * Check if male face detection is enabled
     * @returns {boolean} True if extension is active and male detection is enabled
     */
    shouldDetectMale() {
        if (!this._settings.status) return false;
        return this._settings.blurMale;
    }

    /**
     * Check if female face detection is enabled
     * @returns {boolean} True if extension is active and female detection is enabled
     */
    shouldDetectFemale() {
        if (!this._settings.status) return false;
        return this._settings.blurFemale;
    }

    /**
     * Check if any gender detection is enabled
     * @returns {boolean} True if extension is active and any gender detection is enabled
     */
    shouldDetectGender() {
        if (!this._settings.status) return false;
        return this.shouldDetectMale() || this.shouldDetectFemale();
    }

    shouldDetectImages() {
        if (!this._settings.status) return false;
        return this._settings.blurImages;
    }

    shouldDetectVideos() {
        if (!this._settings.status) return false;
        return this._settings.blurVideos;
    }

    // alias
    shouldBlurImages() {
        return this.shouldDetectImages();
    }

    // alias
    shouldBlurVideos() {
        return this.shouldDetectVideos();
    }

    shouldUnblurImages() {
        if (!this._settings.status) return false;
        return this._settings.unblurImages;
    }

    shouldUnblurVideos() {
        if (!this._settings.status) return false;
        return this._settings.unblurVideos;
    }

    shouldDetect() {
        if (!this._settings.status) return false;
        return this.shouldDetectImages() || this.shouldDetectVideos();
    }

    isBlurryStartMode() {
        if (!this.shouldDetect()) return false;
        return this._settings.blurryStartMode;
    }

    /**
     * Get the blur amount setting
     * @returns {number} Blur amount in pixels, or 0 if detection is disabled
     */
    getBlurAmount() {
        if (!this.shouldDetect()) return 0;
        return this._settings.blurAmount;
    }

    /**
     * Get the detection strictness setting
     * @returns {number} Strictness value between 0-1, or 0 if detection is disabled
     */
    getStrictness() {
        if (!this.shouldDetect()) return 0;
        return this._settings.strictness;
    }

    /**
     * Check if grayscale effect is enabled
     * @returns {boolean} True if grayscale is enabled and detection is active
     */
    isGray() {
        if (!this.shouldDetect()) return false;
        return this._settings.gray;
    }

    /**
     * Get the list of whitelisted websites
     * @returns {string[]} Array of whitelisted domain names
     */
    getWhitelist() {
        return this._settings.whitelist;
    }

    /**
     * Get the blurry start mode timeout duration
     * @returns {number} Timeout in milliseconds, defaults to 7000ms
     */
    getBlurryStartTimeout() {
        return this._settings.blurryStartTimeout || 7000;
    }

    getSettings() {
        return this._settings;
    }

    setSettings(settings) {
        this._settings = settings;
    }

    toggleOnOffStatus() {
        if (
            !this._settings.whitelist?.includes(
                window.location.hostname?.split("www.")?.[1] ??
                    window.location.hostname
            )
        ) {
            emitEvent("toggleOnOffStatus", this);
        }
    }

    listenForChanges() {
        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) => {
                if (request.type === "updateSettings") {
                    this.updateSettings(request.newSetting);
                }
                return true;
            }
        );
    }
    /**
     * Asynchronously initialize a Settings instance
     * Acts as an async constructor, loading settings from storage
     * @param {Object|null} _loadedSettings - Pre-loaded settings object, or null to load from storage
     * @returns {Promise<Settings>} Initialized Settings instance
     */
    static async init(_loadedSettings = null) {
        const loadedSettings =
            _loadedSettings ??
            (await new Promise((resolve) => {
                chrome.runtime.sendMessage(
                    { type: "getSettings" },
                    (settings) => {
                        resolve(settings);
                    }
                );
            }));
        const settings = new Settings(loadedSettings);
        settings.listenForChanges();
        emitEvent("settingsLoaded", settings);
        return settings;
    }

    updateSettings(newSetting) {
        const { key, value } = newSetting;

        this._settings[key] = value;
        switch (key) {
            case "status":
                this.toggleOnOffStatus();
                break;
            case "blurAmount":
                emitEvent("changeBlurAmount", this);
                break;
            case "gray":
                emitEvent("changeGray", this);
                break;
        }
    }
}

export default Settings;
