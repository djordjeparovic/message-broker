#!/bin/bash
# start services
ansible-playbook -i ansible/inventory ansible/warmup.yml
sleep 2 # wait for app to start
# test directory
cd test
# run mocha tests
../node_modules/mocha/bin/mocha all_tests.js || echo "ERROR running tests"
# stop/delete services
cd ..
ansible-playbook -i ansible/inventory ansible/cleanup.yml
