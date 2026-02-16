const bootstrap = require('../dist/serverless');

let handler;

module.exports = async (req, res) => {
  if (!handler) {
    const app = await bootstrap.default();
    handler = app;
  }
  return handler(req, res);
};
