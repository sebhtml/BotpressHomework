import express from 'express';
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

let watchedDirectories: string[] = [];
let watchedDirectoriesActive: string [];

app.post('/directories/:path/watch', async (req, res) => {
  const filePath: string = req.params.path;
  if (watchedDirectories.indexOf(filePath) === -1) {
    watchedDirectories.push(filePath);
  }
  res.write(JSON.stringify({watchedDirectories: watchedDirectories}));
  res.end();
});

app.get('/watch', async (req, res) => {

  console.log(JSON.stringify(watchedDirectories));
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();

  for (const watchedDirectory of watchedDirectories) {
    fs.watch((watchedDirectory), (eventType, filename) => {
        res.write(`data: ${JSON.stringify({directorypath: watchedDirectory})}\n\n`);
    });
  }

  res.on('close', () => {
    res.end();
  });

});

app.listen(4000, () => {
});

