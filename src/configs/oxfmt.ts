import { ProjectInfo } from "@/types";
import { getTailwindStylesheet } from "@/lib/utils";
import type { defineConfig } from "oxfmt";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

export function initOxfmt(project: ProjectInfo, cwd: string) {
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

  const configPath = join(cwd, "oxfmt.config.ts");
  writeFileSync(configPath, content, "utf-8");
}
