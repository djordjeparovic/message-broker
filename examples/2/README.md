# Multiplex demo
Ability to choose how many consumers can read the message.

* start the app docker container
* open a few terminal windows (tabs)
* start producer
```
BROKER_ENDPOINT='http://127.0.0.1:28080' node examples/2/producer.js
```
* start consumers
Since consumer is identified by its name, it's necessary to provide different names for different consumers.
```
BROKER_ENDPOINT='http://127.0.0.1:28080' TOPIC='hello' CONSUMER_NAME='one' node examples/2/consumer.js
```

[![Producer and Consumers Multiplex Demo](http://img.youtube.com/vi/JGlAbay93XU/0.jpg)](https://www.youtube.com/watch?v=JGlAbay93XU "Producer and Consumers Multiplex Demo")
