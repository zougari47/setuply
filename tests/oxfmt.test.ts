import { initOxfmt } from "@/configs/oxfmt";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cli-test-"));

  fs.writeFileSync(
    path.join(tmpDir, "package.json"),
    JSON.stringify(
      {
        private: true,
        dependencies: {
          next: "latest",
          react: "latest",
          "react-dom": "latest",
        },
        devDependencies: {
          typescript: "latest",
          "@types/react": "latest",
          "@types/node": "latest",
        },
      },
      null,
      2,
    ),
  );
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

it("adds fmt scripts to package.json", async () => {
  initOxfmt(
    {
      stack: ["typescript"],
    },
    tmpDir,
  );

  const pkg = JSON.parse(
    fs.readFileSync(path.join(tmpDir, "package.json"), "utf-8"),
  );

  expect(pkg.scripts.fmt).toBe("oxfmt");
  expect(pkg.scripts["fmt:check"]).toBe("oxfmt --check");
});

it("preserves existing package.json scripts", async () => {
  fs.writeFileSync(
    path.join(tmpDir, "package.json"),
    JSON.stringify(
      {
        private: true,
        scripts: {
          build: "tsc",
          test: "vitest",
        },
      },
      null,
      2,
    ),
  );

  initOxfmt(
    {
      stack: ["typescript"],
    },
    tmpDir,
  );

  const pkg = JSON.parse(
    fs.readFileSync(path.join(tmpDir, "package.json"), "utf-8"),
  );

  expect(pkg.scripts.build).toBe("tsc");
  expect(pkg.scripts.test).toBe("vitest");
  expect(pkg.scripts.fmt).toBe("oxfmt");
  expect(pkg.scripts["fmt:check"]).toBe("oxfmt --check");
});

it("creates package.json if it does not exist", async () => {
  fs.unlinkSync(path.join(tmpDir, "package.json"));

  initOxfmt(
    {
      stack: ["typescript"],
    },
    tmpDir,
  );

  const pkgPath = path.join(tmpDir, "package.json");
  expect(fs.existsSync(pkgPath)).toBe(true);

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
  expect(pkg.scripts.fmt).toBe("oxfmt");
  expect(pkg.scripts["fmt:check"]).toBe("oxfmt --check");
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
