const OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
    'prettier',
    'prettier/standard',
    'prettier/@typescript-eslint',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort', 'prettier'],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'prettier/prettier': ERROR,
    // ESLint rules
    'no-unneeded-ternary': ERROR,
    'no-underscore-dangle': OFF,
    'arrow-parens': [ERROR, 'as-needed'],
    'no-nested-ternary': OFF,
    'import/prefer-default-export': OFF,
    'import/extensions': [ERROR, 'never'],
    'import/no-unresolved': ERROR,
    'import/no-extraneous-dependencies': [
      ERROR,
      {
        devDependencies: true,
        packageDir: ['.', __dirname],
      },
    ],

    // Sorting rules
    'simple-import-sort/sort': ERROR,
    'sort-imports': OFF,
    'import/order': OFF,
    'import/first': ERROR,
    'import/newline-after-import': ERROR,
    'import/no-duplicates': ERROR,

    // TypeScript rules
    'no-unused-vars': 'off', // disable the native no-unused-vars so that only the TS one is enabled
    '@typescript-eslint/no-unused-vars': ERROR,
    '@typescript-eslint/explicit-function-return-type': OFF,
    '@typescript-eslint/no-explicit-any': [ERROR, { fixToUnknown: true }],
  },
};
