FROM node:8.16.0-jessie as builder

RUN npm i webpack -g
RUN npm i webpack-cli -g

ADD backend-core /usr/src/backend-core
ADD backend-rpc /usr/src/backend-rpc
ADD backend-base /usr/src/backend-base

WORKDIR /usr/src/backend-base
RUN npm install
RUN npm run build

WORKDIR /usr/src/backend-rpc
RUN npm install
RUN npm run build

WORKDIR /usr/src/backend-core
RUN npm install
RUN npm run bundle

FROM node:8.16.0-alpine
RUN mkdir -p /usr/src/backend-core

COPY --from=builder /usr/src/backend-core/dist/backend_core.js /usr/src/backend-core/backend_core.js
COPY --from=builder /usr/src/backend-core/config.json /usr/src/backend-core/config.json
WORKDIR /usr/src/backend-core
EXPOSE 8888
CMD [ "node", "backend_core.js", "config.json"]