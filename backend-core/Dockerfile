FROM node:8
RUN mkdir -p /usr/src/backend-core
WORKDIR /usr/src/backend-core
COPY dist/backend_core.js /usr/src/backend-core/backend_core.js
COPY config.json /usr/src/backend-core/config.json
EXPOSE 8888
CMD [ "node", "backend_core.js", "config.json"]