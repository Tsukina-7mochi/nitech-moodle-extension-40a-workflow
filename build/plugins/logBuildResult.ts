import type * as esbuild from "esbuild";

const printLog = function (
  numErrors: number,
  numWarnings: number,
  startTime: Date,
  endTime: Date,
) {
  const buildTime = endTime.getTime() - startTime.getTime();

  let message = `${endTime.toLocaleTimeString("en-GB")}: `;
  if (numErrors > 0 && numWarnings > 0) {
    message +=
      `Build failed with ${numErrors} errors and ${numWarnings} warnings`;
  } else if (numErrors > 0) {
    message += `Build failed with ${numErrors} errors`;
  } else if (numWarnings > 0) {
    message += `Build failed with ${numWarnings} warnings`;
  } else {
    message += `Build succeeded`;
  }

  message += ` in ${buildTime} ms`;
};

export const logBuildResultPlugin = (): esbuild.Plugin => ({
  name: "log-and-output-filename",
  setup(build) {
    // assign to avoid type error
    let startTime = new Date();

    build.onStart(() => {
      startTime = new Date();
    });

    build.onEnd((result) => {
      const numErrors = result.errors.length;
      const numWarnings = result.warnings.length;
      const endTime = new Date();

      printLog(numErrors, numWarnings, startTime, endTime);
    });
  },
});
