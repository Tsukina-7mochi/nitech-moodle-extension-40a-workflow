import type { Course } from "~/common/model/course.ts";

export type ListItemProps = Pick<
  Course,
  "id" | "name" | "weekOfDay" | "period"
>;

const weekOfDayName: Record<NonNullable<Course["weekOfDay"]>, string> = {
  sun: "日曜",
  mon: "月曜",
  tue: "火曜",
  wed: "水曜",
  thu: "木曜",
  fri: "金曜",
  sat: "土曜",
};

const coursePageUrl = (id: string) =>
  `https://cms7.ict.nitech.ac.jp/moodle40a/course/view.php?id=${id}`;

export const ListItem = function (
  props: ListItemProps,
) {
  const { id, name, weekOfDay, period } = props;

  return (
    <li className="list-group-item course-listitem border-left-0 border-right-0 border-top-0 px-2 rounded-0">
      <a href={coursePageUrl(id)}>
        {weekOfDay
          ? <span className="mr-1">{weekOfDayName[weekOfDay]}</span>
          : null}
        {period
          ? <span className="mr-1">{period[0]}-{period[1]}限</span>
          : null}
        {name}
      </a>
    </li>
  );
};
