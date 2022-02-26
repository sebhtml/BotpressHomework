# BotpressHomework: the solution you need for the problems you don't have yet !

BotpressHomework (abbreviated "BH" thereafter) is an unique and innovative cloud-scale solution
for watching your directories in the confort of a tab in your web browser.

BH is developed with love on Debian GNU/Linux 11 (bullseye) using vim, docker, and Google Search.

# REST API

| *Resource* | *URN (Uniform Resource Name)* | *HTTP verb* | *Note* | *Description* |
| --- | --- | --- | --- | --- |
| Directory | `/directories` | GET | Get list of directories. | This list contains directories passed as command-line argument when starting the backend. |
| Directory | `/directories/{directory}` | GET | Get content of a directory. | Return directory content |
| Directory | `/directories/{directory}/watch` | POST | Add a directory to the watch list. | Idempotent if the same directory is watched many times. |
| Directory | `/events`             | GET  | Get events for directory changes | Supports many subscribers. Uses Server-Sent Events (SSE) |
| Directory | `/directories/{directory}/watch` | GET | Watch changes in a directory using server sent events (SSE).  | Deprecated ! Most web browsers allow for a few persistent connections. Firefox 91.6.0esr has max-persistent-connections of 6 by default) |


# Building instructions (with Docker)

```bash
# get the source !
git clone https://github.com/sebhtml/BotpressHomework.git
cd BotpressHomework

# backend
cd backend
docker build . -t sebhtml/file-explorer-backend:v1
cd ..

# frontend
cd frontend
docker build . -t sebhtml/file-explorer-frontend:v1
cd ..

cd ..

# Start containers

docker run -d -p 4000:4000 \
        -v ~/BotpressHomework:/BotpressHomeworkProject \
        sebhtml/file-explorer-backend:v1
docker run -d -p 3000:3000 sebhtml/file-explorer-frontend:v1
firefox http://localhost:3000/
```

# Building and Running instructions (without Docker)

Backend

```bash
cd backend
npm install
tsc
node src/index.js  ~/BotpressHomework ~/Pictures /etc
```

Frontend

```bash
cd frontend
npm install
tsc
npm start
```

# Features

BH has the following extraordinary features that every venture capitalist is looking for:
- [x] simple to understand
- [x] tricky
- [x] quite vague
- [x] on purpose
- [x] use your creativity
- [x] manage your time
- [x] description of your solution
- [x] building instructions
- [x] running instructions
- [x] vs-code like
- [x] file explorer tree view
- [x] multiple collapsible sections
- [x] program needs to take as an argument one or multiple paths to local directories
- [x] Each directory needs to be represented as an independent section in the rendered file explorer
- [x] When a file on the host is deleted, added, removed or renamed within one of the specified directories, changes should be reflected in the rendered file explorer.
- [x] The file explorer component should be rendered in a web browser
- [x] Solution Quality
- [x] Code quality
- [x] Creativity / Elegance / Cleverness

