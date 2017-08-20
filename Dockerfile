FROM node:8-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY *.js /usr/src/app/
COPY *.json /usr/src/app/
COPY res/ /usr/src/app/res/
COPY src/ /usr/src/app/src/
COPY www/ /usr/src/app/www/

RUN ls /usr/src/app/

RUN npm install && \
    npm run build-prod

# Workaround for segfault in bcrypt
# See: https://github.com/kelektiv/node.bcrypt.js/issues/528
RUN apk update && \
    apk add python make g++
RUN npm rebuild bcrypt --build-from-source

EXPOSE 3000
CMD [ "node", "dist/server.js" ]