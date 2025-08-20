// ESLint v9 flat config for Attio-specific rules only
// Biome handles all other linting and formatting

const typescriptParser = require("@typescript-eslint/parser")
const attioRules = require("attio/lint")

module.exports = [
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      attio: {
        rules: attioRules.rules,
      },
    },
    rules: {
      // Only Attio-specific rules - these are critical for the platform
      "attio/attio-client-import": "error",
      "attio/server-default-export": "error",
      "attio/form-submit-button": "error",
      "attio/widget-text-children": "error",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    ignores: ["node_modules/", "dist/"],
  },
]
