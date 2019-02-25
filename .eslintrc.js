module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "global-require": 0,
    "no-param-reassign": 0,
    "import/no-unresolved": 0,
    "no-shadow": 0,
    "import/extensions": 0,
    "import/newline-after-import": 0,
    "no-multi-assign": 0,
    "no-unused-expressions": ["error", { "allowTernary": true }],
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
  },
};
