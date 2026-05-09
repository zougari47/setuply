// lint-staged config is handled by updatePackageJson function in lib/utils
// No separate config file needed, config lives in package.json

import { TechStack } from "@/types";

export function buildLintStagedConfig(
  stack: TechStack[],
  hasOxfmt: boolean,
  hasOxlint: boolean,
): Record<string, string[]> {
  const config: Record<string, string[]> = {};

  const extArr = ["js", "ts"];
  if (stack.includes("react") || stack.includes("next")) extArr.push("tsx", "jsx");
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
