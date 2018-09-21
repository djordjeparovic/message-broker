
const MBroker = require('../broker');

const mb = new MBroker();

module.exports = (req, res) => {
  const message = JSON.stringify(req.body);
  logger.info(req.params, message);
  mb.publish(req.params.topic, message, req.params.mode)
    .then(() => {
      res.json({ status: 'ok' });
    })
    .catch((e) => {
      logger.error(e && e.message);
      res.code = 503;
      res.json({ status: 'fail', reqid: req.reqid });
    });
};
