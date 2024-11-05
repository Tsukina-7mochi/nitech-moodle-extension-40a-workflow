import { isDebug } from "esbuild-plugin-debug-switch";

import { getPreferences } from "~/common/storage/preferences/index.ts";
import { registerMutationObserverCallback } from "~/contentScripts/common/mutationObserverCallback.ts";

const parseUrl = function (url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

const removeForceDownload = () => {
  if (isDebug) {
    console.log("Removing forcedownload");
  }

  document.querySelectorAll("a").forEach((link) => {
    const url = parseUrl(link.href);
    if (url === null) return;

    link.href = forceDownloadRemoved(url).toString();
  });
};

const forceDownloadRemoved = function (url: URL): URL {
  const removed = new URL(url);
  removed.searchParams.delete("forcedownload", "1");

  return removed;
};

const main = async () => {
  const preferences = await getPreferences();
  if (!preferences.removeForceDownload.enabled) return;

  if (isDebug) {
    console.log("RemoveForceDownload is enabled.");
  }

  removeForceDownload();
  registerMutationObserverCallback(
    removeForceDownload,
    {
      rootElement: document.body,
      observerOptions: { childList: true, subtree: true },
    },
  );
};

main();
