FROM node:16-alpine

WORKDIR /
COPY package.json .

RUN apk add --no-cache --virtual .gyp python3 make g++ \
    && npm install \
    && apk del .gyp

WORKDIR /app
COPY . .

CMD ["npm", "run", "start"]