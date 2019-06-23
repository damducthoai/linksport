FROM node:8-alpine
RUN mkdir -p /usr/src/backend-handler
WORKDIR /usr/src/backend-handler
RUN npm install -g pg
COPY dist/backend_handler.js /usr/src/backend-handler/backend_handler.js
COPY config.json /usr/src/backend-handler/config.json
CMD [ "node", "backend_handler.js", "config.json"]