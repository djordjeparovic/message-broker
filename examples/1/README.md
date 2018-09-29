# Run
* start the app docker container
* open a few terminal windows (tabs)
* start producer
```
BROKER_ENDPOINT='http://127.0.0.1:28080' node examples/1/producer.js
```
* start consumers
```
BROKER_ENDPOINT='http://127.0.0.1:28080' TOPIC='hello' node examples/1/consumer.js
```

[![Producer and Consumers Demo](http://img.youtube.com/vi/6QbjL1l28uk/0.jpg)](https://www.youtube.com/watch?v=6QbjL1l28uk "Producer and Consumers Demo")
