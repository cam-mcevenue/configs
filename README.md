# configs

Personal, shared configuration packages — TypeScript, Vite/vite-plus, linting and formatting — consumed directly by other projects via pnpm's git dependency support. Not published to npm.

## What's here

A pnpm workspace with two packages:

- **[`@cam-mcevenue/tsconfig`](packages/tsconfig)** — base `tsconfig.json` files.
  - `base.json` — strict TypeScript config targeting ES2022/NodeNext, with the Effect language service plugin enabled.
  - `tests.json` — extends `base.json` for test files under `packages/*/test`.
- **[`@cam-mcevenue/vite-config`](packages/vite)** — shared [`vite-plus`](https://github.com/voidzero-dev/vite-plus) config: `fmt`, `lintBase`, `lintEffect`, and `run` presets for oxfmt/oxlint.

The root `vite.config.ts` and `tsconfig*.json` files apply these to the workspace itself, so this repo also serves as a working example of how to consume them.

## Toolchain

This repo runs on some non-default tooling, noted here so it doesn't look accidental:

- **[vite-plus](https://github.com/voidzero-dev/vite-plus)** (`vp`) — unified formatter/linter/runner, backed by oxfmt/oxlint.
- **[`@effect/tsgo`](https://github.com/Effect-TS/tsgo)** (`effect-tsgo`) — wraps TypeScript's native (`tsgo`) compiler with the Effect language service plugin for typechecking.
- **TypeScript 7.0.2** — the Go-ported compiler, pinned via the pnpm catalog since it's still pre-release.
- **Zed** — `.zed/settings.json` wires oxlint/oxfmt as LSP formatters. Other editors aren't configured.

Scripts (root `package.json`):

```bash
pnpm check         # typecheck via effect-tsgo
pnpm lint          # lint via vite-plus
pnpm format        # format via vite-plus
pnpm format:check  # format check, no writes
```

Requires Node >=26 and pnpm 12.18.0 (pinned via `devEngines`/`engines` in `package.json`).

## Using this from another project

These packages are plain pnpm workspace packages, not published to npm. Reference them directly from GitHub using pnpm's git-dependency subpath syntax (consuming project must also use pnpm):

```json
{
  "devDependencies": {
    "@cam-mcevenue/tsconfig": "github:cam-mcevenue/configs#path:/packages/tsconfig",
    "@cam-mcevenue/vite-config": "github:cam-mcevenue/configs#path:/packages/vite"
  }
}
```

Then, in the consuming project:

```jsonc
// tsconfig.json
{
  "extends": "@cam-mcevenue/tsconfig/base.json",
}
```

```ts
// vite.config.ts
import { defineConfig } from "vite-plus";
import * as ViteConfig from "@cam-mcevenue/vite-config";

export default defineConfig({
  fmt: ViteConfig.fmt,
  lint: ViteConfig.lintEffect, // or ViteConfig.lintBase
  run: ViteConfig.run,
});
```

To pin to a specific point in history instead of tracking the default branch, append a commit SHA or tag after `configs`, e.g. `#deadbeef&path:/packages/tsconfig`.

> **Known pnpm gotcha:** the `#path:` fragment can occasionally get stripped from a consumer's `pnpm-lock.yaml` on a plain `pnpm install` ([pnpm#12304](https://github.com/pnpm/pnpm/issues/12304)), breaking resolution. If a consumer's install starts failing to find `@cam-mcevenue/*`, check the lockfile entry still has `path` on it and re-run `pnpm add` if not.

Both packages peer-depend on `typescript@^7.0.0` (for the `${configDir}` tsconfig template variable) and `@cam-mcevenue/vite-config` peer-depends on `@effect/tsgo`, which brings in `@effect/language-service` — no separate install needed for the plugin configured in `base.json`.

## Adding a new package

1. Create `packages/<name>` with its own `package.json` (scoped as `@cam-mcevenue/<name>`) and source.
2. Add any shared tool versions to the `catalog` in `pnpm-workspace.yaml` rather than pinning ad hoc.
3. Document it in the list above.

## License

[MIT](LICENSE)
