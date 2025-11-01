import {
    attachObserversListener,
    initMutationObserver,
    killObserver,
} from "./modules/observers";
import Settings from "./modules/settings";
import { attachStyleListener } from "./modules/style";
import videoTimeTracker from "./modules/videoTimeTracker";

const attachAllListeners = () => {
    // Listen for more settings
    attachStyleListener();
    attachObserversListener();

    // listen for getCurrentWebsite from popup.js
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === "getCurrentWebsite") {
            sendResponse({ currentWebsite: window.location.hostname });
        }
    });
};

if (window.self === window.top) {
    attachAllListeners();
    initMutationObserver();

    // Initialize video time tracker
    setTimeout(() => {
        videoTimeTracker.observeVideos();
    }, 1000);

    Settings.init()
        .then((settings) => {
            if (
                settings
                    .getWhitelist()
                    .includes(
                        window.location.hostname?.split("www.")?.[1] ??
                            window.location.hostname
                    )
            ) {
                console.log("RP==WHITELISTED SITE");
                killObserver();
                return;
            }

            // turn on/off the extension
            settings.toggleOnOffStatus();
        })
        .catch((e) => {
            console.log("RP==INITIALIZATION ERROR", e);
        });
}
