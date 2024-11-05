import type { Preferences } from "~/common/model/preferences.ts";
import type { PreferencesAction } from "./action.ts";

export const preferencesReducer = function (
  preferences: Preferences,
  action: PreferencesAction,
): Preferences {
  const { payload } = action;

  if (action.type === "patchRemoveForceDownload") {
    return {
      ...preferences,
      removeForceDownload: {
        ...preferences.removeForceDownload,
        ...payload,
      },
    };
  } else if (action.type === "patchReplaceBreadcrumbCourseName") {
    return {
      ...preferences,
      replaceBreadcrumbCourseName: {
        ...preferences.replaceBreadcrumbCourseName,
        ...payload,
      },
    };
  } else if (action.type === "patchReplaceNavigationCourseName") {
    return {
      ...preferences,
      replaceNavigationCourseName: {
        ...preferences.replaceNavigationCourseName,
        ...payload,
      },
    };
  } else if (action.type === "patchDashboardEventsCountdown") {
    return {
      ...preferences,
      dashboardEventsCountdown: {
        ...preferences.dashboardEventsCountdown,
        ...payload,
      },
    };
  } else if (action.type === "patchDashboardQuickCourseLinks") {
    return {
      ...preferences,
      dashboardQuickCourseLinks: {
        ...preferences.dashboardQuickCourseLinks,
        ...payload,
      },
    };
  } else if (action.type === "patchScormAutoCollapseToc") {
    return {
      ...preferences,
      scormAutoCollapseToc: {
        ...preferences.scormAutoCollapseToc,
        ...payload,
      },
    };
  } else if (action.type === "patchScormAutoPlay") {
    return {
      ...preferences,
      scormAutoPlay: {
        ...preferences.scormAutoPlay,
        ...payload,
      },
    };
  } else if (action.type === "patchLoginAutoSubmit") {
    return {
      ...preferences,
      loginAutoSubmit: {
        ...preferences.loginAutoSubmit,
        ...payload,
      },
    };
  }

  const _: never = action;
  throw Error(`Unknown action type: ${(action as PreferencesAction).type}`);
};
