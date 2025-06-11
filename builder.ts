import type { BuildConfig } from "bun";
// import dts from "bun-plugin-dts";
import glob from "fast-glob";

const providerEntries = await glob("./src/providers/*.ts");
const entrypoints = ["./src/index.ts", ...providerEntries];

const defaultBuildConfig: BuildConfig = {
  entrypoints,
  outdir: "./dist",
  target: "bun",
  format: "esm",
  minify: true,
  sourcemap: "external",
  naming: "[dir]/[name].js",
  root: "src",
  external: ["@auth/core", "elysia"],
};

await Bun.build(defaultBuildConfig);
