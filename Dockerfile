#DEPENDENCY IMAGE
from node:18.17.1-slim

RUN apt-get update
RUN apt-get install git -y
ENV NODE_OPTIONS=--max-old-space-size=8128

WORKDIR pomodoro
COPY package.json package.json
RUN npm install -g npm
RUN npm install -g @angular/cli
RUN npm i -g @angular/core
RUN npm install
RUN rm package.json
RUN rm package-lock.json
