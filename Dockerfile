FROM node:8-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY *.js /usr/src/app/
COPY *.json /usr/src/app/
COPY src/ /usr/src/app/src/
COPY www/ /usr/src/app/www/

RUN ls /usr/src/app/

RUN cd www && \
    npm install && \
    npm run grunt && \
    cd ..

RUN npm install && \
    npm run grunt

EXPOSE 3000
CMD [ "node", "dist/server.js" ]