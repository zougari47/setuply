import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execCallback);

export function getTailwindStylesheet(isNext: boolean) {
  return `./src/${isNext ? "app" : "styles"}/globals.css`;
}

export async function installDeps(deps: string[], pm: string) {
  const installCmd =
    pm === "npm"
      ? `npm install -D ${deps.join(" ")}`
      : `${pm} add -D ${deps.join(" ")}`;

  await exec(installCmd);
}
