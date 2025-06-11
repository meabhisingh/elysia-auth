import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import glob from "fast-glob";

const providerEntries = await glob("src/providers/*.ts");

export default {
  input: ["src/index.ts", ...providerEntries],
  output: {
    dir: "dist",
    format: "es",
    name: "@auth/elysia",
    preserveModules: true,
    preserveModulesRoot: "src",
    sourcemap: true,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    terser(), // minifies your JS output
  ],
  external: (id) =>
    id.startsWith("@auth/") || // ✅ Matches @auth/core, @auth/other...
    id.startsWith("@panva/") || // ✅ Matches @panva/jose
    [
      "elysia",
      "@elysiajs/bearer",
      "jose",
      "jsonwebtoken",
      "cookie",
      "@simplewebauthn/server",
      "nodemailer",
    ].includes(id),
};
