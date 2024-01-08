#!/bin/bash

npm run build

docker stop vue

docker rm vue

docker rmi vue::latest

docker build -t vue .

sduo docker run -d -p 80:80 --name vue vue:latest
