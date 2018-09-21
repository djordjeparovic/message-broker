
module.exports = [
  {
    method: 'post',
    path: '/publish/:topic',
    controller: 'publish.js',
  },
  {
    method: 'post',
    path: '/publish/:topic/:mode',
    controller: 'publish.js',
  },
  {
    method: 'get',
    path: '/fetch/:topic',
    controller: 'fetch.js',
  },
  {
    method: 'get',
    path: '/fetch/:topic/:consumer_name/:mode',
    controller: 'fetch.js',
  },
  {
    method: 'get',
    path: '/list_topics',
    controller: 'list_topics.js',
  },
];
