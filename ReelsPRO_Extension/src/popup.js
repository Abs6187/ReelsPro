var settings = {};

initPopup();

const refreshableSettings = [
    "blurImages",
    "blurVideos",
    "blurMale",
    "blurFemale",
    "unblurImages",
    "unblurVideos",
    "blurryStartMode",
    "strictness",
    "whitelist",
];

const allSettings = ["blurAmount", "gray", ...refreshableSettings];

var currentWebsite, refreshMessage, container;

const initCalls = () => {
    const browserLang = navigator.language?.split("-")[0] ?? "en";
    // Ensure settings has a language property
    if (!settings.language) {
        settings.language = browserLang;
    }
    changeLanguage(settings.language, settings);
    displaySettings(settings);
    updateDetectionStatus(); // Update detection status with website name
    addListeners();
};

function initPopup() {
    loadLocalSettings()
        .then(() => getCurrentWebsite())
        .then(() => {
            if (document.readyState === "complete" || "interactive") {
                initCalls();
            } else {
                document.addEventListener("DOMContentLoaded", initCalls);
            }
        });
}

function getCurrentWebsite() {
    return new Promise(function (resolve) {
        chrome.tabs?.query(
            { active: true, currentWindow: true },
            function (tabs) {
                if (!tabs || tabs.length === 0) {
                    console.warn("RP==No active tabs found");
                    currentWebsite = null;
                    resolve();
                    return;
                }

                const activeTab = tabs[0];
                
                // Fallback: Extract hostname from tab URL if available
                if (activeTab.url) {
                    try {
                        const url = new URL(activeTab.url);
                        const fallbackHostname = url.hostname?.split("www.")?.[1] ?? url.hostname;
                        currentWebsite = fallbackHostname;
                    } catch (urlError) {
                        console.warn("RP==Error parsing tab URL:", urlError);
                        currentWebsite = null;
                    }
                }

                // Try to get website from content script
                chrome.tabs.sendMessage(
                    activeTab.id,
                    { type: "getCurrentWebsite" },
                    function (response) {
                        if (chrome.runtime.lastError) {
                            console.warn("RP==Content script not available:", chrome.runtime.lastError.message);
                            // Keep the fallback hostname we set above
                        } else if (response?.currentWebsite) {
                            console.log("RP==Website from content script:", response);
                            // Properly process website name - remove www. prefix
                            let websiteName = response.currentWebsite;
                            if (websiteName.startsWith('www.')) {
                                websiteName = websiteName.substring(4);
                            }
                            currentWebsite = websiteName;
                        }
                        
                        // Ensure we have a valid website name
                        if (!currentWebsite && activeTab.url) {
                            try {
                                const url = new URL(activeTab.url);
                                let hostname = url.hostname;
                                if (hostname.startsWith('www.')) {
                                    hostname = hostname.substring(4);
                                }
                                currentWebsite = hostname;
                            } catch (error) {
                                console.warn("RP==Final fallback failed:", error);
                                currentWebsite = "unknown";
                            }
                        }
                        
                        // Update detection status after getting website
                        if (settings && currentWebsite) {
                            updateDetectionStatus();
                        }
                        
                        resolve();
                    }
                );
            }
        );
    });
}

function loadLocalSettings() {
    return new Promise(function (resolve) {
        chrome.storage.sync.get(["rp-settings"], function (storage) {
            settings = storage["rp-settings"];
            resolve();
        });
    });
}

function updateDetectionStatus() {
    if (!currentWebsite) {
        console.warn("RP==No website detected for status update");
        return;
    }
    
    const isWhitelisted = settings.whitelist && settings.whitelist.includes(currentWebsite);
    const isEnabled = settings.status && !isWhitelisted;
    
    let statusElement = document.getElementById('detectionStatus');
    if (!statusElement) {
        // Create status element if it doesn't exist
        statusElement = document.createElement('div');
        statusElement.id = 'detectionStatus';
        statusElement.className = 'detection-status';
        const container = document.getElementById('container');
        if (container && container.firstChild) {
            container.insertBefore(statusElement, container.firstChild);
        }
    }
    
    const browserLang = navigator.language?.split("-")[0] ?? "en";
    const lang = settings.language || browserLang;
    const translations = getTranslations(settings);
    
    let statusText;
    if (isWhitelisted) {
        statusText = translations[lang]['#detectionStatusWhitelisted'];
    } else if (isEnabled) {
        statusText = translations[lang]['#detectionStatus'];
    } else {
        statusText = translations[lang]['#detectionStatusOff'];
    }
    
    // Replace {website} placeholder with actual website name
    if (statusText && statusText.includes('{website}')) {
        statusText = statusText.replace('{website}', currentWebsite);
    }
    
    statusElement.textContent = statusText || `Detection status for ${currentWebsite}`;
}

function toggleAllInputs() {
    if (container) {
        container.style.opacity = settings.status ? 1 : 0.5;
    }
    allSettings.forEach(function (setting) {
        document.querySelector("input[name=" + setting + "]").disabled =
            !settings.status;
    });
}

function displaySettings(settings) {
    console.log("display settings", settings);
    document.querySelector("input[name=status]").checked = settings.status;
    document.querySelector("input[name=blurryStartMode]").checked =
        settings.blurryStartMode;
    document.querySelector("input[name=blurAmount]").value =
        settings.blurAmount;
    document.getElementById("blur-amount-value").textContent =
        `${settings.blurAmount}%`;
    document.querySelector("input[name=gray]").checked = settings.gray ?? true;
    document.querySelector("input[name=strictness]").value =
        +settings.strictness;
    document.querySelector("span[id=strictness-value]").textContent =
        +settings.strictness * 100 + "%";
    document.querySelector("input[name=blurImages]").checked =
        settings.blurImages;
    document.querySelector("input[name=blurVideos]").checked =
        settings.blurVideos;
    document.querySelector("input[name=blurMale]").checked = settings.blurMale;
    document.querySelector("input[name=blurFemale]").checked =
        settings.blurFemale;
    document.querySelector("input[name=unblurImages]").checked =
        settings.unblurImages;
    document.querySelector("input[name=unblurVideos]").checked =
        settings.unblurVideos;
    document.getElementById("language").value = settings.language || "en";
    displayWhiteList();
    toggleAllInputs();
}

/* addListeners - (1) Listen for changes to popup modal inputs (2) route to appropriate function  */
function addListeners() {
    document
        .querySelector("input[name=status]")
        .addEventListener("change", updateStatus);
    document
        .querySelector("input[name=blurryStartMode]")
        .addEventListener("change", updateCheckbox("blurryStartMode"));
    document
        .querySelector("input[name=blurImages]")
        .addEventListener("change", updateCheckbox("blurImages"));
    document
        .querySelector("input[name=blurVideos]")
        .addEventListener("change", updateCheckbox("blurVideos"));
    document
        .querySelector("input[name=blurMale]")
        .addEventListener("change", updateCheckbox("blurMale"));
    document
        .querySelector("input[name=blurFemale]")
        .addEventListener("change", updateCheckbox("blurFemale"));
    document
        .querySelector("input[name=blurAmount]")
        .addEventListener("change", updateBlurAmount);
    document
        .querySelector("input[name=gray]")
        .addEventListener("change", updateCheckbox("gray"));
    document
        .querySelector("input[name=strictness]")
        .addEventListener("change", updateStrictness);
    document
        .querySelector("input[name=unblurImages]")
        .addEventListener("change", updateCheckbox("unblurImages"));
    document
        .querySelector("input[name=unblurVideos]")
        .addEventListener("change", updateCheckbox("unblurVideos"));
    document.getElementById("language").addEventListener("change", function () {
        changeLanguage(this.value, settings);
    });
    document
        .getElementById("whitelist")
        .addEventListener("change", updateWhitelist);

    refreshMessage = document.querySelector("#refresh-message");
    container = document.querySelector("#container");
}

function displayWhiteList(skipSet = false) {
    const whiteListContainer = document.getElementById("whitelist-container");
    const whiteList = document.getElementById("whitelist");
    const websiteName = document.getElementById("website-name");
    const whiteListStatusOn = document.getElementById("whitelist-status-on");
    const whiteListStatusOff = document.getElementById("whitelist-status-off");
    if (!currentWebsite) {
        whiteListContainer.classList.add("hidden");
        return;
    } else {
        whiteListContainer.classList.remove("hidden");
    }
    if (!skipSet) {
        websiteName.textContent = currentWebsite;
        whiteList.checked = !settings.whitelist.includes(currentWebsite);
    }
    if (whiteList.checked) {
        whiteListStatusOn.classList.remove("hidden");
        whiteListStatusOff.classList.add("hidden");
    } else {
        whiteListStatusOn.classList.add("hidden");
        whiteListStatusOff.classList.remove("hidden");
    }
}

function updateStatus() {
    settings.status = document.querySelector("input[name=status]").checked;
    chrome.storage.sync.set({ "rp-settings": settings });
    toggleAllInputs();
    sendUpdatedSettings("status");
    showRefreshMessage("status");
}

function updateBlurAmount() {
    settings.blurAmount = document.querySelector(
        "input[name=blurAmount]"
    ).value;
    document.querySelector("span[id=blur-amount-value]").textContent =
        settings.blurAmount + "%";
    chrome.storage.sync.set({ "rp-settings": settings });
    sendUpdatedSettings("blurAmount");
    showRefreshMessage("blurAmount");
}

function updateStrictness() {
    settings.strictness = document.querySelector(
        "input[name=strictness]"
    ).value;

    document.querySelector("span[id=strictness-value]").textContent =
        +settings.strictness * 100 + "%";

    chrome.storage.sync.set({ "rp-settings": settings });
    sendUpdatedSettings("strictness");
    showRefreshMessage("strictness");
}

function updateCheckbox(key) {
    return function () {
        settings[key] = document.querySelector(
            "input[name=" + key + "]"
        ).checked;
        chrome.storage.sync.set({ "rp-settings": settings });
        sendUpdatedSettings(key);
        showRefreshMessage(key);
    };
}

function changeLanguage(lang, settings) {
    document.body.lang = lang;
    document.getElementById("container").dir = RP_TRANSLATIONS_DIR[lang];

    const translations = getTranslations(settings)?.[lang];
    const keys = Object.keys(translations);
    keys.forEach((key) => {
        const elements = document.querySelectorAll(key);
        elements.forEach((element) => {
            let text = translations[key];
            // Replace {website} placeholder with actual website name
            if (text.includes('{website}') && currentWebsite) {
                text = text.replace('{website}', currentWebsite);
            }
            // Use innerHTML only for translations that may contain safe HTML
            // Text is from controlled translation files, not user input
            element.innerHTML = text;
            // change direction of element
            if (RP_TRANSLATIONS_DIR[lang]) {
                element.dir = RP_TRANSLATIONS_DIR[lang];
            }
        });
    });

    settings.language = lang;
    chrome.storage.sync.set({ "rp-settings": settings });
}

function updateWhitelist(e) {
    if (e.target.checked) {
        settings.whitelist = settings.whitelist.filter(
            (item) => item !== currentWebsite
        );
    } else {
        settings.whitelist.push(currentWebsite);
    }
    chrome.storage.sync.set({ "rp-settings": settings });
    sendUpdatedSettings("whitelist");
    showRefreshMessage("whitelist");
    displayWhiteList(true);
}

/* sendUpdatedSettings - Send updated settings object to tab.js to modify active tab blur CSS */
function sendUpdatedSettings(key) {
    const message = {
        type: "updateSettings",
        newSetting: {
            key: key,
            value: settings[key],
        },
    };

    chrome.runtime.sendMessage(message);
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, message);
    });
}

function showRefreshMessage(key) {
    if (refreshableSettings.includes(key)) {
        refreshMessage.classList.remove("hidden");
    }
}
