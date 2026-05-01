import { initOxfmt } from "@/configs/oxfmt";
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

it("creates oxfmt.config.ts with default configuration", async () => {
  initOxfmt(
    {
      stack: ["typescript", "react", "next", "tailwindcss"],
    },
    tmpDir,
  );

  const configPath = path.join(tmpDir, "oxfmt.config.ts");
  expect(fs.existsSync(configPath)).toBe(true);

  const content = fs.readFileSync(configPath, "utf-8");

  const match = content.match(/defineConfig\(([\s\S]*)\);/);
  const config = JSON.parse(match![1]);

  expect(config.ignorePatterns).toContain("**/node_modules/**");
  expect(config.sortTailwindcss.stylesheet).toBe("./src/app/globals.css");
  expect(config.sortTailwindcss.functions).toEqual(["cn", "cva"]);
});

it("creates config with Tailwind but without Next.js", async () => {
  initOxfmt(
    {
      stack: ["typescript", "react", "tailwindcss"],
    },
    tmpDir,
  );

  const content = fs.readFileSync(
    path.join(tmpDir, "oxfmt.config.ts"),
    "utf-8",
  );
  const match = content.match(/defineConfig\(([\s\S]*)\);/);
  const config = JSON.parse(match![1]);

  expect(config.sortTailwindcss.stylesheet).toBe("./src/styles/globals.css");
});

it("creates config without Tailwind", async () => {
  initOxfmt(
    {
      stack: ["typescript", "react"],
    },
    tmpDir,
  );

  const content = fs.readFileSync(
    path.join(tmpDir, "oxfmt.config.ts"),
    "utf-8",
  );
  const match = content.match(/defineConfig\(([\s\S]*)\);/);
  const config = JSON.parse(match![1]);

  expect(config.ignorePatterns).toContain("**/node_modules/**");
  expect(config.sortTailwindcss).toBeUndefined();
});

it("uses custom tailwindStylesheet from project info", async () => {
  initOxfmt(
    {
      stack: ["typescript", "react", "next", "tailwindcss"],
      tailwindStylesheet: "./custom/styles.css",
    },
    tmpDir,
  );

  const content = fs.readFileSync(
    path.join(tmpDir, "oxfmt.config.ts"),
    "utf-8",
  );
  const match = content.match(/defineConfig\(([\s\S]*)\);/);
  const config = JSON.parse(match![1]);

  expect(config.sortTailwindcss.stylesheet).toBe("./custom/styles.css");
});

it("includes dist folder in ignore patterns", async () => {
  initOxfmt(
    {
      stack: ["typescript"],
    },
    tmpDir,
  );

  const content = fs.readFileSync(
    path.join(tmpDir, "oxfmt.config.ts"),
    "utf-8",
  );
  const match = content.match(/defineConfig\(([\s\S]*)\);/);
  const config = JSON.parse(match![1]);

  expect(config.ignorePatterns).toContain("**/dist/**");
});

