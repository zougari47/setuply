import { SetupOptions } from "@/types";
import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const exec = promisify(execCallback);

export async function initHusky(
  options: SetupOptions,
  pmName: string,
  cwd: string,
) {
  const execCmd = pmName === "npm" ? "npx" : `${pmName} dlx`;

  await exec(`${execCmd} husky init`);

  if (options.tools.includes("lint-staged")) {
    const lintStagedCmd =
      pmName === "npm" ? "npx lint-staged" : `${pmName} lint-staged`;
    const preCommitPath = join(cwd, ".husky", "pre-commit");
    writeFileSync(preCommitPath, `${lintStagedCmd}\n`, "utf-8");
  }
}
