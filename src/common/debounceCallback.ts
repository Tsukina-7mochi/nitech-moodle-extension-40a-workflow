export type Callback<Args extends unknown[]> = (...args: Args) => void;

export const debounceCallback = function <
  Args extends unknown[],
  ThisType = unknown,
>(
  callback: Callback<Args>,
  timeout: number,
): Callback<Args> {
  let timer: number | undefined = undefined;
  return function (this: ThisType, ...args: Args) {
    clearTimeout(timer);
    timer = setTimeout(() => callback.apply(this, args), timeout);
  };
};
