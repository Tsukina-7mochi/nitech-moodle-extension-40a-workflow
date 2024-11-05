import { useCallback, useEffect, useMemo, useState } from "preact/hooks";

import type { Preferences } from "~/common/model/preferences.ts";
import type { PreferencesAction } from "~/common/storage/preferences/action.ts";
import {
  getPreferences,
  reduceAndSavePreferences,
} from "~/common/storage/preferences/index.ts";

type Payload<T extends PreferencesAction["type"]> =
  (PreferencesAction & { type: T })["payload"];

export const usePreferences = function () {
  const [preferences, setPreferences] = useState<Preferences | null>(null);

  useEffect(() => {
    getPreferences().then(setPreferences);
  }, []);

  if (!preferences) return null;

  const createReduceCallback = function <T extends PreferencesAction["type"]>(
    type: T,
  ) {
    return async (payload: Payload<T>) => {
      const newPreferences = await reduceAndSavePreferences({ type, payload });
      setPreferences(newPreferences);
    };
  };

  const removeForceDownload = useMemo(
    () => preferences.removeForceDownload,
    [preferences],
  );
  const setRemoveForceDownload = useCallback(
    createReduceCallback("patchRemoveForceDownload"),
    [preferences],
  );

  const replaceBreadcrumbCourseName = useMemo(
    () => preferences.replaceBreadcrumbCourseName,
    [preferences],
  );
  const setReplaceBreadcrumbCourseName = useCallback(
    createReduceCallback("patchReplaceBreadcrumbCourseName"),
    [preferences],
  );

  const replaceNavigationCourseName = useMemo(
    () => preferences.replaceNavigationCourseName,
    [preferences],
  );
  const setReplaceNavigationCourseName = useCallback(
    createReduceCallback("patchReplaceNavigationCourseName"),
    [preferences],
  );

  const dashboardEventsCountdown = useMemo(
    () => preferences.dashboardEventsCountdown,
    [preferences],
  );
  const setDashboardEventsCountdown = useCallback(
    createReduceCallback("patchDashboardEventsCountdown"),
    [preferences],
  );

  const dashboardQuickCourseLinks = useMemo(
    () => preferences.dashboardQuickCourseLinks,
    [preferences],
  );
  const setDashboardQuickCourseLinks = useCallback(
    createReduceCallback("patchDashboardQuickCourseLinks"),
    [preferences],
  );

  const scormAutoCollapseToc = useMemo(
    () => preferences.scormAutoCollapseToc,
    [preferences],
  );
  const setScormAutoCollapseToc = useCallback(
    createReduceCallback("patchScormAutoCollapseToc"),
    [preferences],
  );

  const scormAutoPlay = useMemo(() => preferences.scormAutoPlay, [preferences]);
  const setScormAutoPlay = useCallback(
    createReduceCallback("patchScormAutoPlay"),
    [preferences],
  );

  const loginAutoSubmit = useMemo(() => preferences.loginAutoSubmit, [
    preferences,
  ]);
  const setLoginAutoSubmit = useCallback(
    createReduceCallback("patchLoginAutoSubmit"),
    [preferences],
  );

  return {
    removeForceDownload,
    setRemoveForceDownload,
    replaceBreadcrumbCourseName,
    setReplaceBreadcrumbCourseName,
    replaceNavigationCourseName,
    setReplaceNavigationCourseName,
    dashboardEventsCountdown,
    setDashboardEventsCountdown,
    dashboardQuickCourseLinks,
    setDashboardQuickCourseLinks,
    scormAutoCollapseToc,
    setScormAutoCollapseToc,
    scormAutoPlay,
    setScormAutoPlay,
    loginAutoSubmit,
    setLoginAutoSubmit,
  };
};
