export type SetupTool = "oxlint" | "oxfmt" | "husky" | "lint-staged";
export type TechStack = "typescript" | "react" | "next" | "tailwindcss";
// | "angular"
// | "vue"
// | "vitest";

export interface ProjectInfo {
  stack: TechStack[];
  tailwindStylesheet?: string;
}

export interface SetupOptions {
  tools: SetupTool[];
  project: ProjectInfo;
}
