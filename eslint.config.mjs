import { createRequire } from "module";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const require = createRequire(import.meta.url);

// Bridge CJS eslint-config-next into ESM flat config
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

/**
 * ESLint Flat Config — Zehragn Project
 *
 * Strategy:
 * - eslint-config-next (CJS) is loaded via createRequire bridge
 * - @typescript-eslint/* packages are loaded natively (ESM-compatible)
 */

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  // Ignore build artifacts and config files
  {
    ignores: [".next/**", "node_modules/**", "scripts/**", "supabase/**"],
  },

  // Next.js core-web-vitals config (via CJS bridge)
  ...(Array.isArray(nextCoreWebVitals) ? nextCoreWebVitals : [nextCoreWebVitals]),

  // TypeScript source files
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      // Unused vars
      "@typescript-eslint/no-unused-vars": "off",
      // Consistent type imports
      "@typescript-eslint/consistent-type-imports": "off",
      // No implicit any
      "@typescript-eslint/no-explicit-any": "off",
      // No stray console.log in production
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // Prefer const
      "prefer-const": "error",
    },
  },
];

export default eslintConfig;
