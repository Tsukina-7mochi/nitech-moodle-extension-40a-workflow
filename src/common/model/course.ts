// deno-fmt-ignore
type Period =
  |  1 |  2 |  3 |  4 |  5 |  6 |  7 |  8 |  9 | 10
  | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
type Semester = 1 | 2 | 3 | 4;
type WeekOfDay = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

const identifierLikePattern =
  /^(?<seg1>(?<year>\d{4})|\w{2})(?<seg2>\w)(?<seg3>\w\d{3})$/;
const periodPattern = /(?<start>([1-9]|1\d|20))-(?<end>([1-9]|1\d|20))限/;

const weekOfDayIndex = (
  weekOfDay: NonNullable<WeekOfDay>,
): number => {
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(weekOfDay);
};

const findSemester = function (text: string): [Semester, Semester] | null {
  if (text.includes("前期")) {
    return [1, 2];
  } else if (text.includes("後期")) {
    return [3, 4];
  } else if (text.includes("第1クォーター")) {
    return [1, 1];
  } else if (text.includes("第2クォーター")) {
    return [2, 2];
  } else if (text.includes("第3クォーター")) {
    return [3, 3];
  } else if (text.includes("第4クォーター")) {
    return [4, 4];
  }

  return null;
};

const findWeekOfDay = function (text: string): WeekOfDay | null {
  if (text.includes("日曜")) {
    return "sun";
  } else if (text.includes("月曜")) {
    return "mon";
  } else if (text.includes("火曜")) {
    return "tue";
  } else if (text.includes("水曜")) {
    return "wed";
  } else if (text.includes("木曜")) {
    return "thu";
  } else if (text.includes("金曜")) {
    return "fri";
  } else if (text.includes("土曜")) {
    return "sat";
  }

  return null;
};

export type CourseJson = {
  id: string;
  /** course name */
  name: string;
  /** course name in moodle */
  fullName: string;
  /** course name in moodle */
  systemCourseName?: string;
  /** the year the course is offered */
  fullYear?: number;
  /** the semester the course is offered */
  semester?: [Semester, Semester];
  /** the semester the course is offered */
  weekOfDay?: WeekOfDay;
  /** the period in timetable the course is offered */
  period?: [Period, Period];
};

/**
 * Courses that are registered in moodle that are being offered
 * or have been offered in the past
 */
export class Course {
  id: string;
  /** course name */
  name: string;
  /** course name displayed in moodle */
  fullName: string;
  /** course name in moodle */
  systemCourseName?: string;
  /** the year the course is offered */
  fullYear?: number;
  /** the semester the course is offered */
  semester?: [Semester, Semester];
  /** the day of the week the course is offered */
  weekOfDay?: WeekOfDay;
  /** the period in timetable the course is offered */
  period?: [Period, Period];

  constructor(init: CourseJson) {
    this.id = init.id;
    this.name = init.name;
    this.fullName = init.fullName;
    this.systemCourseName = init.systemCourseName;
    this.fullYear = init.fullYear;
    this.semester = init.semester;
    this.weekOfDay = init.weekOfDay;
    this.period = init.period;
  }

  static parse(text: string): Omit<CourseJson, "id"> {
    const cleanText = text.trim().replace(/\s+/g, " ");
    const segments = cleanText.split(" ");
    const normalizedText = cleanText.normalize("NFKC").toLowerCase();

    const name = (() => {
      // string "コース名" may be embedded for screen reader
      const nameIndex = segments.indexOf("コース名");
      if (nameIndex > 0 && nameIndex + 1 < segments.length) {
        return segments.slice(nameIndex + 1).join(" ");
      }
      return cleanText;
    })();
    const fullName = cleanText;

    let systemCourseName: string | undefined = undefined;
    let fullYear: number | undefined = undefined;
    for (const segment of segments) {
      const match = segment.match(identifierLikePattern);
      if (match === null) continue;

      const year = match.groups?.year;
      const seg1 = match.groups?.seg1;
      const seg2 = match.groups?.seg2;
      const seg3 = match.groups?.seg3;

      if (year) {
        fullYear = parseInt(year);
      }
      if (seg1 && seg2 && seg3) {
        systemCourseName = `${seg1.slice(-2)}-${seg2}-${seg3}`;
      }
    }

    const semester = findSemester(normalizedText) ?? undefined;

    const weekOfDay = findWeekOfDay(normalizedText) ?? undefined;
    const periodMatch = normalizedText.match(periodPattern);
    let period: [Period, Period] | undefined = undefined;
    if (periodMatch) {
      const start = periodMatch.groups?.start;
      const end = periodMatch.groups?.end;
      if (start && end) {
        period = [parseInt(start), parseInt(end)] as [Period, Period];
      }
    }

    return {
      name,
      fullName,
      systemCourseName,
      fullYear,
      semester,
      weekOfDay,
      period,
    };
  }

  static fromJson(json: CourseJson): Course {
    return new Course(json);
  }

  toJson(): CourseJson {
    return {
      id: this.id,
      name: this.name,
      fullName: this.fullName,
      systemCourseName: this.systemCourseName,
      fullYear: this.fullYear,
      semester: this.semester,
      weekOfDay: this.weekOfDay,
      period: this.period,
    };
  }

  // TODO: accept sort options
  compare(that: Course): number {
    if (this.fullYear && that.fullYear) {
      if (this.fullYear !== that.fullYear) {
        return this.fullYear - that.fullYear;
      }
    } else if (this.fullYear) {
      return -1;
    } else if (that.fullYear) {
      return 1;
    }

    if (this.semester && that.semester) {
      if (this.semester[0] !== that.semester[0]) {
        return this.semester[0] - that.semester[0];
      }
    } else if (this.semester?.[0]) {
      return -1;
    } else if (that.semester?.[0]) {
      return 1;
    }

    if (this.weekOfDay && that.weekOfDay) {
      const thisWeekOfDay = weekOfDayIndex(this.weekOfDay);
      const thatWeekOfDay = weekOfDayIndex(that.weekOfDay);
      if (thisWeekOfDay !== thatWeekOfDay) {
        return thisWeekOfDay - thatWeekOfDay;
      }
    } else if (this.weekOfDay) {
      return -1;
    } else if (that.weekOfDay) {
      return 1;
    }

    if (this.period && that.period) {
      if (this.period[0] !== that.period[0]) {
        return this.period[0] - that.period[0];
      }
    } else if (this.period) {
      return -1;
    } else if (that.period) {
      return 1;
    }

    if (this.name < that.name) {
      return -1;
    } else if (this.name > that.name) {
      return 1;
    }

    return 0;
  }
}
