import { SetupOptions } from "@/types";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "oxlint";

export function initOxlint(options: SetupOptions) {
  // Add scripts to package.json
  const pkgPath = join(process.cwd(), "package.json");
  let pkg: any = {};
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch (e) {
    // If package.json doesn't exist or is invalid, start with empty object
  }

  pkg.scripts = {
    ...(pkg.scripts || {}),
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
  };

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  const { project } = options;
  const hasReact = project.stack.includes("react");
  const hasNext = project.stack.includes("next");

  const configObj: Parameters<typeof defineConfig>[0] = {
    plugins: [
      ...(hasReact ? (["react", "react-perf", "jsx-a11y"] as const) : []),
      ...(hasNext ? (["nextjs"] as const) : []),
    ],
    categories: {},
    rules: {},
    settings: {},
    env: { builtin: true },
    ignorePatterns: ["**/node_modules/**", "**/dist/**"],
  };

  const content = `import { defineConfig } from "oxlint";

export default defineConfig(${JSON.stringify(configObj, null, 2)});
`;

  const configPath = join(process.cwd(), "oxlint.config.ts");
  writeFileSync(configPath, content, "utf-8");
}
