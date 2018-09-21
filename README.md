# How to run
## Dockerized
Assume:
* your cwd is project root, ie. message-broker/
* you have ansible-playbook
```
- To install docker, pull image... ie. first time run
ansible-playbook -i ansible/inventory ansible/setup.yml

- To start processes
ansible-playbook -i ansible/inventory ansible/warmup.yml

- To delete postgres container (and data because there is not attached volume)
ansible-playbook -i ansible/inventory ansible/cleanup.yml
```
For control over postgres only pass --tags "postgres"

## Bare metal
* Configure local postgresql, and run
```
PGHOST=127.0.0.1 PGPORT=65432 node app/index.js
```

## Try it out
28080 port points to docker container, but 8080 port is default application port (if ran without container)
```
# get list of available topics
curl 127.0.0.1:28080/list_topics
# publish some messages
curl -X POST -H "Content-Type: application/json" -d '{"command":"copy", "type": "dwh-to-s3", "dir":"/srv/data/2018/09/21/16/items.tsv"}' '127.0.0.1:28080/publish/data_normalization_jobs'
# consume messages
curl '127.0.0.1:28080/fetch/data_normalization_jobs/worker1/last_read'
```

# Test
Run script which will setup environment and run tests
```
./test/run.sh
```
There is alternative and more popular way
```
npm run test
```

# Env vars
* LOGLEVEL - passed to npmjs.com/package/tracer module as (debug|info|warn|error)
* PGHOST - passed to npmjs.com/package/pg, all below related to db connection
* PGPORT
* PGUSER
* PGDATABASE
* PGPASSWORD
* APP_PORT - passed to restify server
* APP_NAME - passed to restify server

# Troubleshoot
All commands are supposed to be ran on your machine not inside container
## Versions
* pip 18.0
* ansible-playbook 2.5.4
* node v10.10.0
* psql (PostgreSQL) 10.4

## Check if postgres is configured
```
PGPASSWORD='bWJyb2tlcl91c2VyCg==' psql -h 127.0.0.1 -p 65432 -U mbroker_user -d mbroker -c "select 1;"
```

## docker-py
```
pip install --ignore-installed docker-py --user
# ensure local pip path added in $PATH
```
## Ansible wait_for
```
pip install --ignore-installed psutil --user
```

# TODO
* clean params to prevent sql injection
* use postgres listen/notify for bi-directoinal rest communication (webhooks)
* make fetch real atomic
* rewrite queries to use `with` instead of transactions isolation
