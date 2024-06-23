/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@hikari/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  ignorePatterns: [
    "dist",
    "node_modules",
    "tailwind.config.js",
    "postcss.config.js",
  ],
  parserOptions: {
    project: "./tsconfig.lint.json",
    tsconfigRootDir: __dirname,
  },
};
