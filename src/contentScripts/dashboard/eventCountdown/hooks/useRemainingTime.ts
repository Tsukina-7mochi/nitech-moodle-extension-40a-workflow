import { useCallback, useEffect, useState } from "preact/hooks";

const calculateUpdateTimeout = function (milliseconds: number): number {
  const seconds = milliseconds / 1_000;
  if (seconds < 60) {
    return 1_000 - (milliseconds % 1_000);
  } else if (seconds < 3_600) {
    return 60_000 - (milliseconds % 60_000);
  } else if (seconds < 86_400) {
    return 3_600_000 - (milliseconds % 3_600_000);
  } else {
    return 86_400_000 - (milliseconds % 86_400_000);
  }
};

export const useRemainingTime = function (targetDate: Date) {
  const [remainingTime, setRemainingTime] = useState(0);

  const updateRemainingTime = useCallback(() => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    setRemainingTime(diff);
  }, [targetDate]);

  useEffect(updateRemainingTime, [targetDate]);

  useEffect(() => {
    const delay = calculateUpdateTimeout(Math.abs(remainingTime));
    const timeoutId = setTimeout(updateRemainingTime, delay);

    return () => clearTimeout(timeoutId);
  }, [remainingTime]);

  return remainingTime;
};
