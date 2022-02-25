#!/bin/bash

if test $(docker ps | grep sebhtml | wc -l ) -gt 1
then
  docker kill $(docker ps | grep "sebhtml/file-explorer"|awk '{print $1}')
fi

# backend
cd backend
docker build . -t sebhtml/file-explorer-backend:v1
cd ..

# frontend
cd frontend
docker build . -t sebhtml/file-explorer-frontend:v1
cd ..

docker run -d -p 4000:4000 -v ~/BotpressHomework:/BotpressHomeworkProject sebhtml/file-explorer-backend:v1
docker run -d -p 3000:3000 sebhtml/file-explorer-frontend:v1

