import { SetupOptions } from "@/types"
import { writeFileSync } from "node:fs"
import { join } from "node:path"
import { defineConfig } from "oxlint"

export async function initOxlint(options: SetupOptions) {
  const { project, language } = options
  const isTS = language === "ts"
  const isReact = project.framework === "react" || project.framework === "next"

  const configObj: Parameters<typeof defineConfig>[0] = {
    plugins: [
      "unicorn",
      "import",
      ...(isTS ? (["typescript"] as const) : []),
      ...(isReact ? (["react", "react-perf", "jsx-a11y"] as const) : []),
    ],
    categories: {},
    rules: {},
    env: { builtin: true },
    ignorePatterns: ["**/node_modules/**", "**/dist/**"],
    options: {
      typeAware: isTS,
    },
  }

  if (isReact) {
    configObj.settings = {
      react: { version: "19" },
    }
  }

  const configJson = JSON.stringify(configObj, null, 2)
  const content = `import { defineConfig } from "oxlint";\n\nexport default defineConfig(${configJson});\n`

  const configPath = join(process.cwd(), "oxlint.config.ts")
  writeFileSync(configPath, content, "utf-8")
}
