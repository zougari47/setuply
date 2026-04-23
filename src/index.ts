#!/usr/bin/env node

import { runSetupWizard, showStartupMessage } from "./cli";

async function main() {
  await showStartupMessage();
  await runSetupWizard();
}

main().catch(console.error);
