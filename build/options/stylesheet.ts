import * as esbuild from "esbuild";
import { sassPlugin } from "esbuild-plugin-sass";

type BuildOptionsOptions = {
  entryPoints: esbuild.BuildOptions["entryPoints"];
  srcPath: string;
  destPath: string;
  dev: boolean;
};

export const buildOptions = (
  options: BuildOptionsOptions,
): esbuild.BuildOptions => ({
  entryPoints: options.entryPoints,
  outdir: options.destPath,
  platform: "browser",
  bundle: true,
  sourcemap: options.dev ? "linked" : false,
  minify: !options.dev,
  plugins: [
    sassPlugin(),
  ],
});
