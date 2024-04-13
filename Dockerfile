#DEPENDENCY IMAGE
from node:18.17.1-slim

RUN apt-get update
RUN apt-get install git -y
WORKDIR pomodoro
COPY package.json package.json
RUN export NODE_OPTIONS="--max-old-space-size=8128"
RUN npm install -g npm
RUN npm install -g @angular/cli
RUN npm i -g @angular/core
RUN npm install
