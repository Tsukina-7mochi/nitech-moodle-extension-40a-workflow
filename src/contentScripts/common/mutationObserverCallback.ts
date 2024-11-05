import { debounceCallback } from "~/common/debounceCallback.ts";

export type RegisterMutationObserverCallbackOptions = {
  rootElement: HTMLElement;
  observerOptions: MutationObserverInit;
  debounceTimeout?: number;
};

/**
 * Registers a mutation observer with a specified callback function that
 * triggers when observed mutations occur. The callback function can return
 * `true` to automatically disconnect the observer after being called.
 * Debounces the callback execution with a specified timeout to prevent frequent calls.
 */
export const registerMutationObserverCallback = function (
  callback: (...args: Parameters<MutationCallback>) => boolean | void,
  options: RegisterMutationObserverCallbackOptions,
) {
  const debounceTimeout = options?.debounceTimeout ?? 500;

  const observer = new MutationObserver(
    debounceCallback((...args) => {
      if (callback(...args)) observer.disconnect();
    }, debounceTimeout),
  );
  observer.observe(options.rootElement, options.observerOptions);
};
