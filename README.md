# Setuply

Instant linting, formatting, and Git hooks. Powered by OXC, Husky, and lint-staged. One command, zero config headache.

## Getting Started

- **npm**

  ```bash
  npx setuply
  ```

- **pnpm**

  ```bash
  pnpm dlx setuply
  ```

- **yarn**

  ```bash
  yarn dlx setuply
  ```

- **bun**
  ```bash
  bunx setuply
  ```

## Supported Tools

| Tool            | What you get                                                                                                            |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **oxfmt**       | Formatting with smart import sorting and optional Tailwind class sorting                                                |
| **oxlint**      | Linting with the right plugins for your stack                                                                           |
| **husky**       | Git hook that fires automatically before every commit, invoking lint-staged so nothing dirty ever lands in your history |
| **lint-staged** | Runs `oxfmt` and `oxlint` only on staged files, keeping pre-commit checks fast regardless of project size               |

## Supported Stack

**What Oxfmt supports ?**

Support includes JavaScript, JSX, TypeScript, TSX, JSON, JSONC, JSON5, YAML, TOML, HTML, Angular, Vue, CSS, SCSS, Less, Markdown, MDX, GraphQL, Ember, Handlebars, and more.

**What Oxlint supports ?**

- JavaScript and TypeScript (`.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`)
- JSX and TSX (`.jsx`, `.tsx`)
- Framework files (`.vue`, `.svelte`, `.astro`) by linting only their <script> blocks

See the [compatibility matrix](https://oxc.rs/compatibility.html) for detailed framework and file type support.

## License

MIT
