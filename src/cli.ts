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
} from "@clack/prompts"
import chalk from "chalk"
import { SetupOptions, SetupTool } from "@/types"
import { detect, getUserAgent } from "package-manager-detector"
import { detectProject } from "@/lib/detector"
import { printSignature } from "@/lib/signature"
import { initOxfmt } from "@/configs/oxfmt"
import { initOxlint } from "@/configs/oxlint"
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
  } catch (e) {}

  printSignature(version)

  // 2. Detection
  const pm = getUserAgent()
  const project = detectProject()

  const projectLabel = `${chalk.yellow(project.framework)} (${chalk.blue(project.language)})${project.tailwind ? ` + ${chalk.blue("Tailwind")}` : ""}`

  console.log(`Detected manager: ${pm}`)
  console.log(`Detected project: ${projectLabel}`)
  console.log("")
}

export async function runSetupWizard() {
  let project = detectProject()

  intro(chalk.hex("#A78BFA").bold("✦ Setuply Wizard ✦"))

  const tools = await multiselect({
    message: "What to setup?",
    options: [
      { value: "oxlint", label: "oxlint" },
      { value: "oxfmt", label: "oxfmt" },
      { value: "husky", label: "husky" },
      { value: "lintstaged", label: "lint-staged" },
    ],
    initialValues: ["oxfmt", "oxlint"],
  })

  if (isCancel(tools)) {
    cancel("Setup cancelled.")
    process.exit(0)
  }

  const projectLabel = `${chalk.yellow(project.framework)} (${chalk.blue(project.language)})${project.tailwind ? ` + ${chalk.blue("Tailwind")}` : ""}`

  const isCorrect = await confirm({
    message: `We detected a ${projectLabel} project. Is this correct?`,
    initialValue: true,
  })

  if (isCancel(isCorrect)) {
    cancel("Setup cancelled.")
    process.exit(0)
  }

  if (!isCorrect) {
    const framework = await select({
      message: "What framework are you using?",
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

  if (project.tailwind) {
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

  const summary = `${chalk.cyan((tools as string[]).join(", "))} | ${chalk.blue(project.language)}`
  outro(`${chalk.green("Ready!")} ${summary}`)

  const options: SetupOptions = {
    tools: tools as SetupTool[],
    language: project.language,
    project,
  }

  for (const tool of options.tools) {
    switch (tool) {
      case "oxfmt":
        await initOxfmt(options)
        break
      case "oxlint":
        await initOxlint(options)
        break
      // Add other tool initializers here (oxlint, husky, etc.)
    }
  }

  if (options.tools.length > 0) {
    const s = spinner()
    s.start(
      `Installing dependencies: ${chalk.cyan(options.tools.join(", "))}...`
    )

    try {
      const { pmName } = await installDeps(options.tools)
      s.stop(`Installed dependencies successfully via ${pmName}`)
    } catch (error) {
      s.stop(
        `Failed to install dependencies. Please run your package manager's install command manually.`
      )
    }
  }

  return options
}
