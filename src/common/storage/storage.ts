// @deno-types="@types/webextension-polyfill"
import browser from "webextension-polyfill";

import type { CourseJson } from "~/common/model/course.ts";
import type { Preferences } from "~/common/model/preferences.ts";

type Subtract<T, U> = T extends U ? never : T;

type StorageSchema = {
  courses: CourseJson[];
  preferences: Preferences;
  version: number;
};
type StorageKey = Subtract<keyof StorageSchema, "version">;

type StorageAreaName = "local" | "sync" | "managed" | "session";

const storageGet = async function <K extends StorageKey>(
  key: K,
  storageArea: StorageAreaName,
): Promise<StorageSchema[K]> {
  const data = await browser.storage[storageArea].get(key);
  return data[key] as StorageSchema[K];
};

const storageSet = async function <K extends StorageKey>(
  key: K,
  value: StorageSchema[K],
  storageArea: StorageAreaName,
): Promise<void> {
  await browser.storage[storageArea].set({ [key]: value, version: 1 });
};

export { storageGet as get, storageSet as set };
