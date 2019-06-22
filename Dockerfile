FROM node:8-alpine

WORKDIR /usr/src/backend-core

ADD  backend-base /usr/src/backend-base
ADD  backend-rpc /usr/src/backend-rpc
ADD  backend-core /usr/src/backend-core

RUN cd /usr/src/backend-base
RUN npm install
RUN npm run build

RUN cd  /usr/src/backend-rpc
RUN npm install
RUN npm run build

RUN cd  /usr/src/backend-core
RUN npm install
RUN npm run build


EXPOSE 8888
CMD [ "npm", "start" ]