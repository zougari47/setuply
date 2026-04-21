import chalk from "chalk"

export const logo = `
  ███████╗███████╗████████╗██╗   ██╗██████╗ ██╗  ██╗   ██╗
  ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║  ╚██╗ ██╔╝
  ███████╗█████╗     ██║   ██║   ██║██████╔╝██║   ╚████╔╝ 
  ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝ ██║    ╚██╔╝  
  ███████║███████╗   ██║   ╚██████╔╝██║     ███████╗██║   
  ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚══════╝╚═╝   
`

export function printSignature(version: string) {
  const lines = logo.split("\n")
  const colors = [
    chalk.hex("#6C63FF"),
    chalk.hex("#7B73FF"),
    chalk.hex("#8A83FF"),
    chalk.hex("#9993FF"),
    chalk.hex("#A8A3FF"),
    chalk.hex("#B7B3FF"),
    chalk.hex("#C6C3FF"),
    chalk.hex("#D5D3FF"),
  ]

  const coloredLogo = lines
    .map((line, i) => colors[i % colors.length](line))
    .join("\n")

  console.log(coloredLogo)
  console.log(chalk.dim(`  v${version}\n`))
}
