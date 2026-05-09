import { buildLintStagedConfig } from "@/configs/lint-staged";

it("returns config with oxfmt and oxlint", () => {
  const config = buildLintStagedConfig([], true, true);

  expect(config["*.{js,ts}"]).toEqual(["oxfmt", "oxlint --fix"]);
  expect(config["*.{css,md,json}"]).toEqual(["oxfmt"]);
});

it("returns config with oxfmt only", () => {
  const config = buildLintStagedConfig(["react"], true, false);

  expect(config["*.{js,ts,tsx,jsx}"]).toContain("oxfmt");
  expect(config["*.{js,ts,tsx,jsx}"]).not.toContain("oxlint --fix");
});

it("returns config with oxlint only", () => {
  const config = buildLintStagedConfig(["react"], false, true);

  expect(config["*.{js,ts,tsx,jsx}"]).toEqual(["oxlint --fix"]);
  expect(config["*.{css,md,json}"]).toBeUndefined();
});

it("returns empty config when neither tool is selected", () => {
  const config = buildLintStagedConfig([], false, false);

  expect(config).toEqual({});
});

it("extends extensions with tsx and jsx for react/next", () => {
  const withReact = buildLintStagedConfig(["react"], true, false);
  expect(withReact["*.{js,ts,tsx,jsx}"]).toBeDefined();

  const withNext = buildLintStagedConfig(["next"], true, false);
  expect(withNext["*.{js,ts,tsx,jsx}"]).toBeDefined();

  const withoutReact = buildLintStagedConfig([], true, false);
  expect(withoutReact["*.{js,ts}"]).toBeDefined();
  expect(withoutReact["*.{js,ts,tsx,jsx}"]).toBeUndefined();
});
