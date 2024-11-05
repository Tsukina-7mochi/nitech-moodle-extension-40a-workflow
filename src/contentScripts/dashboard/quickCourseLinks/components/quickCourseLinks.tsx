import { useEffect, useMemo, useState } from "preact/compat";

import { useCourses } from "../hooks/useCourses.ts";
import { useFilter } from "../hooks/useFilters.ts";
import { ListItem } from "./liteItem.tsx";
import { pickFilterByDate } from "../filter.ts";
import { FilterDropdown } from "./filterDropdown.tsx";

export const QuickCourseLinks = function () {
  const [filterInitialized, setFilterInitialized] = useState(false);
  const courses = useCourses();
  const { filter, setFilter, options: filterOptions } = useFilter(
    courses ?? [],
  );

  useEffect(() => {
    if (!courses) return;
    if (filterInitialized) return;

    setFilter(pickFilterByDate(filterOptions) ?? filter);
    setFilterInitialized(true);
  }, [
    courses,
    filter,
    filterOptions,
    filterInitialized,
  ]);

  const filteredCourses = useMemo(() => {
    const sorted = (courses ?? []).toSorted((a, b) => a.compare(b));

    if (!filter) return sorted;
    return sorted.filter((course) => filter.test(course));
  }, [courses, filter]);

  return (
    <>
      <div className="card-body p-3">
        <h5 className="card-title d-inline">コースリンク</h5>
        <div className="card-text content mt-3">
          <div className="block-cards" role="navigation">
            <hr className="mt-0" />
            <FilterDropdown
              filter={filter}
              options={filterOptions}
              setFilter={setFilter}
            />
            <div className="container-fluid p-0">
              <div
                data-region="courses-view"
                data-display="list"
                data-grouping="all"
                data-customfieldname
                data-customfieldvalue
              >
                <div data-region="paged-content-container">
                  <div
                    data-region="page-container"
                    className="paged-content-page-container"
                    aria-live="polite"
                  >
                    <div data-region="paged-content-page" data-page="1">
                      {filteredCourses.map((course) => (
                        <ListItem
                          key={course.id}
                          id={course.id}
                          name={course.name}
                          weekOfDay={course.weekOfDay}
                          period={course.period}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
