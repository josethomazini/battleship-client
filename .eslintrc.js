module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': 'off',
    'no-new': 'off',
    'class-methods-use-this': 'off',
    'import/no-unresolved': [2, { ignore: ['.wav$', '.png$', '.webp$', '.jpg$'] }],
  },
};
