import express from 'express';

const app = express()

app.get("/directories", (req: express.Request, res: express.Response) => {
  res.write(JSON.stringify({
    directories: ["/boot", "/proc", "/home"]
  }));
  res.end();
});

app.listen(4000, () => {
  console.log("Listening on port");
});

