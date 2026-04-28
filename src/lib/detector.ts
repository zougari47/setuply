import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import type { ProjectInfo, TechStack } from "@/types";

const TECH_STACK = ["typescript", "react", "next", "tailwindcss"];
const DEFAULT_PROJECT_INFO: ProjectInfo = {
  stack: [],
};

export function detectProject(cwd: string): ProjectInfo {
  const pkgPath = join(cwd, "package.json");

  if (!existsSync(pkgPath)) {
    return DEFAULT_PROJECT_INFO;
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    const depsObj = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };
    const allDeps = Object.keys(depsObj || {});

    const stack = allDeps.filter((dep) =>
      TECH_STACK.includes(dep),
    ) as TechStack[];

    return { stack };
  } catch (e) {
    return DEFAULT_PROJECT_INFO;
  }
}
