FROM node:8.16.0-jessie as builder

RUN npm i webpack -g
RUN npm i webpack-cli -g

RUN apt-get install libpq-dev g++ make  gcc
RUN npm i node-gyp -g --unsafe
RUN npm i pg-native -g --unsafe

ADD backend-handler /usr/src/backend-handler
ADD backend-rpc /usr/src/backend-rpc
ADD backend-base /usr/src/backend-base

WORKDIR /usr/src/backend-base
RUN npm install
RUN npm run build

WORKDIR /usr/src/backend-rpc
RUN npm install
RUN npm run build

WORKDIR /usr/src/backend-handler
RUN npm install
RUN npm run bundle

FROM node:8.16.0-alpine
RUN mkdir -p /usr/src/backend-handler

COPY --from=builder /usr/src/backend-handler/dist/backend_handler.js /usr/src/backend-handler/backend_handler.js
COPY --from=builder /usr/src/backend-handler/config.json /usr/src/backend-handler/config.json
WORKDIR /usr/src/backend-handler
CMD [ "node", "backend_handler.js", "config.json"]