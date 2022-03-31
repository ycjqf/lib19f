module.exports = {
  env: {
    browser: true,
    node: true,
  },
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  ignorePatterns: [
    "node_modules",
    "dist",
    "docs",
    ".parcel-cache",
    ".eslintrc.js",
    "tailwind.config.js",
  ],
};
