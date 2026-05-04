<div align="center">

# Setuply

[![npm version](https://img.shields.io/npm/v/setuply)](https://www.npmjs.com/package/setuply)
[![npm downloads](https://img.shields.io/npm/dm/setuply)](https://www.npmjs.com/package/setuply)
[![license](https://img.shields.io/npm/l/setuply)](./LICENSE)

One command to set up Oxlint, Oxfmt, Husky, Lint staged and Commitlint. Skip the config, start shipping.

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

## Command Line Options

Skip the interactive wizard by passing flags:

- `--oxlint` - Setup Oxlint only
- `--oxfmt` - Setup Oxfmt only
- `--husky` - Setup Husky only
- `--lint-staged` - Setup Lint Staged only
- `--commitlint` - Setup Commitlint only
- `--all` - Setup all tools (Oxfmt, Oxlint, Husky, Lint Staged, Commitlint)

Example:

```bash
  npx setuply --all
```

## Supported Tools

| Tool            | What you get                                                             |
| --------------- | ------------------------------------------------------------------------ |
| **oxfmt**       | Formatting with smart import sorting and optional Tailwind class sorting |
| **oxlint**      | Linting with the right plugins for your stack                            |
| **husky**       | Pre-commit hook wired to lint-staged                                     |
| **lint-staged** | Runs `oxfmt` and `oxlint` on staged files only                           |
| **commitlint**  | Validates commit messages using conventional commit format               |

## License

MIT
