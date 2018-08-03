FROM node:8-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY VERSION /usr/src/app/
COPY *.js /usr/src/app/
COPY *.json /usr/src/app/
COPY res/ /usr/src/app/res/
COPY src/ /usr/src/app/src/
RUN apk add --no-cache --virtual .build-deps python make g++ && \
    npm install && \
    npm run build-prod && \
    rm -rf www/node_modules && \
    apk del .build-deps
EXPOSE 3000
CMD [ "node", "dist/server.js" ]