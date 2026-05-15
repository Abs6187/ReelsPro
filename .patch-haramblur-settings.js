const fs = require("fs");
const path = "../HaramBlur/src/modules/settings.js";
let s = fs.readFileSync(path, "utf8");

const oldA =
  "    getWhitelist() {\r\n" +
  "        return this._settings.whitelist;\r\n" +
  "    }\r\n" +
  "\r\n" +
  "    getSettings() {";

const newA =
  "    getWhitelist() {\r\n" +
  "        return this._settings.whitelist;\r\n" +
  "    }\r\n" +
  "\r\n" +
  "    /**\r\n" +
  "     * Returns true if the given hostname is in the user's whitelist.\r\n" +
  "     * Handles the `www.` prefix consistently with the rest of the extension.\r\n" +
  "     */\r\n" +
  "    isWhitelisted(hostname = window.location.hostname) {\r\n" +
  "        const normalized = hostname?.split(\"www.\")?.[1] ?? hostname;\r\n" +
  "        return !!this._settings.whitelist?.includes(normalized);\r\n" +
  "    }\r\n" +
  "\r\n" +
  "    getSettings() {";

if (!s.includes(oldA)) {
  // Try LF in case the file uses unix line endings
  const oldALF = oldA.replace(/\r\n/g, "\n");
  const newALF = newA.replace(/\r\n/g, "\n");
  if (!s.includes(oldALF)) throw new Error("patch A: anchor not found");
  s = s.replace(oldALF, newALF);
} else {
  s = s.replace(oldA, newA);
}

const oldB =
  "        const settings = new Settings(loadedSettings);\r\n" +
  "        settings.listenForChanges();\r\n" +
  "        emitEvent(\"settingsLoaded\", settings);\r\n" +
  "        return settings;";

const newB =
  "        const settings = new Settings(loadedSettings);\r\n" +
  "        settings.listenForChanges();\r\n" +
  "        // Do NOT emit `settingsLoaded` on whitelisted sites. That event\r\n" +
  "        // triggers stylesheet injection (style.js) and starts the\r\n" +
  "        // MutationObserver (observers.js). Firing it at document_start\r\n" +
  "        // before the whitelist check causes Next.js / React hydration\r\n" +
  "        // mismatches on whitelisted dev servers (e.g. localhost).\r\n" +
  "        if (!settings.isWhitelisted()) {\r\n" +
  "            emitEvent(\"settingsLoaded\", settings);\r\n" +
  "        }\r\n" +
  "        return settings;";

if (!s.includes(oldB)) {
  const oldBLF = oldB.replace(/\r\n/g, "\n");
  const newBLF = newB.replace(/\r\n/g, "\n");
  if (!s.includes(oldBLF)) throw new Error("patch B: anchor not found");
  s = s.replace(oldBLF, newBLF);
} else {
  s = s.replace(oldB, newB);
}

fs.writeFileSync(path, s);
console.log("settings.js patched OK");
