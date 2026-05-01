import { initOxlint } from "@/configs/oxlint";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cli-test-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

it("creates oxlint.config.ts with react and next plugins", async () => {
  initOxlint(
    {
      tools: ["oxlint"],
      project: { stack: ["typescript", "react", "next"] },
    },
    tmpDir,
  );

  const configPath = path.join(tmpDir, "oxlint.config.ts");
  expect(fs.existsSync(configPath)).toBe(true);

  const content = fs.readFileSync(configPath, "utf-8");
  const match = content.match(/defineConfig\(([\s\S]*)\);/);
  const config = JSON.parse(match![1]);

  expect(config.plugins).toContain("react");
  expect(config.plugins).toContain("react-perf");
  expect(config.plugins).toContain("jsx-a11y");
  expect(config.plugins).toContain("nextjs");
  expect(config.env.builtin).toBe(true);
  expect(config.ignorePatterns).toContain("**/node_modules/**");
  expect(config.ignorePatterns).toContain("**/dist/**");
});

it("creates config without react plugins", async () => {
  initOxlint(
    {
      tools: ["oxlint"],
      project: { stack: ["typescript"] },
    },
    tmpDir,
  );

  const content = fs.readFileSync(
    path.join(tmpDir, "oxlint.config.ts"),
    "utf-8",
  );
  const match = content.match(/defineConfig\(([\s\S]*)\);/);
  const config = JSON.parse(match![1]);

  expect(config.plugins).toEqual([]);
});

it("creates config with react but without next plugins", async () => {
  initOxlint(
    {
      tools: ["oxlint"],
      project: { stack: ["typescript", "react"] },
    },
    tmpDir,
  );

  const content = fs.readFileSync(
    path.join(tmpDir, "oxlint.config.ts"),
    "utf-8",
  );
  const match = content.match(/defineConfig\(([\s\S]*)\);/);
  const config = JSON.parse(match![1]);

  expect(config.plugins).toContain("react");
  expect(config.plugins).toContain("react-perf");
  expect(config.plugins).toContain("jsx-a11y");
  expect(config.plugins).not.toContain("nextjs");
});

it("includes categories, rules, and settings in the config", async () => {
  initOxlint(
    {
      tools: ["oxlint"],
      project: { stack: ["typescript"] },
    },
    tmpDir,
  );

  const content = fs.readFileSync(
    path.join(tmpDir, "oxlint.config.ts"),
    "utf-8",
  );
  const match = content.match(/defineConfig\(([\s\S]*)\);/);
  const config = JSON.parse(match![1]);

  expect(config.categories).toEqual({});
  expect(config.rules).toEqual({});
  expect(config.settings).toEqual({});
});