#!/bin/bash

sudo npm run build

sudo docker stop vue

sduo docker rm vue

sudo docker rmi vue::latest

sudo docker build -t vue::latest .

sduo docker run -d -p 80:80 --name vue vue:latest
