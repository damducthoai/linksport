FROM node:8

ADD  backend-base /usr/src/backend-base
WORKDIR /usr/src/backend-base
RUN rm -rf lib
RUN npm install
RUN npm run build


ADD  backend-rpc /usr/src/backend-rpc
WORKDIR /usr/src/backend-rpc
RUN rm -rf lib
RUN npm install
RUN npm run build

ADD  backend-handler /usr/src/backend-handler
WORKDIR /usr/src/backend-handler
RUN rm -rf lib
RUN npm install
RUN npm run build

CMD [ "npm", "start" ]