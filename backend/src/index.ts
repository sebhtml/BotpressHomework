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

app.get("/directories", (req: express.Request, res: express.Response) => {
  res.write(JSON.stringify({
    directories: [...process.argv].splice(2)
  }));
  res.end();
});

app.get('/directories/:path', (req, res) => {
  const filePath: string = req.params.path;

  fs.readdir(filePath, (err, files) => {
    if (err) {
      return console.log("unable to read directory " + err);
    }

    const fileData: FileInfo[] = files.map((file) => ({
      fileName: file,
      isDirectory: fs.lstatSync(path.join(filePath, file)).isDirectory()
    }));

    res.write(JSON.stringify({
      filePath: filePath,
      files: fileData
    }));

    res.end();
  });
});


app.get('/directories/:path/watch', (req, res) => {

  const filePath: string = req.params.path;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();

  fs.watch(filePath, (event, fileName) => {
    if (fileName) {
      const data = {
        filePath: filePath
      };
      // The \n\n is necessary to force a flush.
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  });

  res.on('close', () => {
    res.end();
  });

});

app.listen(4000, () => {
});

