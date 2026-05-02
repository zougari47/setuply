import { initHusky } from "@/configs/husky";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

// ── Exec mock ──────────────────────────────────────────────────────────────────
// promisify(exec) calls raw exec with exactly (cmd, callback) — 2 args.
const execMock = vi.hoisted(() =>
  vi.fn(
    (
      _cmd: string,
      cb: (err: null, result: { stdout: string; stderr: string }) => void,
    ) => {
      cb(null, { stdout: "", stderr: "" });
    },
  ),
);

vi.mock("node:child_process", () => ({ exec: execMock }));

// ── Helpers ────────────────────────────────────────────────────────────────────

const getPreCommitPath = (dir: string) =>
  path.join(dir, ".husky", "pre-commit");

/**
 * Simulate what `husky init` actually does in production:
 * creates .husky/ and seeds pre-commit with a default.
 * Required in every test because exec is mocked and never runs for real.
 */
const seedHuskyInit = (dir: string) => {
  fs.mkdirSync(path.join(dir, ".husky"), { recursive: true });
  fs.writeFileSync(getPreCommitPath(dir), "npm test\n", "utf-8");
};

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "husky-test-"));
  execMock.mockClear();
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

// ── Tests ──────────────────────────────────────────────────────────────────────
describe("initHusky", () => {
  describe("exec command", () => {
    it("uses `npx husky init` for npm", async () => {
      await initHusky(["husky"], "npm", tmpDir);

      expect(execMock).toHaveBeenCalledWith(
        "npx husky init",
        expect.any(Function),
      );
    });

    it.each([
      { pm: "pnpm", dlx: "pnpm dlx" },
      { pm: "yarn", dlx: "yarn dlx" },
      { pm: "bun", dlx: "bunx" },
    ])("uses `$dlx husky init` for $pm", async ({ pm, dlx }) => {
      await initHusky(["husky"], pm, tmpDir);
      expect(execMock).toHaveBeenCalledWith(
        `${dlx} husky init`,
        expect.any(Function),
      );
    });
  });

  describe("when lint-staged is NOT in tools", () => {
    it("does not overwrite the pre-commit file", async () => {
      seedHuskyInit(tmpDir);

      await initHusky(["husky"], "npm", tmpDir);

      expect(fs.readFileSync(getPreCommitPath(tmpDir), "utf-8")).toBe(
        "npm test\n",
      );
    });

    it("does not overwrite the pre-commit file when tools is empty", async () => {
      seedHuskyInit(tmpDir);

      await initHusky([], "npm", tmpDir);

      expect(fs.readFileSync(getPreCommitPath(tmpDir), "utf-8")).toBe(
        "npm test\n",
      );
    });
  });

  describe("when lint-staged IS in tools", () => {
    it("overwrites pre-commit with `npx lint-staged` for npm", async () => {
      seedHuskyInit(tmpDir); // husky init always runs before writeFileSync

      await initHusky(["husky", "lint-staged"], "npm", tmpDir);

      expect(fs.readFileSync(getPreCommitPath(tmpDir), "utf-8")).toBe(
        "npx lint-staged\n",
      );
    });

    it.each([
      { pm: "pnpm", dlx: "pnpm dlx" },
      { pm: "yarn", dlx: "yarn dlx" },
      { pm: "bun", dlx: "bunx" },
    ])(
      "overwrites pre-commit with `$dlx lint-staged` for $pm",
      async ({ pm, dlx }) => {
        seedHuskyInit(tmpDir);
        await initHusky(["husky", "lint-staged"], pm, tmpDir);
        expect(fs.readFileSync(getPreCommitPath(tmpDir), "utf-8")).toBe(
          `${dlx} lint-staged\n`,
        );
      },
    );
  });

  describe("error handling", () => {
    it("propagates exec errors", async () => {
      execMock.mockImplementationOnce(() => {
        throw new Error("exec failed");
      });

      await expect(initHusky(["husky"], "npm", tmpDir)).rejects.toThrow(
        "exec failed",
      );
    });
  });
});
