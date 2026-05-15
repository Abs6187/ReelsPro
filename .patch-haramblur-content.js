const fs = require("fs");
const path = "../HaramBlur/src/content.js";
let s = fs.readFileSync(path, "utf8");

const oldBlockCRLF =
  "if (window.self === window.top) {\r\n" +
  "    attachAllListeners();\r\n" +
  "    initMutationObserver();\r\n" +
  "    Settings.init()\r\n" +
  "        .then((settings) => {\r\n" +
  "            if (\r\n" +
  "                settings\r\n" +
  "                    .getWhitelist()\r\n" +
  "                    .includes(\r\n" +
  "                        window.location.hostname?.split(\"www.\")?.[1] ??\r\n" +
  "                            window.location.hostname\r\n" +
  "                    )\r\n" +
  "            ) {\r\n" +
  "                console.log(\"HB==WHITELISTED SITE\");\r\n" +
  "                killObserver();\r\n" +
  "                return;\r\n" +
  "            }\r\n" +
  "\r\n" +
  "            // turn on/off the extension\r\n" +
  "            settings.toggleOnOffStatus();\r\n" +
  "        })\r\n" +
  "        .catch((e) => {\r\n" +
  "            console.log(\"HB==INITIALIZATION ERROR\", e);\r\n" +
  "        });\r\n" +
  "}";

const newBlockCRLF =
  "if (window.self === window.top) {\r\n" +
  "    attachAllListeners();\r\n" +
  "    // NOTE: initMutationObserver() intentionally NOT called here.\r\n" +
  "    // Starting the observer at document_start (before the whitelist check)\r\n" +
  "    // causes Next.js / React hydration mismatches on whitelisted dev\r\n" +
  "    // servers because the observer adds `data-HBstatus` attributes (and\r\n" +
  "    // potentially `hb-blur-temp` classes) to DOM nodes during hydration.\r\n" +
  "    // The observer is started lazily by the `settingsLoaded` listener in\r\n" +
  "    // observers.js, which Settings.init() only emits for non-whitelisted\r\n" +
  "    // sites (see src/modules/settings.js).\r\n" +
  "    Settings.init()\r\n" +
  "        .then((settings) => {\r\n" +
  "            if (settings.isWhitelisted()) {\r\n" +
  "                console.log(\"HB==WHITELISTED SITE\");\r\n" +
  "                // Belt-and-braces: make sure nothing is observing.\r\n" +
  "                killObserver();\r\n" +
  "                return;\r\n" +
  "            }\r\n" +
  "\r\n" +
  "            // turn on/off the extension\r\n" +
  "            settings.toggleOnOffStatus();\r\n" +
  "        })\r\n" +
  "        .catch((e) => {\r\n" +
  "            console.log(\"HB==INITIALIZATION ERROR\", e);\r\n" +
  "        });\r\n" +
  "}";

if (s.includes(oldBlockCRLF)) {
  s = s.replace(oldBlockCRLF, newBlockCRLF);
} else {
  const oldBlockLF = oldBlockCRLF.replace(/\r\n/g, "\n");
  const newBlockLF = newBlockCRLF.replace(/\r\n/g, "\n");
  if (!s.includes(oldBlockLF)) throw new Error("content.js: anchor not found");
  s = s.replace(oldBlockLF, newBlockLF);
}

fs.writeFileSync(path, s);
console.log("content.js patched OK");
