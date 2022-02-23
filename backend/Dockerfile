FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install -g typescript
RUN tsc
RUN npm install
EXPOSE 4000
RUN rm -f src/*.ts src/*.tsx
CMD ["node", "src/index.js"]

