FROM node:16
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install -g typescript
RUN npm install -g cors
RUN npm install -g express

COPY . ./
RUN tsc

EXPOSE 4000
CMD ["node", "src/index.js"]

