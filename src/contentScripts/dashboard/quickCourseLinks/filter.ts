import type { Course } from "~/common/model/course.ts";

export class Filter {
  year?: number;
  // matches to course when any semester is included
  semesters?: number[];
  label: string;

  constructor(
    label: string,
    year?: number,
    semesters?: number[],
  ) {
    this.year = year;
    this.semesters = semesters;
    this.label = label;
  }

  test(course: Course): boolean {
    // match any courses if no year is specified
    if (!this.year) return true;
    if (course.fullYear !== this.year) return false;

    // match any semester if no semester is specified
    if (!this.semesters) return true;
    return this.semesters.some((s) => {
      if (!course.semester) return false;
      return course.semester[0] <= s && s <= course.semester[1];
    });
  }
}

export const filtersMatchesToCourses = function (courses: Course[]): Filter[] {
  let years = courses
    .map((course) => course.fullYear)
    .filter((v) => v !== undefined);
  years = Array.from(new Set(years));
  years.sort().reverse();

  return years.flatMap((year) => [
    new Filter(`${year}年`, year),
    new Filter(`${year}年 第1クォーター`, year, [1]),
    new Filter(`${year}年 第2クォーター`, year, [2]),
    new Filter(`${year}年 第3クォーター`, year, [3]),
    new Filter(`${year}年 第4クォーター`, year, [4]),
    new Filter(`${year}年 前期`, year, [1, 2]),
    new Filter(`${year}年 後期`, year, [3, 4]),
  ]).filter((filter) => courses.some((course) => filter.test(course)));
};

export const pickFilterByDate = function (
  filters: Filter[],
  date: Date = new Date(),
): Filter | null {
  const year = date.getFullYear();
  const semester = (() => {
    // deno-fmt-ignore
    switch (date.getMonth()) {
      case 0: return 4;
      case 1: return 4;
      case 2: return 4;
      case 3: return 1;
      case 4: return 1;
      case 5: return 2;
      case 6: return 2;
      case 7: return 2;
      case 8: return 2;
      case 9: return 3;
      case 10: return 3;
      case 11: return 4;
      default: return -1;
    }
  })();
  const filter = filters.find((filter) => {
    return filter.year === year && filter.semesters?.includes(semester);
  });

  return filter ?? null;
};
