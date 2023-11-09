FROM node:latest

RUN apt-get update

RUN apt-get install -y python3 python3-pip ffmpeg

RUN rm -rf /var/lib/apt/lists/

RUN pip3 install --no-cache-dir --break-system-packages yt-dlp

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g typescript

RUN npm install

COPY . .

RUN tsc

EXPOSE 8643

CMD [ "node", "dist/index.js" ]

