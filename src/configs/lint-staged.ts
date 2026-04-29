// lint-staged config is handled by updatePackageJson in cli.ts
// No separate config file needed - config lives in package.json

import { SetupOptions, TechStack } from "@/types";

export function buildLintStagedConfig(
  stack: TechStack[],
  hasOxfmt: boolean,
  hasOxlint: boolean,
): Record<string, string[]> {
  const config: Record<string, string[]> = {};

  const extArr = ["js"];
  if (stack.includes("typescript")) extArr.push("ts");
  if (stack.includes("react") || stack.includes("next"))
    extArr.push("tsx", "jsx");
  const ext = extArr.length > 1 ? `{${extArr.join(",")}}` : extArr[0];

  if (hasOxfmt) {
    config[`*.${ext}`] = [...(config[`*.${ext}`] ?? []), "oxfmt"];
    config["*.{css,md,json}"] = [...(config["*.{css,md,json}"] ?? []), "oxfmt"];
  }

  if (hasOxlint) {
    config[`*.${ext}`] = [...(config[`*.${ext}`] ?? []), "oxlint --fix"];
  }

  return config;
}
