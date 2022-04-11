/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  env: {
    browser: true,
    node: true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "simple-import-sort"],
  extends: ["airbnb", "airbnb-typescript", "plugin:react/jsx-runtime", "prettier"],
  parserOptions: { project: "./tsconfig.json" },
  rules: {
    "import/extensions": [
      "error",
      {
        ts: "never",
        tsx: "never",
        css: "always",
        json: "always",
      },
    ],
    "sort-vars": ["error", { ignoreCase: false }],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
  ignorePatterns: [
    "node_modules",
    "dist",
    "src/generated",
    ".parcel-cache",
    ".eslintrc.js",
    "*.js",
  ],
};
