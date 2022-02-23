FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install -g typescript
RUN cd src && tsc
RUN npm install
EXPOSE 2000
CMD ["node", "src/dist/index.js"]
