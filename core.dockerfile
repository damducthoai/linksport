FROM node:8

ADD  backend-base /usr/src/backend-base
WORKDIR /usr/src/backend-base
RUN npm install
RUN npm build

ADD  backend-rpc /usr/src/backend-rpc
WORKDIR /usr/src/backend-rpc
RUN npm install
RUN npm build

ADD  backend-core /usr/src/backend-core
WORKDIR /usr/src/backend-core
RUN npm install
RUN npm build

EXPOSE 8888
CMD [ "npm", "start" ]