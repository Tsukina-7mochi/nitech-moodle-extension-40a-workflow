import type { CourseJson } from "~/common/model/course.ts";
import type { CoursesAction } from "./actions.ts";

export const coursesReducer = function (
  courses: CourseJson[],
  action: CoursesAction,
): CourseJson[] {
  const { payload } = action;

  if (action.type === "saveCourses") {
    return payload.courses;
  } else if (action.type === "mergeAndSaveCourses") {
    const idCourseMap = new Map<CourseJson["id"], CourseJson>();

    for (const course of courses) {
      idCourseMap.set(course.id, course);
    }
    for (const course of payload.courses) {
      idCourseMap.set(course.id, course);
    }

    return [...idCourseMap.values()];
  }

  const _: never = action;
  throw Error(`Unknown action type: ${(action as CoursesAction).type}`);
};
