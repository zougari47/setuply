<div align="center">

# Setuply

[![npm version](https://img.shields.io/npm/v/setuply)](https://www.npmjs.com/package/setuply)
[![npm downloads](https://img.shields.io/npm/dm/setuply)](https://www.npmjs.com/package/setuply)
[![license](https://img.shields.io/npm/l/setuply)](./LICENSE)

One command to set up Oxlint, Oxfmt, Husky, and lint-staged. Skip the config, start shipping.

<img width="800" height="450" alt="setuply-ezgif com-video-to-gif-converter" src="https://github.com/user-attachments/assets/1babf66f-79df-4d61-86c4-6820f533abd9" />
</div>

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

| Tool            | What you get                                                             |
| --------------- | ------------------------------------------------------------------------ |
| **oxfmt**       | Formatting with smart import sorting and optional Tailwind class sorting |
| **oxlint**      | Linting with the right plugins for your stack                            |
| **husky**       | Pre-commit hook wired to lint-staged                                     |
| **lint-staged** | Runs `oxfmt` and `oxlint` on staged files only                           |

## License

MIT
