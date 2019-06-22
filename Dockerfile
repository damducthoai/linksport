FROM node:8-alpine
WORKDIR /usr/src/backend-core
RUN mkdir -p /usr/src/backend-core/lib
COPY ./backend-base /usr/src/
COPY ./backend-rpc /usr/src/
RUN cd  /usr/src/backend-base && npm install && npm run build
RUN cd  /usr/src/backend-rpc && npm install && npm run build
COPY ./backend-core/package.json ./
RUN npm install
COPY ./backend-core .
EXPOSE 8888
CMD [ "npm", "start" ]