FROM node:16
WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install -g react
RUN npm install -g typescript
RUN npm install -g serve

COPY . ./
RUN tsc
RUN npm run build

EXPOSE 3000
CMD ["serve", "-s", "build"]

