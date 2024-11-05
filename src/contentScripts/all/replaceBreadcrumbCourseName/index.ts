import { isDebug } from "esbuild-plugin-debug-switch";

import { getPreferences } from "~/common/storage/preferences/index.ts";
import { getCourses } from "~/common/storage/courses/index.ts";
import { registerMutationObserverCallback } from "~/contentScripts/common/mutationObserverCallback.ts";

const replaceBreadcrumbCourseName = function (
  replacementMap: Map<string, string>,
) {
  const breadcrumb = document.querySelector("#page-header nav ol.breadcrumb");
  if (!breadcrumb) return;

  const links = Array.from(
    breadcrumb.querySelectorAll("li a"),
  ) as HTMLAnchorElement[];
  for (const link of links) {
    const content = link.textContent?.trim();
    if (!content) continue;

    link.textContent = replacementMap.get(content) ?? content;
  }
};

const main = async function () {
  const preferences = await getPreferences();
  if (!preferences.replaceBreadcrumbCourseName.enabled) return;

  if (isDebug) {
    console.log("ReplaveBreadcrumbCourseName is enabled.");
  }

  const courses = await getCourses();
  const replacementMap = new Map<string, string>();
  for (const course of courses) {
    if (!course.systemCourseName) continue;
    replacementMap.set(course.systemCourseName, course.name);
  }

  replaceBreadcrumbCourseName(replacementMap);
  registerMutationObserverCallback(
    () => {
      replaceBreadcrumbCourseName(replacementMap);
    },
    {
      rootElement: document.body,
      observerOptions: { childList: true, subtree: true },
    },
  );
};

main();
