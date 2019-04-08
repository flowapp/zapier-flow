module.exports = {
  env: {
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 7,
  },
  plugins: [
    '@zapier/zapier'
  ],
  extends: [
    'plugin:@zapier/zapier/base'
  ],
  rules: {
    'indent': [ 'warn', 2 ],
    'linebreak-style': [ 'error', 'unix' ],
    'quotes': [ 'error', 'single' ],
    'no-console': [ 'error', { allow: [ 'warn', 'error' ] }],
  },
}
