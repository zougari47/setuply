import { SetupOptions } from "@/types";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "oxlint";

export function initOxlint(options: SetupOptions, cwd: string) {
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

  const configPath = join(cwd, "oxlint.config.ts");
  writeFileSync(configPath, content, "utf-8");
}
