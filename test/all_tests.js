
const assert = require('assert');
const axios = require('axios');

const appendpoint = 'http://127.0.0.1:28080';

describe('/list_topics', () => {
  it('should retrieve all topics', (done) => {
    axios(`${appendpoint}/list_topics`)
      .then((res) => {
        console.log(res.data);
        assert.equal(res.data.length, 1);
        done();
      })
      .catch((e) => {
        done(e);
      });
  });
});
