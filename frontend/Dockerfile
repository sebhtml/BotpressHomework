FROM node:16
WORKDIR /usr/src/app
COPY . .
RUN npm install -g typescript
RUN tsc
RUN npm install
EXPOSE 3000
RUN rm src/*.ts src/*.tsx
RUN sed -i 's=./App=./App.js=g' src/index.js
RUN sed -i 's=./reportWebVitals=./reportWebVitals.js=g' src/index.js
CMD ["npm", "start"]

