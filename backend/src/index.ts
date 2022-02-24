import express from 'express';
import cors from 'cors';

const app = express()

app.use(
  cors({
    origin: "http://localhost:63000"
  }
));

app.get("/directories", (req: express.Request, res: express.Response) => {
  res.write(JSON.stringify({
    directories: ["/boot", "/proc", "/home"]
  }));
  res.end();
});

app.get('/directories/:path', (req, res) => {
  const absolutePath: string = req.params.path;
  res.write(JSON.stringify({
    absolutePath: absolutePath,
    files: ["Bot.ts", "Api.ts", "Frontend.ts"]
  }));
  res.end();
});

app.listen(4000, () => {
  console.log("Listening on port");
});

