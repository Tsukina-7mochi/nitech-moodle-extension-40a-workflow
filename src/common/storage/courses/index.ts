import * as storage from "../storage.ts";
import type { CourseJson } from "~/common/model/course.ts";
import { coursesReducer } from "./reducer.ts";
import type { CoursesAction } from "./actions.ts";
import { Course } from "~/common/model/course.ts";

const storageArea = "local";

const initialCourses: CourseJson[] = [];
let cachedCourses: CourseJson[] | null = null;

export const getCoursesJson = async function (): Promise<CourseJson[]> {
  if (cachedCourses !== null) {
    return cachedCourses;
  }

  const courses = await storage.get("courses", storageArea);
  cachedCourses = courses ?? initialCourses;

  return cachedCourses;
};

export const getCourses = async function (): Promise<Course[]> {
  return (await getCoursesJson()).map(Course.fromJson);
};

export const reduceAndSaveCourses = async function (
  action: CoursesAction,
): Promise<void> {
  cachedCourses = coursesReducer(await getCoursesJson(), action);
  return storage.set(
    "courses",
    cachedCourses,
    storageArea,
  );
};
