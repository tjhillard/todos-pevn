module.exports = {
  root: true,
  env: {
    node: true,
    jasmine: true,
  },
  globals: {
    test: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-body-style': 'off',
    'consistent-return': 'off',
    'array-callback-return': 'off',
    'prefer-destructuring': ['error', {'array': false}],
    'class-methods-use-this': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
