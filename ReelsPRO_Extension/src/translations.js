// Language dictionary containing translations for English and Arabic
const getTranslations = (settings = {}) => {
    // Provide default values if settings is undefined
    const safeSettings = {
        blurAmount: settings?.blurAmount || 20,
        strictness: settings?.strictness || 0.5,
        ...settings
    };
    return {
        en: {
            // English translations
            "#settings": "Settings",
            "#blurryStart": "Blur media on load:",
            ".tooltiptext":
                "When enabled, all images and videos will be blurred by default until detection starts.",
            "#blurAmount": `
			Blur Amount:
			<span id="blur-amount-value">${safeSettings.blurAmount}%</span>
		`,
            "#grayscale": "Grayscale:",
            "#strictness": `Strictness:
		<span id="strictness-value">${safeSettings.strictness * 100}%</span>
		`,
            "#mediaToBlur": "Media to Blur",
            "#blurImages": "Images",
            "#blurVideos": "Videos",
            "#facesToBlur": "Faces to Blur",
            "#blurMale": "Male",
            "#blurFemale": "Female",
            "#unblurOnHover": "Unblur on hover",
            "#unblurImages": "Images",
            "#unblurVideos": "Videos",
            ".refresh": " (requires page refresh):",
            "#refresh-message": "Refresh the page to see the changes.",
            ".bmc-btn-text": "Support the project",
            ".feedback": `
			<span> We love to hear your feedback through our </span> <a href="https://github.com/Abs6187/ReelsPRO/issues/new/choose" target="_blank">Form</a> or 
			<a href="mailto:contact2abhaygupta@gmail.com" target="_blank">Email</a> ❤️
			`,
            "#whitelist-desc": `
				<p id="whitelist-desc"> Detection is 
				<span id="whitelist-status-on" class="blue-text"> On </span> 
				<span id="whitelist-status-off" class="red-text hidden" > Off </span> 
				for this website </p>
			`,
            "#detectionStatus": "Detection is On for {website}",
            "#detectionStatusOff": "Detection is Off for {website}",
            "#detectionStatusWhitelisted": "{website} is whitelisted",
        },
        hindi: {
            "#settings": "सेटिंग",
            "#blurryStart": "लोड होने पर मीडिया को बुलर करें:",
            ".tooltiptext": "जब इसको एक्टिव करते हैं, तब अभी तक सभी चित्र और वीडियो बॉर्डर रंग से बुलर होंगे।",
            "#blurAmount": `
			बुलर की मात्रा:
			<span id="blur-amount-value">${safeSettings.blurAmount}%</span>
		`,
            "#grayscale": "ग्रेसस्की:",
            "#strictness": `Strictness:
		<span id="strictness-value">${safeSettings.strictness * 100}%</span>
		`,
            "#mediaToBlur": "Media to Blur",
            "#blurImages": "Images",
            "#blurVideos": "Videos",
            "#facesToBlur": "Faces to Blur",
            "#blurMale": "Male",
            "#blurFemale": "Female",
            "#unblurOnHover": "Unblur on hover",
            "#unblurImages": "Images",
            "#unblurVideos": "Videos",
            ".refresh": " (requires page refresh):",
            "#refresh-message": "Refresh the page to see the changes.",
            ".bmc-btn-text": "Support the project",
            ".feedback": `
			<span> We love to hear your feedback through our </span> <a href="https://github.com/Abs6187/ReelsPRO/issues/new/choose" target="_blank">Form</a> or 
			<a href="mailto:contact2abhaygupta@gmail.com" target="_blank">Email</a> ❤️
			`,
            "#whitelist-desc": `
				<p id="whitelist-desc"> Detection is 
				<span id="whitelist-status-on" class="blue-text"> On </span> 
				<span id="whitelist-status-off" class="red-text hidden" > Off </span> 
				for this website </p>
			`,
            "#detectionStatus": "{website} के लिए पहचान चालू है",
            "#detectionStatusOff": "{website} के लिए पहचान बंद है",
            "#detectionStatusWhitelisted": "{website} व्हाइटलिस्ट में है",
        }
    };
};

const HB_TRANSLATIONS_DIR = {
    en: "ltr",
    hindi: "hi",
};
