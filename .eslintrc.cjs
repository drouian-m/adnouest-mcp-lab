module.exports = {
  extends: ["@mgdis/eslint-config-typescript"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.eslint.json"],
  },
  rules: {
    "@typescript-eslint/ban-ts-comment": "off",
    "unicorn/prefer-event-target": "off",
  },
};
