import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Default ignores of eslint-config-next, plus our generated / non-app folders.
  globalIgnores([
    ".next/**",
    ".next-*/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "drizzle/**", // generated SQL + snapshots
    "public/**", // service worker and static files (browser globals)
    "scripts/**", // one-off Node helper scripts
    ".agents/**", // AI-tool skills, not part of the site
    ".claude/**",
    ".codex/**",
  ]),
]);

export default eslintConfig;
