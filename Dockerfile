FROM node:16-alpine

WORKDIR /app
COPY package*.json ./

RUN apk add --no-cache --virtual .gyp python3 make g++ \
    && npm ci --only=production \
    && apk del .gyp

COPY . .

CMD ["node", "src/app.js"]