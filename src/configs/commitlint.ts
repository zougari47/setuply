import { SetupTool } from "@/types";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

export function initCommitlint(
  tools: SetupTool[],
  pmName: string,
  cwd: string,
) {
  const configPath = join(cwd, "commitlint.config.js");
  const configContent = `export default { extends: ['@commitlint/config-conventional'] };\n`;
  writeFileSync(configPath, configContent, "utf-8");

  if (tools.includes("husky")) {
    let commitMsgCmd = "";

    // Command variations based on package manager
    // Reference: https://commitlint.js.org/guides/local-setup.html
    switch (pmName) {
      case "pnpm":
        commitMsgCmd = `pnpm dlx commitlint --edit "\${1}"`;
        break;
      case "yarn":
        commitMsgCmd = `yarn commitlint --edit "\${1}"`;
        break;
      case "bun":
        commitMsgCmd = `bunx commitlint --edit "\${1}"`;
        break;
      default:
        commitMsgCmd = `npx --no -- commitlint --edit "\${1}"`;
    }

    const huskyDir = join(cwd, ".husky");
    
    if (!existsSync(huskyDir)) {
      mkdirSync(huskyDir, { recursive: true });
    }
    
    const commitMsgPath = join(cwd, ".husky", "commit-msg");
    writeFileSync(commitMsgPath, `${commitMsgCmd}\n`, "utf-8");
  }
}
