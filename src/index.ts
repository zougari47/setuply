#!/usr/bin/env node

import { Command } from "commander";
import { log, spinner } from "@clack/prompts";
import chalk from "chalk";
import { detect } from "package-manager-detector";

import { runSetupWizard } from "@/cli";
import { printSignature } from "@/lib/signature";
import { initCommitlint, initHusky, initOxfmt, initOxlint } from "@/configs";
import { installDeps, updatePackageJson } from "@/lib/utils";

import type { SetupOptions, SetupTool } from "@/types";

async function main() {
  const program = new Command();

  program
    .name("Setuply")
    .description(
      "Setuply installs and configures Oxfmt, Oxlint, Husky, LintStaged and Commitlint instantly.",
    )
    .version("0.1.0")
    .option("--oxlint", "Setup Oxlint")
    .option("--oxfmt", "Setup Oxfmt")
    .option("--husky", "Setup Husky")
    .option("--lint-staged", "Setup Lint Staged")
    .option("--commitlint", "Setup Commitlint")
    .option("--all", "Setup all tools")
    .parse(process.argv);

  const pm = (await detect())?.name;

  if (!pm) {
    throw new Error("Unable to detect a package manager !");
  }

  const opts = program.opts();
  const cwd = process.cwd();

  let selectedTools: SetupTool[] = [];

  if (opts.all) {
    selectedTools = ["oxfmt", "oxlint", "husky", "lint-staged", "commitlint"];
  } else {
    selectedTools = [
      opts.oxfmt && "oxfmt",
      opts.oxlint && "oxlint",
      opts.husky && "husky",
      opts.lintStaged && "lint-staged",
      opts.commitlint && "commitlint",
    ].filter(Boolean);
  }

  if (selectedTools.length === 0) {
    printSignature();
    selectedTools = (await runSetupWizard(pm, cwd)).tools;
  } else {
    let options: SetupOptions = {
      tools: selectedTools,
      project: {
        stack: [],
      },
    };
    const s = spinner();
    s.start(`Setting up ${chalk.cyan(selectedTools.join(", "))}...`);

    await installDeps(selectedTools, pm);

    updatePackageJson(options, cwd);

    for (const tool of selectedTools) {
      try {
        switch (tool) {
          case "oxfmt":
            initOxfmt(options.project, cwd);
            break;
          case "oxlint":
            initOxlint(options, cwd);
            break;
          case "husky":
            await initHusky(selectedTools, pm, cwd);
            break;
          case "commitlint":
            initCommitlint(selectedTools, pm, cwd);
            break;
        }
      } catch (error) {
        console.error(error);
      }
    }

    s.stop(
      `${chalk.green("🎉 Successfully configured:")} ${chalk.cyan(selectedTools.join(", "))}.`,
    );
  }
}

main().catch(console.error);
