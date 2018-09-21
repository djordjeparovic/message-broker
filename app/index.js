
global.logger = require('tracer').colorConsole({
  format: '{"ts":"{{timestamp}}","type":"{{title}}","msg":"{{message}}","file":"{{file}}:{{line}}"}',
  dateformat: 'mmm dd yy HH:MM:ss',
  level: process.env.LOGLEVEL || 'info',
});
const restify = require('restify');
const config = require('../config.js');
const routes = require('./router.js');
const MBroker = require('./broker');

const mb = new MBroker(config.mbroker);
logger.info('Message Broker ready:', mb.ready);

const app = restify.createServer(config.restify);
app.use(restify.plugins.bodyParser({
  mapParams: true,
}));

app.on('pre', require('./middlewares'));

routes.forEach((route) => {
  // eslint-disable-next-line
  app[route.method](route.path, require(`./controllers/${route.controller}`));
});

app.listen(config.restify.port, () => {
  logger.info('%s listening at %s', app.name, app.url);
});
