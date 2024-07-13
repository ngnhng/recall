/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@recall/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  ignorePatterns: ["tailwind.config.js", "postcss.config.js"],
  rules: {
    "no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      },
    ],
  },
};
