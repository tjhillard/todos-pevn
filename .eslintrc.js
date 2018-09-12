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
    'no-unused-vars': ['error', { args: 'none' }],
    'arrow-body-style': 'off',
    'consistent-return': 'off',
    'array-callback-return': 'off',
    'prefer-destructuring': ['error', { array: false }],
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'no-param-reassign': 'off',
    'max-len': ['error', { 'code': 120 }],
    'arrow-parens': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
