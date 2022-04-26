FROM node:16.14-slim

WORKDIR /usr/src/app

COPY package-lock.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start"]
