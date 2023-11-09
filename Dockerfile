FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g typescript

RUN npm install

COPY . .

RUN tsc

EXPOSE 8643

CMD [ "node", "dist/index.js" ]