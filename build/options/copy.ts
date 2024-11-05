import * as esbuild from "esbuild";

type BuildOptionsOptions = {
  entryPoints: esbuild.BuildOptions["entryPoints"];
  srcPath: string;
  destPath: string;
  loaderExts: string[];
};

export const buildOptions = (
  options: BuildOptionsOptions,
): esbuild.BuildOptions => ({
  entryPoints: options.entryPoints,
  outdir: options.destPath,
  loader: Object.fromEntries(
    options.loaderExts.map((ext) => [ext, "copy" as const]),
  ),
});
