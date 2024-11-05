import { useMemo, useState } from "preact/hooks";

import { Filter } from "../filter.ts";
import { filtersMatchesToCourses } from "../filter.ts";
import type { Course } from "~/common/model/course.ts";

export const useFilter = function (courses: Course[]) {
  const defaultFilter = useMemo(() => (new Filter("すべて")), []);
  const options = useMemo<Filter[]>(() => {
    const filters = filtersMatchesToCourses(courses);
    return [...filters, defaultFilter];
  }, [courses]);
  const [filter, setFilter] = useState<Filter>(defaultFilter);

  return { filter, setFilter, options };
};
