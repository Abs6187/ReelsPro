// Firefox-compatible background script (Manifest V2)
// Removed offscreen API usage as it's not supported in Firefox

const defaultSettings = {
    status: true,
    blurryStartMode: true,
    blurAmount: 20,
    blurImages: true,
    blurVideos: true,
    blurMale: true,
    blurFemale: true,
    unblurImages: true,
    unblurVideos: true,
    gray: true,
    strictness: 0.5, // goes from 0 to 1
    whitelist: [],
    blurryStartTimeout: 7000, // milliseconds
};

// Use browser API for Firefox compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

browserAPI.runtime.onInstalled.addListener(function () {
    browserAPI.storage.sync.get(["hb-settings"], function (result) {
        if (
            result["hb-settings"] === undefined ||
            result["hb-settings"] === null
        ) {
            browserAPI.storage.sync.set({ "hb-settings": defaultSettings });
        } else {
            // if there are any new settings, add them to the settings object
            browserAPI.storage.sync.set({
                "hb-settings": { ...defaultSettings, ...result["hb-settings"] },
            });
        }
    });
});

browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        if (request.type === "getSettings") {
            browserAPI.storage.sync.get(["hb-settings"], function (result) {
                try {
                    const settings = result["hb-settings"] || defaultSettings;
                    sendResponse(settings);

                    const isVideoEnabled = settings.status && settings.blurVideos;
                    
                    browserAPI.contextMenus.update("enable-detection", {
                        enabled: isVideoEnabled,
                        checked: isVideoEnabled,
                        title: isVideoEnabled
                            ? "Enabled for this video"
                            : "Please enable video detection in settings",
                    }, () => {
                        if (browserAPI.runtime.lastError) {
                            console.warn("HB==Context menu update error:", browserAPI.runtime.lastError);
                        }
                    });
                } catch (error) {
                    console.error("HB==Error processing getSettings:", error);
                    sendResponse(defaultSettings);
                }
            });
            return true;
        } else if (request.type === "video-status") {
            browserAPI.contextMenus.update("enable-detection", {
                checked: request.status,
            }, () => {
                if (browserAPI.runtime.lastError) {
                    console.warn("HB==Context menu video-status update error:", browserAPI.runtime.lastError);
                }
            });
            return true;
        } else if (request.type === "reloadExtension") {
            try {
                // Firefox doesn't support offscreen API, so we skip this
                console.log("HB==Extension reload requested (Firefox - no offscreen support)");
            } catch (error) {
                console.error("HB==Error reloading extension:", error);
            }
        }
    } catch (error) {
        console.error("HB==Error in message listener:", error);
        if (sendResponse) {
            sendResponse({ error: "Internal error occurred" });
        }
    }
    return true;
});

// context menu: "enable detection on this video"
browserAPI.contextMenus.create({
    id: "enable-detection",
    title: "Enable for this video",
    contexts: ["all"],
    type: "checkbox",
    enabled: true,
    checked: true,
});

browserAPI.contextMenus.onClicked.addListener((info, tab) => {
    try {
        console.log("HB==Context menu clicked", info, tab);
        
        if (!tab || !tab.id) {
            console.error("HB==Invalid tab information");
            return;
        }

        if (info.menuItemId === "enable-detection") {
            const message = {
                type: info.checked ? "enable-detection" : "disable-detection",
            };
            
            browserAPI.tabs.sendMessage(tab.id, message, (response) => {
                if (browserAPI.runtime.lastError) {
                    console.warn("HB==Error sending message to tab:", browserAPI.runtime.lastError);
                } else {
                    console.log("HB==Context menu action sent successfully");
                }
            });
        }
    } catch (error) {
        console.error("HB==Error in context menu click handler:", error);
    }
    
    return true;
});

// on install, onboarding
browserAPI.runtime.onInstalled.addListener(function (details) {
    if (details?.reason === "install") {
        browserAPI.tabs.create({
            url: "https://github.com/Abs6187/ReelsPRO",
        });
    } else if (details?.reason === "update") {
       
    }
});

// on uninstall
browserAPI.runtime.setUninstallURL("https://github.com/Abs6187/ReelsPRO");