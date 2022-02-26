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

  const promise = fs.promises.readdir(filePath);
  await promise;

  promise.then(async (files) => {
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
    }).catch((err) => {
      console.log(err);
    });

  }).catch((err) => {
    console.log("unable to read directory " + err);
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

app.listen(4000, () => {
});

