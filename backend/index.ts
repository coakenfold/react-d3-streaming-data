import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
import https from "https";
import WebSocket from "ws";
import { SineDataEmitter } from "./sineDataEmitter";
import { logger } from "./logger";
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const server = https.createServer(
  {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert"),
  },
  app
);

const wss = new WebSocket.Server({ server });
const sde = new SineDataEmitter();

wss.on("connection", (ws: WebSocket) => {
  var interval = setInterval(() => {
    const next = sde.next();
    logger.log({
      level: "info",
      ...next,
    });
    ws.send(`${JSON.stringify(next)}`);
  }, 1000);

  ws.on("error", () => {
    console.log('websocket "error" event');
    clearInterval(interval);
  });
  ws.on("close", () => {
    console.log('websocket "close" event');
    clearInterval(interval);
  });

  ws.on("message", (message: string) => {
    console.log('websocket "message" event');
    clearInterval(interval);
  });

  ws.send(`${JSON.stringify(sde.current)}`);
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
