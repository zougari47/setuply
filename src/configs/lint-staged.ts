import { SetupOptions } from "@/types"
import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

export async function initLintStaged(options: SetupOptions, pmName: string) {
  const { tools, project } = options
  const hasOxfmt = tools.includes("oxfmt")
  const hasOxlint = tools.includes("oxlint")

  const extArr = ["js"]
  if (project.stack.includes("typescript")) extArr.push("ts")
  if (project.stack.includes("react") || project.stack.includes("next"))
    extArr.push("tsx", "jsx")
  const ext = extArr.length > 1 ? `{${extArr.join(",")}}` : extArr[0]

  const config: Record<string, string[]> = {}

  if (hasOxfmt) {
    config[`*.${ext}`] = [...(config[`*.${ext}`] ?? []), "oxfmt"]
    config["*.{css,md,json}"] = [
      ...(config["*.{css,md,json}"] ?? []),
      "oxfmt",
    ]
  }

  if (hasOxlint) {
    config[`*.${ext}`] = [...(config[`*.${ext}`] ?? []), "oxlint --fix"]
  }

  const pkgPath = join(process.cwd(), "package.json")

  let pkg: any = {}
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"))
  } catch (e) {
    // If package.json doesn't exist or is invalid, start with empty object
  }

  pkg["lint-staged"] = config

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8")
}
