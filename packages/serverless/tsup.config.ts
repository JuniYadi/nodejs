import { defineConfig } from "tsup";

const env = process.env.NODE_ENV || "development";

export default defineConfig({
  entry: ["src/**/*.ts", "!src/tests/", "!src/**/*.test.ts"],
  format: ["cjs", "esm"],
  splitting: true,
  treeshake: true,
  sourcemap: env === "development",
  clean: true,
  dts: true,
  minify: env === "production",
  bundle: env === "production",
  skipNodeModulesBundle: true,
});
