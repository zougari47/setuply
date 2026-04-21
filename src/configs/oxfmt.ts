import { SetupOptions } from "@/types"
import { getTailwindStylesheet } from "@/lib/utils"
import { defineConfig } from "oxfmt"
import { writeFileSync } from "node:fs"
import { join } from "node:path"

export async function initOxfmt(options: SetupOptions) {
  const { project } = options
  const isReact = project.framework === "react"
  const isNext = project.framework === "next"
  const isTailwind = project.tailwind

  // Base configuration
  const configObj: Parameters<typeof defineConfig>[0] = {
    printWidth: 80,
    sortImports: {
      ignoreCase: false,
      newlinesBetween: true,
      internalPattern: ["@/*"],
      customGroups: [
        {
          groupName: "convex",
          elementNamePattern: [
            "convex",
            "convex/*",
            "convex-helpers/*",
            "@/convex/*",
          ],
        },
        {
          groupName: "internal-types",
          elementNamePattern: ["@/types", "@/types/*"],
        },
        {
          groupName: "internal-config",
          elementNamePattern: ["@/config/*"],
        },
        {
          groupName: "internal-lib",
          elementNamePattern: ["@/lib/*"],
        },
        {
          groupName: "internal-hooks",
          elementNamePattern: ["@/hooks/*"],
        },
        {
          groupName: "internal-ui",
          elementNamePattern: ["@/components/ui/*"],
        },
        {
          groupName: "internal-components",
          elementNamePattern: ["@/components/*"],
        },
        {
          groupName: "internal-styles",
          elementNamePattern: ["@/styles/*"],
        },
      ],
      groups: [
        "external",
        "convex",
        "internal-types",
        "internal-config",
        "internal-lib",
        "internal-hooks",
        "internal-ui",
        "internal-components",
        "internal-styles",
        "internal",
        ["parent", "sibling", "index"],
        "type",
      ],
    },
    ignorePatterns: ["**/node_modules/**", "**/dist/**"],
  }

  // Conditionally add Tailwind config
  if (isTailwind) {
    configObj.sortTailwindcss = {
      stylesheet: project.tailwindStylesheet || getTailwindStylesheet(isNext),
      functions: ["cn", "cva"],
    }
  }

  // Conditionally add React imports
  if (isReact && typeof configObj.sortImports === "object") {
    configObj.sortImports.customGroups!.unshift({
      groupName: "react",
      elementNamePattern: ["react", "react-*"],
    })
    configObj.sortImports.groups!.unshift("react")
  }

  // Convert the object to a formatted JSON string
  const configJson = JSON.stringify(configObj, null, 2)

  // Wrap it in the export statement
  const content = `import { defineConfig } from "oxfmt";\n\nexport default defineConfig(${configJson});\n`
  
  const configPath = join(process.cwd(), "oxfmt.config.ts")
  writeFileSync(configPath, content, "utf-8")
}
