import { buildLintStagedConfig } from "@/configs";
import { SetupOptions } from "@/types";
import { exec as execCallback } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

const exec = promisify(execCallback);

export function updatePackageJson(options: SetupOptions, cwd: string): void {
  const { tools, project } = options;
  const pkgPath = join(cwd, "package.json");

  let pkg: any = {};
  try {
    pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(`Invalid JSON in package.json: ${err.message}`);
    }
    throw new Error(
      `Could not read package.json at ${pkgPath}: ${(err as NodeJS.ErrnoException).message}`,
    );
  }

  const hasOxfmt = tools.includes("oxfmt");
  const hasOxlint = tools.includes("oxlint");
  const hasLintStaged = tools.includes("lint-staged");

  pkg.scripts = {
    ...(pkg.scripts || {}),
    ...(hasOxfmt
      ? {
          fmt: "oxfmt",
          "fmt:check": "oxfmt --check",
        }
      : {}),
    ...(hasOxlint
      ? {
          lint: "oxlint",
          "lint:fix": "oxlint --fix",
        }
      : {}),
  };

  if (hasLintStaged) {
    pkg["lint-staged"] = buildLintStagedConfig(
      project.stack,
      hasOxfmt,
      hasOxlint,
    );
  }

  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
}

export function getTailwindStylesheet(hasNext: boolean) {
  return `./src/${hasNext ? "app" : "styles"}/globals.css`;
}

export async function installDeps(deps: string[], pm: string) {
  const expandedDeps = deps.flatMap(d => d === "commitlint" ? ["@commitlint/cli", "@commitlint/config-conventional"] : [d]);
  const installCmd =
    pm === "npm"
      ? `npm install -D ${expandedDeps.join(" ")}`
      : `${pm} add -D ${expandedDeps.join(" ")}`;

  await exec(installCmd);
}
