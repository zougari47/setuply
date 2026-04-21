import { detect } from "package-manager-detector"
import { exec as execCallback } from "node:child_process"
import { promisify } from "node:util"

const exec = promisify(execCallback)

export function getTailwindStylesheet(isNext: boolean) {
  return `./src/${isNext ? "app" : "styles"}/globals.css`
}

export async function installDeps(deps: string[]) {
  const pm = await detect()
  const pmName = pm?.name || "npm"
  const installCmd = pmName === "npm" ? `npm install -D ${deps.join(" ")}` : `${pmName} add -D ${deps.join(" ")}`

  await exec(installCmd)
  return { pmName, installCmd }
}
