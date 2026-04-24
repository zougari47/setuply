import chalk from "chalk";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const logo = `
  ███████╗███████╗████████╗██╗   ██╗██████╗ ██╗  ██╗   ██╗
  ██╔════╝██╔════╝╚══██╔══╝██║   ██║██╔══██╗██║  ╚██╗ ██╔╝
  ███████╗█████╗     ██║   ██║   ██║██████╔╝██║   ╚████╔╝ 
  ╚════██║██╔══╝     ██║   ██║   ██║██╔═══╝ ██║    ╚██╔╝  
  ███████║███████╗   ██║   ╚██████╔╝██║     ███████╗██║   
  ╚══════╝╚══════╝   ╚═╝    ╚═════╝ ╚═╝     ╚══════╝╚═╝   
`;

export function printSignature() {
  const __dirname = fileURLToPath(new URL(".", import.meta.url));
  let version = "0.0.0";

  try {
    const pkg = JSON.parse(
      readFileSync(join(__dirname, "../package.json"), "utf-8"),
    );
    version = pkg.version;
  } catch (e) {}

  const lines = logo.split("\n");
  const colors = [
    chalk.hex("#6C63FF"),
    chalk.hex("#7B73FF"),
    chalk.hex("#8A83FF"),
    chalk.hex("#9993FF"),
    chalk.hex("#A8A3FF"),
    chalk.hex("#B7B3FF"),
    chalk.hex("#C6C3FF"),
    chalk.hex("#D5D3FF"),
  ];

  const coloredLogo = lines
    .map((line, i) => colors[i % colors.length](line))
    .join("\n");

  console.log(coloredLogo);
  console.log(chalk.dim(`  v${version}\n`));
}
