# BotpressHomework: the solution you need for the problems you don't have yet !

BotpressHomework (abbreviated "BH" thereafter) is an unique and innovative cloud-scale solution
for watching your directories in the confort of a tab in your web browser.

BH is developed with love on Debian GNU/Linux 11 (bullseye) using vim, docker, and Google Search.

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
- [ ] When a file on the host is deleted, added, removed or renamed within one of the specified directories, changes should be reflected in the rendered file explorer.
- [x] The file explorer component should be rendered in a web browser
- [x] Solution Quality
- [x] Code quality
- [x] Creativity / Elegance / Cleverness

# REST API

| *Resource* | *URN (Uniform Resource Name)* | *HTTP verb* | *Description* |
| Directory | `/directories | GET | Get list of directories. |
| Directory | `/directories/{directory} | GET | Get content of a directory. |
| Directory | `/directories/{directory}/watch | GET | Watch changes in a directory. |

endpoint
# Building instructions

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
```

# Running instructions

```bash
docker run -d -p 64000:4000 \
	 -v ~/BotpressHomework:/BotpressHomeworkProject \
	 sebhtml/file-explorer-backend:v1

docker run -d -p 63000:3000 sebhtml/file-explorer-frontend:v1
firefox http://localhost:63000/
```

