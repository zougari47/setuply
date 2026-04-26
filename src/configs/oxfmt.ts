import { ProjectInfo } from "@/types";
import { getTailwindStylesheet } from "@/lib/utils";
import type { defineConfig } from "oxfmt";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export function initOxfmt(project: ProjectInfo) {
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
    "fmt": "oxfmt",
    "fmt:check": "oxfmt --check",
  };

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  const { stack } = project;
  const hasNext = stack.includes("next");
  const hasTailwind = stack.includes("tailwindcss");

  // Base configuration
  const configObj: Parameters<typeof defineConfig>[0] = {
    ignorePatterns: ["**/node_modules/**", "**/dist/**"],
  };

  if (hasTailwind) {
    configObj.sortTailwindcss = {
      stylesheet: project.tailwindStylesheet || getTailwindStylesheet(hasNext),
      functions: ["cn", "cva"],
    };
  }

  const content = `import { defineConfig } from "oxfmt";

export default defineConfig(${JSON.stringify(configObj, null, 2)});
`;

  const configPath = join(process.cwd(), "oxfmt.config.ts");
  writeFileSync(configPath, content, "utf-8");
}
