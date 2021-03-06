module.exports = {
  extends: 'airbnb-base',
  rules: {
    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-underscore-dangle': ['error', { allow: ['_id', '_user'] }],
  },
};
