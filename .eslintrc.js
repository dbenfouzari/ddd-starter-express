const eslintPluginCustom = require("./eslint/eslint-plugin-custom");

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jsdoc/recommended",
    "plugin:jsdoc/recommended-typescript",
    "plugin:custom/recommended",
  ],
  overrides: [
    {
      files: ["**/*.test.ts"],
      extends: ["plugin:jest/all"],
      rules: {
        "jest/prefer-expect-assertions": "off",
        "jest/prefer-lowercase-title": ["error", { ignore: ["describe"] }],
        "jest/no-hooks": "off",
      },
    },
    {
      files: "./src/shared/infrastructure/Logger.ts",
      rules: {
        "custom/prefer-use-logger": "off",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint", "custom"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
      },
    ],
    "import/no-unresolved": "off",
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc" },
        groups: ["type", "builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
      },
    ],
    "jsdoc/check-tag-names": [
      "warn",
      {
        definedTags: ["openapi"],
      },
    ],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts"],
    },
    "import/resolver": {
      alias: true,
      typescript: {
        alwaysTryTypes: true,
        project: ["tsconfig.json"],
      },
      node: {
        extensions: [".ts"],
      },
    },
    jest: {
      version: require("jest/package.json").version,
    },
  },
};
