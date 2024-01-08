#!/bin/bash

git pull https://github.com/linhe-demo/vue-album.git

npm run build

docker stop vue

docker rm vue

docker rmi vue:latest

docker build -t vue .

docker run -d -p 80:80 --name vue vue:latest
