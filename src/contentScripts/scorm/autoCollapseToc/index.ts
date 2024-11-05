import { isDebug } from "esbuild-plugin-debug-switch";

import { getPreferences } from "~/common/storage/preferences/index.ts";
import { registerMutationObserverCallback } from "~/contentScripts/common/mutationObserverCallback.ts";

const collapseToc = function () {
  const toc = document.getElementById("scorm_toc");
  const toggleCollapseButton = document.getElementById("scorm_toc_toggle_btn");
  if (!toc || !toggleCollapseButton) return;

  if (toc.classList.contains("disabled")) return;

  // do not toggle toggle class .disabled directly becausemoodle handles other
  // elements at the same time when the button is pressed
  toggleCollapseButton.click();

  return true;
};

const main = async function () {
  const preferences = await getPreferences();
  if (!preferences.scormAutoCollapseToc.enabled) return;

  if (isDebug) {
    console.log("CollapseToc is enabled.");
  }

  collapseToc();
  registerMutationObserverCallback(collapseToc, {
    rootElement: document.body,
    observerOptions: { childList: true, subtree: true },
  });
};

main();
