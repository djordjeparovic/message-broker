
const pg = require('pg');
const queryMap = require('./query_map.js');

class Db {
  constructor(config) {
    this.db = new pg.Pool(config);
    this.db.on('error', e => logger.error(e.message));
    return this;
  }

  execute(text, values) {
    return this.db.connect()
      .then((client) => {
        let queryText = text;

        if (values && values.length) {
          for (let i = values.length - 1; i >= 0; i -= 1) {
            queryText = queryText.replace(new RegExp(`\\$${i + 1}`, 'g'), values[i]);
          }
        }

        logger.debug('postgres query: ', queryText.replace(/\n/g, ' ').replace(/\s+/g, ' '));
        return client.query(queryText)
          .then((res) => {
            client.release();
            return res.rows;
          })
          .catch((e) => {
            client.release();
            throw e;
          });
      });
  }

  action(type, values) {
    return this.execute(queryMap[type], values);
  }

  prepareSchema() {
    return this.execute(queryMap.prepare_schema);
  }

  listTopics() {
    return this.execute(queryMap.list_topics);
  }

  publish(topic, message, available) {
    return this.execute(queryMap.publish, [topic, message, available]);
  }

  fetch(topic, from, to) {
    logger.warn('Fetch called with', topic, from, to);
    return new Promise((resolve, reject) => {
      this.execute(queryMap.fetch[0], [topic, from, to])
        .then(() => this.execute(queryMap.fetch[1], [topic, from, to]))
        .then((resp) => {
          resolve(resp);
        })
        .catch(e => reject(e));
    });
  }

  getConsumerPosition(topic, consumerName) {
    return this.execute(queryMap.consumer_position, [topic, consumerName]);
  }

  updateConsumerTopicPosition(topic, consumerName, position) {
    return this.execute(queryMap.update_consumer_position, [topic, consumerName, position]);
  }

  getLatestPostition(topic) {
    return new Promise((resolve, reject) => {
      const qr = `select max(id) from topic_${topic};`;
      this.execute(qr)
        .then((res) => {
          if (res && res[0] && res[0].max) {
            resolve(res[0].max);
          } else {
            reject(new Error('last not found'));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  end() {
    return this.db.end();
  }
}

module.exports = Db;
