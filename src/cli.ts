import { readFileSync } from "node:fs"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import {
  cancel,
  confirm,
  intro,
  isCancel,
  multiselect,
  outro,
  select,
  spinner,
  text,
  log,
} from "@clack/prompts"
import chalk from "chalk"
import type { SetupOptions, SetupTool } from "@/types"
import { detect } from "package-manager-detector"
import { detectProject } from "@/lib/detector"
import { printSignature } from "@/lib/signature"
import { initOxfmt } from "@/configs/oxfmt"
import { initOxlint } from "@/configs/oxlint"
import { initHusky } from "@/configs/husky"
import { initLintStaged } from "@/configs/lintstaged"
import { writeFileSync } from "node:fs"
import { getTailwindStylesheet, installDeps } from "@/lib/utils"

const __dirname = fileURLToPath(new URL(".", import.meta.url))

export async function showStartupMessage() {
  // 1. Version detection
  let version = "0.0.0"
  try {
    const pkg = JSON.parse(
      readFileSync(join(__dirname, "../package.json"), "utf-8")
    )
    version = pkg.version
  } catch (e) { }

  printSignature(version)

  // 2. Detection
  const pm = await detect()

  console.log(`Package manager: ${pm?.name}`)
}

export async function runSetupWizard() {
  let project = detectProject()

  intro(chalk.hex("#A78BFA").bold("Setuply Wizard 🪄"))

  const tools = await multiselect({
    message: "What to setup?",
    options: [
      { value: "oxlint", label: "Oxlint" },
      { value: "oxfmt", label: "Oxfmt" },
      { value: "husky", label: "Husky" },
      { value: "lint-staged", label: "Lint Staged" },
    ],
    initialValues: ["oxfmt", "oxlint", "husky", "lint-staged"],
  })

  if (isCancel(tools)) {
    cancel("Setup cancelled.")
    process.exit(0)
  }

  const needsDetection =
    (tools as string[]).includes("oxfmt") ||
    (tools as string[]).includes("oxlint")

  if (needsDetection) {
    const projectLabel = `${chalk.yellow(project.framework)} (${chalk.blue(project.language)})${project.tailwind ? ` + ${chalk.blue("Tailwind")}` : ""}`

    const isCorrect = await confirm({
      message: `Stack detected  ${projectLabel}. Proceed ?`,
      initialValue: true,
    })

    if (isCancel(isCorrect)) {
      cancel("Setup cancelled.")
      process.exit(0)
    }

    if (!isCorrect) {
      const framework = await select({
        message: "What is your stack ?",
        options: [
          { value: "next", label: "Next.js" },
          { value: "react", label: "React" },
          { value: "node", label: "Node.js (None)" },
        ],
        initialValue: project.framework,
      })

      if (isCancel(framework)) {
        cancel("Setup cancelled.")
        process.exit(0)
      }

      const language = await select({
        message: "What language are you using?",
        options: [
          { value: "ts", label: "TypeScript" },
          { value: "js", label: "JavaScript" },
        ],
        initialValue: project.language,
      })

      if (isCancel(language)) {
        cancel("Setup cancelled.")
        process.exit(0)
      }

      const tailwind = await confirm({
        message: "Are you using Tailwind CSS?",
        initialValue: project.tailwind,
      })

      if (isCancel(tailwind)) {
        cancel("Setup cancelled.")
        process.exit(0)
      }

      project = {
        ...project,
        framework: framework as "next" | "react" | "node",
        language: language as "ts" | "js",
        tailwind: tailwind as boolean,
      }
    }

    if ((tools as string[]).includes("oxfmt") && project.tailwind) {
      const tailwindStylesheetPath = getTailwindStylesheet(
        project.framework === "next"
      )
      const stylesheet = await text({
        message: "What is the path to your Tailwind stylesheet?",
        initialValue: tailwindStylesheetPath,
        placeholder: tailwindStylesheetPath,
      })

      if (isCancel(stylesheet)) {
        cancel("Setup cancelled.")
        process.exit(0)
      }

      project.tailwindStylesheet = stylesheet as string
    }
  }

  const summary = `${chalk.cyan((tools as string[]).join(", "))} | ${chalk.blue(project.language)}`
  outro(`${chalk.green("Ready!")} ${summary}`)

  const options: SetupOptions = {
    tools: tools as SetupTool[],
    language: project.language,
    project,
  }

  let pmName = "npm"

  if (options.tools.length > 0) {
    const s = spinner()
    s.start(
      `Installing dependencies: ${chalk.cyan(options.tools.join(", "))}...`
    )

    try {
      const result = await installDeps(options.tools)
      pmName = result.pmName
      s.stop(`Installed dependencies successfully via ${pmName}`)
    } catch (error) {
      s.stop(
        `Failed to install dependencies. Please run your package manager's install command manually.`
      )
    }
  }

  for (const tool of options.tools) {
    const sTool = spinner()
    sTool.start(`Configuring ${chalk.cyan(tool)}...`)

    try {
      switch (tool) {
        case "oxfmt":
          await initOxfmt(options)
          break
        case "oxlint":
          await initOxlint(options)
          break
        case "husky":
          await initHusky(options, pmName)
          break
        case "lint-staged":
          await initLintStaged(options, pmName)
          break
      }
      sTool.stop()
      log.success(`Configured ${chalk.cyan(tool)} successfully.`)
    } catch (error) {
      sTool.stop()
      log.error(`Failed to configure ${chalk.cyan(tool)}.`)
      console.error(error)
    }
  }

  return options
}
