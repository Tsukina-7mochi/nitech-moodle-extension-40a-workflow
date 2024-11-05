import * as preact from "preact";
import { isDebug } from "esbuild-plugin-debug-switch";

import { getPreferences } from "~/common/storage/preferences/index.ts";
import { registerMutationObserverCallback } from "~/contentScripts/common/mutationObserverCallback.ts";
import { Countdown } from "./components/countdown.tsx";

const CLASS_NAME = "ext40a-event-countdown";

const renderEventCountdowns = function () {
  const calendarRoot = document.querySelector(
    '*[data-block="calendar_upcoming"]',
  );
  if (!calendarRoot) return;

  const items = Array.from(
    calendarRoot.querySelectorAll(
      '*[data-region="event-item"] > *:nth-child(2)',
    ),
  );
  for (const item of items) {
    if (item.classList.contains(CLASS_NAME)) continue;
    item.classList.add(CLASS_NAME);

    const link = item.querySelector<HTMLAnchorElement>(".date a");
    if (!link) continue;

    // e.g., https://cms7.ict.nitech.ac.jp/moodle40a/calendar/view.php?view=day&time=1680940800
    const time = new URL(link.href).searchParams.get("time");
    if (!time) continue;

    const date = new Date(Number(time) * 1000);

    const root = document.createElement("div");
    root.className = `${CLASS_NAME} small`;

    item.appendChild(root);
    preact.render(
      preact.createElement(Countdown, { targetDate: date }),
      root,
    );
  }
};

const main = async function () {
  const preferences = await getPreferences();
  if (!preferences.dashboardEventsCountdown.enabled) return;

  if (isDebug) {
    console.log("EventCountdown is enabled.");
  }

  renderEventCountdowns();
  registerMutationObserverCallback(renderEventCountdowns, {
    rootElement: document.body,
    observerOptions: { childList: true, subtree: true },
  });
};

main();
