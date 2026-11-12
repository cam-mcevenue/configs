import type { UserConfig } from "vite";
import { recommended } from "@effect/tsgo/oxlint-presets";

type OxlintConfig = NonNullable<UserConfig["lint"]>;
type OxfmtConfig = NonNullable<UserConfig["fmt"]>;
type RunConfig = NonNullable<UserConfig["run"]>;

export const fmt: OxfmtConfig = {
  ignorePatterns: ["**/*.md"],
};

export const lintBase: OxlintConfig = {
  jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
  rules: { "vite-plus/prefer-vite-plus-imports": "error" },
  options: { typeAware: true, typeCheck: true },
};

export const lintEffect: OxlintConfig = {
  ...lintBase,
  extends: [recommended],
};

export const run: RunConfig = {
  cache: true,
};
