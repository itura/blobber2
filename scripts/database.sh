#!/usr/bin/env bash
#
# Manage Postgres 10.4 dev database using Docker.
#
# Usage: $ ./database.sh [shell|remove|clean]
#   - Running without a command will install the image and
#       create the container, or start it if it is already there.
#   - Commands:
#       - shell: runs psql and points it at the dev db
#       - remove: remove the container
#       - clean: remove the container and the postgres image
#

CONTAINER_NAME=blobber2-pg
PG_IMAGE_NAME=postgres:10.4

if [ "$1" == "shell" ]; then
    docker exec -it $CONTAINER_NAME \
        psql -h localhost -U blobber
    exit 0
fi

remove() {
    echo "* Stopping $CONTAINER_NAME"
    docker stop $CONTAINER_NAME

    echo "* Removing $CONTAINER_NAME"
    docker rm $CONTAINER_NAME
}

if [ "$1" == "remove" ]; then
    remove

    exit 0
fi

if [ "$1" == "clean" ]; then
    remove

    echo "* Removing image $PG_IMAGE_NAME"
    docker rmi $PG_IMAGE_NAME

    exit 0
fi

if [ ! "$(docker ps -a -q -f name=blobber2)" ]; then
    echo "* Pulling image $PG_IMAGE_NAME"
    docker pull $PG_IMAGE_NAME

    echo "* Creating blobber2 postgres"
    docker run \
        --name $CONTAINER_NAME \
        -p 5432:5432 \
        -e POSTGRES_USER=blobber \
        -e POSTGRES_DB=blobber \
        -d $PG_IMAGE_NAME
else
    echo "* Container blobber2 already present, starting it.."
    docker start $CONTAINER_NAME
fi
