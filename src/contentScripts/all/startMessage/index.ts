// Show message when the extension is loaded.

import { env, isDebug } from "esbuild-plugin-debug-switch";

console.log(`${env.extensionName} ${env.extensionVersion} is loaded.`);
if (isDebug) {
  console.log("Debug mode is enabled.");
}
