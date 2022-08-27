import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";
// import https from "https";
import http from "http";
import WebSocket from "ws";
import cors from "cors";

import { SineDataEmitter } from "./sineDataEmitter";
import { logger, latestLog } from "./logger";
import { convertLogToArray } from "./convertLogToArray";

// ENV
const temp = 1;
console.log("creating different builds", temp);
dotenv.config();
const PORT = process.env.PORT;
const URL = process.env.URL;

// CONSTANTS
const INTERVAL_MS = 1000;

const app: Express = express();

app.use(cors());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  fs.readFile(
    latestLog(),
    { encoding: "utf8", flag: "r" },
    function (err, data) {
      if (err) {
        console.log(err);
        logger.log({
          level: "error",
          ...err,
        });
        next(err);
      } else {
        res.json(convertLogToArray(data));
      }
    }
  );
});

// const server = https.createServer(
//   {
//     key: fs.readFileSync("server.key"),
//     cert: fs.readFileSync("server.cert"),
//   },
//   app
// );
const server = http.createServer(app);

const sineDataEmitter = new SineDataEmitter();
// WebSocket
const wss = new WebSocket.Server({ server });
wss.on("connection", (ws: WebSocket) => {
  const notifyWebSocketInterval = setInterval(() => {
    ws.send(`${JSON.stringify(sineDataEmitter.currentSet)}`);
  }, INTERVAL_MS);

  const wsClearInterval = () => {
    clearInterval(notifyWebSocketInterval);
  };

  ws.on("error", wsClearInterval);
  ws.on("close", wsClearInterval);
  ws.send(`${JSON.stringify(sineDataEmitter.currentSet)}`);
});

// Populate logs when server is running
let populateLogsInterval: ReturnType<typeof setInterval>;
const populateLogs = () => {
  console.log(`Server is updating the sine log`);
  populateLogsInterval = setInterval(() => {
    const nextSet = sineDataEmitter.nextSet();
    logger.log({
      level: "sine",
      message: "SineDataEmitter",
      ...nextSet,
    });
  }, INTERVAL_MS);
};

server.listen(PORT, () => {
  console.log(`⚡️ Server is running at ${URL}:${PORT}`);
  if (populateLogsInterval === undefined) {
    populateLogs();
  }
});
