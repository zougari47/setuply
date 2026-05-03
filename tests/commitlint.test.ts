import { initCommitlint } from "@/configs/commitlint";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "commitlint-test-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("initCommitlint", () => {
  it("always creates commitlint.config.js", async () => {
    initCommitlint([], "npm", tmpDir);
    const configPath = path.join(tmpDir, "commitlint.config.js");
    expect(fs.existsSync(configPath)).toBe(true);
    expect(fs.readFileSync(configPath, "utf-8")).toBe(`export default { extends: ['@commitlint/config-conventional'] };\n`);
  });

  describe("when husky is NOT in tools", () => {
    it("does not create a commit-msg hook", async () => {
      initCommitlint([], "npm", tmpDir);
      const commitMsgPath = path.join(tmpDir, ".husky", "commit-msg");
      expect(fs.existsSync(commitMsgPath)).toBe(false);
    });
  });

  describe("when husky IS in tools", () => {
    const getCommitMsgPath = () => path.join(tmpDir, ".husky", "commit-msg");

    it("creates .husky dir and adds commit-msg hook for npm", async () => {
      initCommitlint(["husky", "commitlint"], "npm", tmpDir);
      expect(fs.existsSync(getCommitMsgPath())).toBe(true);
      expect(fs.readFileSync(getCommitMsgPath(), "utf-8")).toBe(`npx --no -- commitlint --edit "\${1}"\n`);
    });

    it.each([
      { pm: "pnpm", expectedCmd: 'pnpm dlx commitlint --edit "${1}"' },
      { pm: "yarn", expectedCmd: 'yarn commitlint --edit "${1}"' },
      { pm: "bun", expectedCmd: 'bunx commitlint --edit "${1}"' },
    ])("creates .husky dir and adds commit-msg hook for $pm", async ({ pm, expectedCmd }) => {
      initCommitlint(["husky", "commitlint"], pm, tmpDir);
      expect(fs.existsSync(getCommitMsgPath())).toBe(true);
      expect(fs.readFileSync(getCommitMsgPath(), "utf-8")).toBe(`${expectedCmd}\n`);
    });
  });
});
