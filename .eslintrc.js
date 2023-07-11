/** @type {import("eslint").ESLint} */

module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true, jest: true },
  plugins: ["@typescript-eslint", "jest"],
  extends: ["eslint:recommended", "standard-with-typescript", "prettier"],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/method-signature-style": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "react/prop-types": "off",
    "@typescript-eslint/consistent-type-imports": "off",
    "react/no-unescaped-entities": "off",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json",
    tsConfigRootDir: __dirname
  }
}
