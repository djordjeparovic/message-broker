const axios = require('axios');

const broker = process.env.BROKER_ENDPOINT;
const myTopic = process.env.TOPIC;
const consumerId = process.env.CONSUMER_NAME || 'mbExample002';

const readAndProcess = () => {
  axios.get(`${broker}/fetch/${myTopic}/${consumerId}/last_read`)
    .then((res) => {
      process.stdout.write('.');
      if (res && res.data && res.data.length) {
        console.log('\nGot message:');
        console.log(res.data);
      }
    })
    .catch(e => console.log(`Error reading message: ${e.message}`));
};

setInterval(readAndProcess, 1000);
