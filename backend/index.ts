import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import fs from "fs";

import http from "http";
import WebSocket from "ws";
import cors from "cors";

import { SineDataEmitter } from "./sineDataEmitter";
import { logger, latestLog } from "./logger";
import { convertLogToArray } from "./convertLogToArray";

// ENV
dotenv.config();
const PORT = process.env.PORT;

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
  console.log(`⚡️ BE server is updating the logs`);
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
  console.log(`⚡️ BE server running on port ${PORT}`);

  if (populateLogsInterval === undefined) {
    populateLogs();
  }
});
