#!/bin/sh

APP_NAME = data-sync-server

RELEASE_TAG ?= $(CIRCLE_TAG)

DOCKER_LATEST_TAG = aerogear/$(APP_NAME):latest
DOCKER_RELEASE_TAG = aerogear/$(APP_NAME):$(RELEASE_TAG)

docker login --username $(DOCKERHUB_USERNAME) --password $(DOCKERHUB_PASSWORD)
docker push $(DOCKER_LATEST_TAG)
docker push $(DOCKER_RELEASE_TAG)
