FROM node:16
WORKDIR /usr/src/app
RUN mkdir /BotpressHomeworkProject

COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install -g typescript
RUN npm install -g cors
RUN npm install -g express

COPY . ./
RUN tsc

EXPOSE 4000

CMD ["node", "src/index.js", "/BotpressHomeworkProject/backend", "/BotpressHomeworkProject/frontend", "/proc", "./src", "/sys", "/etc"]

