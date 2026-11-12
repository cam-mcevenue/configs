import { defineConfig } from "vite-plus";
import * as ViteConfig from "./packages/vite/src";

export default defineConfig({
  fmt: ViteConfig.fmt,
  lint: ViteConfig.lintEffect,
  run: ViteConfig.run,
});
