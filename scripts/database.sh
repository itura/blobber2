#!/usr/bin/env bash

if [ ! "$(docker ps -a -q -f name=blobber2)" ]; then
    echo "Pulling postgres:10.4"
    docker pull postgres:10.4
    echo "Starting blobber2 postgres"
    docker run --name blobber2 -p 5432:5432 -d postgres:10.4
else
    echo "Container blobber2 already present, starting it.."
    docker start blobber2
fi
