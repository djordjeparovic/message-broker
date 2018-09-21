const MBroker = require('../broker');

const mb = new MBroker();

module.exports = (req, res) => {
  mb.listTopics()
    .then(topics => res.json(topics))
    .catch((e) => {
      logger.error(e.message);
      res.code = 400;
      res.json({ status: 'fail', reqid: req.reqid });
    });
};
