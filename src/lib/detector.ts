import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

import { ProjectInfo } from "@/types"

const DEFAULT_PROJECT_INFO: ProjectInfo = {
  language: "js",
  framework: "node",
  tailwind: false,
  hasPackageJson: false,
}

export function detectProject(cwd: string = process.cwd()): ProjectInfo {
  const pkgPath = join(cwd, "package.json")

  if (!existsSync(pkgPath)) {
    return DEFAULT_PROJECT_INFO
  }

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))
    const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }

    const isTypeScript = !!allDeps.typescript || existsSync(join(cwd, "tsconfig.json"))
    const isNext = !!allDeps.next
    const isReact = !!allDeps.react
    const isTailwind = !!allDeps.tailwindcss || 
      existsSync(join(cwd, "tailwind.config.js")) || 
      existsSync(join(cwd, "tailwind.config.ts"))

    return {
      language: isTypeScript ? "ts" : "js",
      framework: isNext ? "next" : isReact ? "react" : "node",
      tailwind: isTailwind,
      hasPackageJson: true,
    }
  } catch (e) {
    return DEFAULT_PROJECT_INFO
  }
}
