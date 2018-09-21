
const MBroker = require('../broker');

const mb = new MBroker();

module.exports = (req, res) => {
  // /fetch/:topic/:consumer_name/:mode
  if (req.params.consumer_name && req.params.mode) {
    mb.fetchPersonalized(req.params.topic, req.params.consumer_name, req.params.mode)
      .then(messages => res.json(messages))
      .catch((e) => {
        logger.error(e.message);
        res.code = 400;
        res.json({ status: 'fail', reqid: req.reqid });
      });
  // /fetch/:topic
  } else {
    mb.fetch(req.params.topic)
      .then((messages) => {
        logger.warn(messages);
        res.json(messages);
      })
      .catch((e) => {
        logger.error(e.message);
        res.code = 400;
        res.json({ status: 'fail', reqid: req.reqid });
      });
  }
};
