import type { BuildConfig } from "bun";
import glob from "fast-glob";

const providerEntries = await glob("./src/providers/*.ts");
const entrypoints = ["./src/index.ts", ...providerEntries];

const defaultBuildConfig: BuildConfig = {
  entrypoints,
  outdir: "./dist",
  target: "node",
  // minify: true,
  sourcemap: "external",
  root: "src",
  external: ["@auth/core", "elysia"],
};

await Promise.all([
  Bun.build({
    ...defaultBuildConfig,
    format: "esm",
    naming: "[dir]/[name].js",
  }),
  Bun.build({
    ...defaultBuildConfig,
    format: "cjs",
    naming: "[dir]/[name].cjs",
  }),
]);
