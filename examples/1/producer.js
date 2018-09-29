
const axios = require('axios');
const prompt = require('prompt');

const broker = process.env.BROKER_ENDPOINT;

prompt.start();

const readMessage = () => new Promise((resolve, reject) => {
  prompt.get(['topic', 'message'], (err, input) => {
    if (err) {
      reject(err);
      return;
    }

    const url = `${broker}/publish/${input.topic}`;
    // console.log(url);

    axios({
      method: 'post',
      url,
      data: {
        msg: input.message,
      },
    })
      .then((res) => {
        console.log('Message sent!\n');
        resolve(res);
      })
      .catch((e) => {
        reject(e);
      });
  });
});

async function readMessages() {
  while (true) {
    // eslint-disable-next-line
    await readMessage();
  }
}

axios.get(`${broker}/list_topics`)
  .then(r => new Promise((resolve) => {
    console.log('Available topics are:');
    console.log(r.data);
    resolve(r);
  }))
  .then(() => readMessages())
  .catch((e) => {
    console.error(e.message);
  });
