// when installed or updated load settings

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

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.get(["rp-settings"], function (result) {
        if (
            result["rp-settings"] === undefined ||
            result["rp-settings"] === null
        ) {
            chrome.storage.sync.set({ "rp-settings": defaultSettings });
        } else {
            // if there are any new settings, add them to the settings object
            chrome.storage.sync.set({
                "rp-settings": { ...defaultSettings, ...result["rp-settings"] },
            });
        }
    });

    // Recreate context menu on install/update
    chrome.contextMenus.removeAll(() => {
        createContextMenu();
    });

    // Ensure offscreen document exists
    createOffscreenDoc();
});

const createOffscreenDoc = async () => {
    try {
        // Check if offscreen document already exists
        if (chrome?.offscreen) {
            const existingDocuments = await chrome.offscreen.hasDocument?.() || false;

            if (existingDocuments) {
                console.log("RP==Offscreen document already exists");
                return;
            }

            await chrome.offscreen.createDocument({
                url: chrome.runtime.getURL("src/offscreen.html"),
                reasons: ["DOM_PARSER"],
                justification: "Process Images",
            });
            console.log("RP==Offscreen document created successfully");
        }
    } catch (error) {
        // Silently handle duplicate offscreen document error
        if (error.message?.includes("Only a single offscreen document")) {
            console.log("RP==Offscreen document already exists (caught)");
        } else {
            console.error("RP==Error creating offscreen document:", error);
        }
    }
};

// Create offscreen document on startup
createOffscreenDoc();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
        if (request.type === "getSettings") {
            chrome.storage.sync.get(["rp-settings"], function (result) {
                try {
                    const settings = result["rp-settings"] || defaultSettings;
                    sendResponse(settings);

                    const isVideoEnabled = settings.status && settings.blurVideos;
                    
                    chrome.contextMenus.update("enable-detection", {
                        enabled: isVideoEnabled,
                        checked: isVideoEnabled,
                        title: isVideoEnabled
                            ? "Enabled for this video"
                            : "Please enable video detection in settings",
                    }, () => {
                        if (chrome.runtime.lastError) {
                            console.warn("RP==Context menu update error:", chrome.runtime.lastError);
                        }
                    });
                } catch (error) {
                    console.error("RP==Error processing getSettings:", error);
                    sendResponse(defaultSettings);
                }
            });
            return true;
        } else if (request.type === "video-status") {
            chrome.contextMenus.update("enable-detection", {
                checked: request.status,
            }, () => {
                if (chrome.runtime.lastError) {
                    console.warn("RP==Context menu video-status update error:", chrome.runtime.lastError);
                }
            });
            return true;
        } else if (request.type === "reloadExtension") {
            try {
                // kill the offscreen document
                chrome?.offscreen?.closeDocument().catch(err => {
                    console.warn("RP==Error closing offscreen document:", err);
                });
                // recreate the offscreen document
                setTimeout(() => {
                    createOffscreenDoc();
                }, 100);
            } catch (error) {
                console.error("RP==Error reloading extension:", error);
            }
        }
    } catch (error) {
        console.error("RP==Error in message listener:", error);
        if (sendResponse) {
            sendResponse({ error: "Internal error occurred" });
        }
    }
    return true;
});

// context menu: "enable detection on this video"
const createContextMenu = () => {
    try {
        chrome.contextMenus.create({
            id: "enable-detection",
            title: "Enable for this video",
            contexts: ["all"],
            type: "checkbox",
            enabled: true,
            checked: true,
        }, () => {
            if (chrome.runtime.lastError) {
                // Menu item already exists, ignore
                if (chrome.runtime.lastError.message?.includes("duplicate id")) {
                    console.log("RP==Context menu already exists");
                } else {
                    console.error("RP==Context menu creation error:", chrome.runtime.lastError);
                }
            } else {
                console.log("RP==Context menu created successfully");
            }
        });
    } catch (error) {
        console.error("RP==Error in context menu creation:", error);
    }
};

// Create context menu on startup
createContextMenu();

chrome.contextMenus.onClicked.addListener((info, tab) => {
    try {
        console.log("RP==Context menu clicked", info, tab);
        
        if (!tab || !tab.id) {
            console.error("RP==Invalid tab information");
            return;
        }

        if (info.menuItemId === "enable-detection") {
            const message = {
                type: info.checked ? "enable-detection" : "disable-detection",
            };
            
            chrome.tabs.sendMessage(tab.id, message, (response) => {
                if (chrome.runtime.lastError) {
                    console.warn("RP==Error sending message to tab:", chrome.runtime.lastError);
                } else {
                    console.log("RP==Context menu action sent successfully");
                }
            });
        }
    } catch (error) {
        console.error("RP==Error in context menu click handler:", error);
    }
    
    return true;
});

// on install, onboarding
chrome.runtime.onInstalled.addListener(function (details) {
    if (details?.reason === "install") {
        chrome.tabs.create({
            url: "https://github.com/Abs6187/ReelsPRO",
        });
    } else if (details?.reason === "update") {
       
    }
});

// on uninstall
chrome.runtime.setUninstallURL("https://github.com/Abs6187/ReelsPRO");
