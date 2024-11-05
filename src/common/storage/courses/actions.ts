import type { CourseJson } from "~/common/model/course.ts";

export type SaveCoursesAction = {
  type: "saveCourses";
  payload: {
    courses: CourseJson[];
  };
};

export type MergeAndSaveCoursesAction = {
  type: "mergeAndSaveCourses";
  payload: {
    courses: CourseJson[];
  };
};

export type CoursesAction =
  | SaveCoursesAction
  | MergeAndSaveCoursesAction;
