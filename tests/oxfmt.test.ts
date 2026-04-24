import { initOxfmt } from "@/configs/oxfmt";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "cli-test-"));
  process.chdir(tmpDir);

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
  await initOxfmt({
    tools: ["oxfmt"],
    project: {
      stack: ["typescript", "react", "next", "tailwindcss", "vue", "angular"],
    },
  });

  const configPath = path.join(tmpDir, "oxfmt.config.ts");
  expect(fs.existsSync(configPath)).toBe(true);

  const configContent = fs.readFileSync(configPath, "utf-8");
  expect(configContent).toContain('import { defineConfig } from "oxfmt"');
  expect(configContent).toContain("export default defineConfig");
  expect(configContent).toContain("printWidth: 80");
});
