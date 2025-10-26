// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
  // ignora carpetas de build y dependencias
  { ignores: ["dist/**", "node_modules/**"] },

  // configs recomendados
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // reglas/overrides aplicadas SOLO a src
  {
    files: ["src/**/*.{ts,tsx,js,mjs,cjs}"],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },

    linterOptions: {
      reportUnusedDisableDirectives: true,
    },

    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];
