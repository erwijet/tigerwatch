#!/bin/bash

if ! command -v docker &> /dev/null; then
  snap install docker
fi

DOCKER_PROC=$(docker ps -f "ancestor=tigerwatch/caroline:latest" --format "{{.ID}}")

if ! [ -z "$DOCKER_PROC" ]; then
    docker kill "$DOCKER_PROC"
    docker container rm "$DOCKER_PROC"
fi

docker build . -t tigerwatch/caroline:latest
docker run -d --name tigerwatch-caroline --publish 443:443 tigerwatch/caroline
