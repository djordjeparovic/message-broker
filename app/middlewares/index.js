
const rs = require('randomstring');
const MBroker = require('../broker');

const mb = new MBroker();

module.exports = (req, res) => {
  req.startedAt = new Date();
  req.reqid = rs.generate({ charset: 'alphanumeric', length: 5 });
  logger.info(`${req.method}|path:${req.getPath()}|params:${JSON.stringify(req.params)}|query:${req.getQuery()}|reqid:${req.reqid}`);
  if (!mb.ready) {
    res.code = 503;
    res.json({
      error: 'Broker not ready',
    });
  }
};
