# Setuply

A CLI tool that detects your project and generates ready-to-use config files for modern tooling — so you don't have to.

## What it does

Run `setuply` in your project root and it will:

1. **Detect** your framework, language, and Tailwind setup
2. **Ask** you to confirm (or override) what it found
3. **Generate** config files tailored to your stack
4. **Install** the dependencies for you

## Supported tools

| Tool | What you get |
|------|-------------|
| **oxfmt** | `oxfmt.config.ts` — formatting with smart import sorting and optional Tailwind class sorting |
| **oxlint** | `oxlint.config.ts` — linting with the right plugins for your stack |
| husky | _coming soon_ |
| lint-staged | _coming soon_ |

## Supported frameworks

Setuply currently supports **React** and **Next.js** projects (TypeScript or JavaScript).

More frameworks (Vue, Svelte, etc.) are planned.

## Usage

```bash
npx setuply
```

Or install it globally:

```bash
npm install -g setuply
setuply
```

## How detection works

Setuply reads your `package.json` and checks for:

- **TypeScript** → `typescript` in deps or a `tsconfig.json`
- **Next.js** → `next` in deps
- **React** → `react` in deps
- **Tailwind** → `tailwindcss` in deps or a `tailwind.config.*` file

If something looks wrong, you can override it during the wizard.

## License

MIT
