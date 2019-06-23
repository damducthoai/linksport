FROM node:8.16.0-jessie
RUN mkdir -p /usr/src/backend-handler
WORKDIR /usr/src/backend-handler

ADD ../backend-handler /usr/src/backend-handler
ADD ../backend-rpc /usr/src/backend-rpc
ADD ../backend-base /usr/src/backend-base

RUN cd /usr/src/backend-base
RUN npm install
RUN npm run build

RUN cd /usr/src/backend-rpc
RUN npm install
RUN npm run build

RUN cd /usr/src/backend-handler
RUN apt-get install libpq-dev g++ make
RUN npm install
RUN npm bundle

FROM node:8.16.0-alpine
RUN mkdir -p /usr/src/backend-handler
WORKDIR /usr/src/backend-handler
RUN npm install -g pg
COPY dist/backend_handler.js /usr/src/backend-handler/backend_handler.js
COPY config.json /usr/src/backend-handler/config.json
CMD [ "node", "backend_handler.js", "config.json"]