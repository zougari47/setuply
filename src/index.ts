#!/usr/bin/env node

import { detect } from "package-manager-detector";
import { runSetupWizard } from "./cli";
import { printSignature } from "./lib/signature";

async function main() {
  printSignature();
  const pm = await detect();

  if (!pm?.name) {
    throw new Error("Unable to detect a package manager");
  }

  await runSetupWizard(pm?.name);
}

main().catch(console.error);
