FROM node:8-alpine

ADD  backend-base /usr/src/backend-base
WORKDIR /usr/src/backend-base
RUN npm install

ADD  backend-rpc /usr/src/backend-rpc
WORKDIR /usr/src/backend-rpc
RUN npm install

ADD  backend-core /usr/src/backend-core
WORKDIR /usr/src/backend-core
RUN npm install

EXPOSE 8888
CMD [ "npm", "start" ]