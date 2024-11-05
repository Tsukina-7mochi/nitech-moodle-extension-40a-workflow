import { isDebug } from "esbuild-plugin-debug-switch";

import { Course } from "~/common/model/course.ts";
import { reduceAndSaveCourses } from "~/common/storage/courses/index.ts";
import { registerMutationObserverCallback } from "~/contentScripts/common/mutationObserverCallback.ts";

const readAndStoreCoureses = function () {
  if (isDebug) {
    console.log("Reading courses");
  }

  const myOverview = document.querySelector('*[data-block="myoverview"]');
  if (!myOverview) return;

  const pagenationDropdownItem = myOverview.querySelector<HTMLElement>([
    '*[data-region="courses-view"]',
    '*[data-region="paging-control-limit-container"]',
    'a[data-limit="0"]',
  ].join(" "));
  if (!pagenationDropdownItem) return;
  if (pagenationDropdownItem.getAttribute("aria-current") !== "true") {
    pagenationDropdownItem.click();
    return;
  }

  const links = Array.from(myOverview.querySelectorAll(
    '*[data-region="courses-view"] ul a.coursename',
  )) as HTMLAnchorElement[];
  const coursesJson = links.map((link) => {
    try {
      const id = new URL(link.href).searchParams.get("id");
      if (!id) return null;

      return Course.fromJson({
        id,
        ...Course.parse(link.textContent || ""),
      }).toJson();
    } catch {
      return null;
    }
  }).filter((course) => course !== null);

  const actionType = location.pathname === "/moodle40a/my/courses.php"
    ? "saveCourses"
    : "mergeAndSaveCourses";
  reduceAndSaveCourses({
    type: actionType,
    payload: {
      courses: coursesJson,
    },
  });

  return true;
};

const main = function () {
  if (isDebug) {
    console.log("Running ReadAndStoreCoureses");
  }

  readAndStoreCoureses();
  registerMutationObserverCallback(
    readAndStoreCoureses,
    {
      rootElement: document.body,
      observerOptions: { childList: true, subtree: true },
    },
  );
};

main();
