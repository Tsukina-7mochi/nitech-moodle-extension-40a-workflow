import { useRemainingTime } from "../hooks/useRemainingTime.ts";

const createTimeText = function (seconds: number): string {
  if (seconds < 60) {
    return `${seconds}秒`;
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}分`;
  } else if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}時間`;
  } else {
    return `${Math.floor(seconds / 86400)}日`;
  }
};

export type CountdownProps = {
  targetDate: Date;
};

export const Countdown = function (props: CountdownProps) {
  const remainingTime = useRemainingTime(props.targetDate);

  const expired = remainingTime < 0;
  const timeText = createTimeText(Math.floor(Math.abs(remainingTime / 1000)));

  const decorationClass = expired
    ? "text-muted"
    : (remainingTime < 86_400_000 ? "red" : "");

  return (
    <div>
      <div className={`date small ${decorationClass}`}>
        {expired ? `${timeText}前` : `あと${timeText}`}
      </div>
    </div>
  );
};
