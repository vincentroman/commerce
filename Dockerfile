FROM node:8-alpine
# Packages needed for compiling bcrypt
RUN apk add --no-cache python make g++
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
EXPOSE 3000
CMD [ "node", "dist/server.js" ]