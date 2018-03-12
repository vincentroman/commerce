# Workaround for segfault in bcrypt
# See: https://github.com/kelektiv/node.bcrypt.js/issues/528
FROM node:8-alpine as bcrypt_builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN npm init -f
RUN npm install bcrypt@1.0.3 --save
RUN apk update && \
    apk add python make g++
RUN npm rebuild bcrypt --build-from-source

FROM node:8-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY VERSION /usr/src/app/
COPY *.js /usr/src/app/
COPY *.json /usr/src/app/
COPY res/ /usr/src/app/res/
COPY src/ /usr/src/app/src/
COPY www/ /usr/src/app/www/
RUN npm install && \
    npm run build-prod && \
    rm -rf www/node_modules
COPY --from=bcrypt_builder /usr/src/app/node_modules/bcrypt /usr/src/app/node_modules/bcrypt
EXPOSE 3000
CMD [ "node", "dist/server.js" ]