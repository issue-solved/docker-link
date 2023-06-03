FROM node:14-alpine

WORKDIR /app

COPY package.json .

RUN apk update \
    && apk add --no-cache --virtual .my-build-deps make gcc g++ python3 py3-pip \
    && npm config set unsafe-perm true \
    && npm install -g node-gyp \
    && npm install --production \
    && npm uninstall node-gyp -g \
    && npm uninstall npm -g \
    && apk del .my-build-deps

EXPOSE 3000

CMD [ "/usr/local/bin/node", "/app/index.js" ]
