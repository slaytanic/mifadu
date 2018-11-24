const proxy = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(proxy('/graphql', { target: 'http://localhost:3001/' }));
  app.use(proxy('/auth', { target: 'http://localhost:3001/' }));
  app.use(proxy('/assignments/download', { target: 'http://localhost:3001/' }));
};
