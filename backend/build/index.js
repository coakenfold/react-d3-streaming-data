"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const ws_1 = __importDefault(require("ws"));
const cors_1 = __importDefault(require("cors"));
const sineDataEmitter_1 = require("./sineDataEmitter");
const logger_1 = require("./logger");
const convertLogToArray_1 = require("./convertLogToArray");
// ENV
dotenv_1.default.config();
const PORT = process.env.PORT;
const URL = process.env.URL;
// CONSTANTS
const INTERVAL_MS = 1000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get("/", (req, res, next) => {
    fs_1.default.readFile((0, logger_1.latestLog)(), { encoding: "utf8", flag: "r" }, function (err, data) {
        if (err) {
            console.log(err);
            logger_1.logger.log(Object.assign({ level: "error" }, err));
            next(err);
        }
        else {
            res.json((0, convertLogToArray_1.convertLogToArray)(data));
        }
    });
});
const server = https_1.default.createServer({
    key: fs_1.default.readFileSync("server.key"),
    cert: fs_1.default.readFileSync("server.cert"),
}, app);
const sineDataEmitter = new sineDataEmitter_1.SineDataEmitter();
// WebSocket
const wss = new ws_1.default.Server({ server });
wss.on("connection", (ws) => {
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
let populateLogsInterval;
const populateLogs = () => {
    console.log(`Server is updating the sine log`);
    populateLogsInterval = setInterval(() => {
        const nextSet = sineDataEmitter.nextSet();
        logger_1.logger.log(Object.assign({ level: "sine", message: "SineDataEmitter" }, nextSet));
    }, INTERVAL_MS);
};
server.listen(PORT, () => {
    console.log(`⚡️ Server is running at ${URL}:${PORT}`);
    if (populateLogsInterval === undefined) {
        populateLogs();
    }
});
