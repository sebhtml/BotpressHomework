FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install -g typescript
RUN tsc
RUN npm install
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]

