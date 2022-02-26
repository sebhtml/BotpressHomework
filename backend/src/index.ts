import express from 'express';
import stream from 'stream';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express()

// TODO: move FileInfo to a common module and use import it in the frontend and backend.
interface FileInfo {
  fileName: string,
  isDirectory: boolean
};

app.use(
  cors()
);

app.get("/directories", async (req: express.Request, res: express.Response) => {
  res.write(JSON.stringify({
    directories: [...process.argv].splice(2)
  }));
  res.end();
});

app.get('/directories/:path', async (req, res) => {
  const filePath: string = req.params.path;

  fs.promises.readdir(filePath)
  .then(async (files) => {
    const fileDataPromises: Promise<FileInfo>[] = await files.map(async (file): Promise<FileInfo>  => ({
      fileName: file,
      isDirectory: (await fs.promises.lstat(path.join(filePath, file))).isDirectory()
    }));

    Promise.all(fileDataPromises).then((fileData) => {
      res.write(JSON.stringify({
        filePath: filePath,
        files: fileData
      }));
      res.end();
    }, (err) => {
      console.log(err);
      res.end();
    });

  }, (err) => {
    console.log("unable to read directory " + err);
      res.end();
  });
});


app.get('/directories/:path/watch', async (req, res) => {

  const filePath: string = req.params.path;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();
  try {
    async function* getChanges() {
      let watcher = fs.promises.watch(filePath);
      for await (const event of watcher) {
        yield event.filename;
      }
    };

    for await (const fileName of getChanges()) {
      res.write(`data: ${JSON.stringify(fileName)}\n\n`);
    }
  } catch (err) {
    res.end()
  }

  res.on('close', () => {
    res.end();
  });
});

interface Subscriber {
  id: number;
  res: express.Response;
};

let subscribers: Subscriber[] = [];

let watchedDirectories: string[] = [];

app.post('/directories/:path/watch', async (req, res) => {
  const watchedDirectory: string = req.params.path;

  if (watchedDirectories.indexOf(watchedDirectory) !== -1) {
    res.write(JSON.stringify({ok: true}));
    res.end();
    return;
  }

  watchedDirectories.push(watchedDirectory);

  fs.watch((watchedDirectory), (eventType: string, filename: string | Buffer ) => {
    // distribute the event to all subscribers.
    for (let subscriber of subscribers) {
      subscriber.res.write(`data: ${JSON.stringify({directoryPath: watchedDirectory, fileName: filename})}\n\n`);
    }
  });

  res.write(JSON.stringify({ok: true}));
  res.end();
});

let nextSubscriber: number = 0;

app.get('/events', async (req, res) => {

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();

  const subscriberId = nextSubscriber++;

  subscribers.push({id: subscriberId, res: res});

  res.on('close', () => {
    subscribers = subscribers.filter((x) => x.id !== subscriberId);
    res.end();
  });

});

app.listen(4000, () => {
});

