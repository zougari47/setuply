import {
  cancel,
  confirm,
  intro,
  isCancel,
  multiselect,
  outro,
  spinner,
  text,
  log,
  autocompleteMultiselect,
} from "@clack/prompts";
import chalk from "chalk";
import type { SetupOptions, SetupTool, TechStack } from "@/types";
import { detectProject } from "@/lib/detector";
import { initOxfmt, initOxlint, initHusky } from "@/configs";
import {
  getTailwindStylesheet,
  installDeps,
  updatePackageJson,
} from "@/lib/utils";

export async function runSetupWizard(pm: string) {
  const cwd = process.cwd();
  let project = detectProject(cwd);

  intro(chalk.hex("#A78BFA").bold("Setuply Wizard 🪄"));

  const tools = await multiselect<SetupTool>({
    message: "What would you like to setup?",
    options: [
      { value: "oxlint", label: "Oxlint" },
      { value: "oxfmt", label: "Oxfmt" },
      { value: "husky", label: "Husky" },
      { value: "lint-staged", label: "Lint Staged" },
    ],
    initialValues: ["oxfmt", "oxlint", "husky", "lint-staged"],
  });

  if (isCancel(tools)) {
    cancel("Setup cancelled.");
    process.exit(0);
  }

  const needsOxfmtOxlint = tools.includes("oxfmt") || tools.includes("oxlint");

  if (needsOxfmtOxlint) {
    const projectLabel =
      project.stack.length > 0
        ? `${chalk.yellow(project.stack.join(", "))}`
        : chalk.yellow("Unknown stack");

    const isCorrect = await confirm({
      message: `Stack detected: ${projectLabel}. Proceed?`,
      initialValue: true,
    });

    if (isCancel(isCorrect)) {
      cancel("Setup cancelled.");
      process.exit(0);
    }

    if (!isCorrect) {
      const stackItems = await autocompleteMultiselect<TechStack>({
        message: "What is your stack?",
        options: [
          { value: "typescript", label: "TypeScript" },
          { value: "next", label: "Next.js" },
          { value: "react", label: "React" },
          { value: "tailwindcss", label: "Tailwind CSS" },
        ],
        initialValues: project.stack,
      });

      if (isCancel(stackItems)) {
        cancel("Setup cancelled.");
        process.exit(0);
      }

      project = {
        ...project,
        stack: stackItems as TechStack[],
      };
    }

    if (tools.includes("oxfmt") && project.stack.includes("tailwindcss")) {
      const tailwindStylesheetPath = getTailwindStylesheet(
        project.stack.includes("next"),
      );
      const stylesheet = await text({
        message: "What is the path to your Tailwind stylesheet?",
        initialValue: tailwindStylesheetPath,
        placeholder: tailwindStylesheetPath,
      });

      if (isCancel(stylesheet)) {
        cancel("Setup cancelled.");
        process.exit(0);
      }

      project.tailwindStylesheet = stylesheet as string;
    }
  }

  const summary = `${chalk.cyan((tools as string[]).join(", "))} | ${chalk.blue(project.stack.join(", "))}`;
  outro(`${chalk.green("Ready!")} ${summary}`);

  const options: SetupOptions = {
    tools: tools as SetupTool[],
    project,
  };

  if (options.tools.length > 0) {
    const s = spinner();
    s.start(
      `Installing dependencies: ${chalk.cyan(options.tools.join(", "))}...`,
    );

    try {
      await installDeps(options.tools, pm);
      s.stop(`Installed dependencies successfully via ${pm}`);
    } catch (error) {
      s.stop(
        `Failed to install dependencies. Please run your package manager's install command manually.`,
      );
    }
  }

  // Update package.json once with all tool configs
  updatePackageJson(options, cwd);

  const configuredTools: string[] = [];
  const s = spinner();
  s.start("Configuring tools...");

  for (const tool of options.tools) {
    try {
      switch (tool) {
        case "oxfmt":
          initOxfmt(options.project, cwd);
          break;
        case "oxlint":
          initOxlint(options, cwd);
          break;
        case "husky":
          await initHusky(options.tools, pm, cwd);
          break;
      }
      configuredTools.push(tool);
    } catch (error) {
      log.error(`Failed to configure ${chalk.cyan(tool)}.`);
      console.error(error);
    }
  }

  s.stop();

  if (configuredTools.length > 0) {
    outro(
      `${chalk.green("🎉 Successfully configured:")} ${chalk.cyan(configuredTools.join(", "))}. ${chalk.green("Congratulations!")}`,
    );
  }

  return options;
}
