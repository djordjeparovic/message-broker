
const Db = require('./db.js');

let instance;
const MessageBroker = function MessageBroker(config) {
  if (instance) {
    return instance;
  }

  instance = this;
  this.ready = false;
  this.db = new Db(config.db);
  this.db.prepareSchema()
    .then(() => {
      this.ready = true;
      logger.debug('Broker ready');
    })
    .catch((e) => {
      logger.error('Broker initialization error', e.message);
      this.close();
    });

  this.publish = (topic, message, mode) => {
    const multiplex = mode || 1;
    return this.db.publish(topic, message, multiplex);
  };

  this.fetch = topic => this.db.getLatestPostition(topic)
    .then(position => this.db.fetch(topic, 0, position))
    .catch(e => Promise.reject(e));

  this.fetchPersonalized = (topic, consumerName, mode) => {
    // if (mode === 'from_beginning' && consumerName) {
    //   let latest;

    //   return this.db.getLatestPostition(topic)
    //     .then((lat) => {
    //       latest = lat;
    //       return this.db.updateConsumerTopicPosition(topic, consumerName, latest);
    //     })
    //     .then(() => this.db.fetch(topic, 0, latest));
    // }

    if (mode === 'last_read' && consumerName) {
      // step should come from req.query.last to decide how many last messages should be fetched
      const step = 1;
      let lastConsumerPosition;
      let latestTopicPosition;
      let data;
      return new Promise((resolve, reject) => {
        this.db.getConsumerPosition(topic, consumerName)
          .then((rows) => {
            if (rows && rows[0]) {
              lastConsumerPosition = rows[0].topic_position;
            } else {
              lastConsumerPosition = 0;
            }
            return this.db.getLatestPostition(topic);
          })
          .then((lat) => {
            latestTopicPosition = lat;
            logger.warn('Latest position', latestTopicPosition);
            return this.db.fetch(topic, lastConsumerPosition, latestTopicPosition);
          })
          .then((d) => {
            data = d;
            const increment = lastConsumerPosition + step > latestTopicPosition
              ? latestTopicPosition - lastConsumerPosition : step;
            this.db.updateConsumerTopicPosition(topic, consumerName,
              lastConsumerPosition + increment);
          })
        /* in fetch(topic, lastConsumerPosition, latest):latest is ok,
        cause some messages may be unavailable */
          .then(() => {
            resolve(data);
          })
          .catch((e) => {
            logger.error(e.message);
            reject(e);
          });
      });
    }

    return Promise.reject(new Error('not implemented'));
  };

  this.listTopics = () => this.db.listTopics();

  this.close = () => {
    this.ready = false;
    this.db.end()
      .then(() => logger.info('broker closed'));
  };

  return this;
};

module.exports = MessageBroker;
