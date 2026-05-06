import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: [],
  categories: {
    correctness: "error",
  },
  rules: {},
  settings: {},
  env: {
    builtin: true,
  },
  ignorePatterns: ["**/node_modules/**", "**/dist/**"],
});
