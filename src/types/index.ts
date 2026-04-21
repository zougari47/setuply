export type SetupTool = "oxlint" | "oxfmt" | "husky" | "lint-staged"
export type ProjectLanguage = "ts" | "js"
export type ProjectFramework = "next" | "react" | "node"

export interface ProjectInfo {
  language: ProjectLanguage
  framework: ProjectFramework
  tailwind: boolean
  tailwindStylesheet?: string
  hasPackageJson: boolean
}

export interface SetupOptions {
  tools: SetupTool[]
  language: ProjectLanguage
  project: ProjectInfo
}
