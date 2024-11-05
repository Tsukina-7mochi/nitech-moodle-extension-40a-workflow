import * as preact from "preact";
import { isDebug } from "esbuild-plugin-debug-switch";

import { getPreferences } from "~/common/storage/preferences/index.ts";
import { registerMutationObserverCallback } from "~/contentScripts/common/mutationObserverCallback.ts";
import { QuickCourseLinks } from "./components/quickCourseLinks.tsx";

const CARD_DATA_BLOCK = "ext40a-quick-course-links";

const renderQuickCourseLinks = function () {
  const blocksRoot = document.getElementById("block-region-content");
  if (!blocksRoot) return;

  // do not use `blocksRoot` as root of preact element, preact will delete
  // the first child node.
  if (document.querySelector(`*[data-block=${CARD_DATA_BLOCK}`)) return;
  const root = document.createElement("section");
  root.dataset["block"] = CARD_DATA_BLOCK;
  root.className = "block card mb-3";

  blocksRoot.insertBefore(root, blocksRoot.childNodes[0] ?? null);

  preact.render(
    preact.createElement(QuickCourseLinks, null),
    root,
  );
};

const main = async function () {
  const preferences = await getPreferences();
  if (!preferences.dashboardQuickCourseLinks.enabled) return;

  if (isDebug) {
    console.log("QuickCourseLinks is enabled.");
  }

  renderQuickCourseLinks();
  registerMutationObserverCallback(renderQuickCourseLinks, {
    rootElement: document.body,
    observerOptions: { childList: true, subtree: true },
  });
};

main();
