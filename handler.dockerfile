FROM node:8

ADD  backend-base /usr/src/backend-base
WORKDIR /usr/src/backend-base
RUN npm install
RUN npm build


ADD  backend-rpc /usr/src/backend-rpc
WORKDIR /usr/src/backend-rpc
RUN npm install
RUN npm build

ADD  backend-handler /usr/src/backend-handler
WORKDIR /usr/src/backend-handler
RUN npm install
RUN npm build

CMD [ "npm", "start" ]