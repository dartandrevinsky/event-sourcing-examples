#! /bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

ORIGINAL_DIR=$(pwd)

DOCKER_COMPOSE="docker-compose -p event-sourcing-examples"

if [ "$1" = "-f" ] ; then
  shift;
  DOCKER_COMPOSE="$DOCKER_COMPOSE -f ${1?}"
  shift
fi

if [ "$1" = "--use-existing" ] ; then
  shift;
else
  ${DOCKER_COMPOSE?} stop
  ${DOCKER_COMPOSE?} rm -v --force
fi

NO_RM=false

if [ "$1" = "--no-rm" ] ; then
  NO_RM=true
  shift
fi

JS_TESTS_RUN=false

if [ "$1" = "--run-js-tests" ] ; then
  JS_TESTS_RUN=true
  shift
fi

${DOCKER_COMPOSE?} up -d mongodb $EXTRA_INFRASTRUCTURE_SERVICES

if [ -z "$DOCKER_HOST_IP" ] ; then
  if which docker-machine >/dev/null; then
    export DOCKER_HOST_IP=$(docker-machine ip default)
  else
    export DOCKER_HOST_IP=localhost
 fi
 echo set DOCKER_HOST_IP $DOCKER_HOST_IP
fi

if [ -z "$SPRING_DATA_MONGODB_URI" ] ; then
  export SPRING_DATA_MONGODB_URI=mongodb://${DOCKER_HOST_IP?}/mydb
  echo Set SPRING_DATA_MONGODB_URI $SPRING_DATA_MONGODB_URI
fi

export SERVICE_HOST=$DOCKER_HOST_IP
export SERVICE_PORT=8080

./gradlew $* build -x :e2e-test:test

if [ -z "$EVENTUATE_API_KEY_ID" -o -z "$EVENTUATE_API_KEY_SECRET" ] ; then
  echo You must set EVENTUATE_API_KEY_ID and  EVENTUATE_API_KEY_SECRET
  exit -1
fi


${DOCKER_COMPOSE?} up -d

$DIR/wait-for-services.sh $DOCKER_HOST_IP 8080 8081 8082

set -e

./gradlew -a $* :e2e-test:cleanTest :e2e-test:test -P ignoreE2EFailures=false

if [ $JS_TESTS_RUN = true] ; then
  cd $DIR/js-frontend
  rm -r ./reports/

  npm i
  npm run e2e-setup

  xvfb-run --server-args="-screen 0 1600x1200x24" nightwatch

  cd $ORIGINAL_DIR
fi

if [ $NO_RM = false ] ; then
  ${DOCKER_COMPOSE?} stop
  ${DOCKER_COMPOSE?} rm -v --force
fi
