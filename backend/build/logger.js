"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.latestLog = exports.customLogLevels = exports.PATH_LOG_SINE = exports.PATH_LOG_ERROR = exports.PATH_LOG_COMBINED = void 0;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
exports.PATH_LOG_COMBINED = "./logs/combined.log";
exports.PATH_LOG_ERROR = "./logs/error.log";
exports.PATH_LOG_SINE = "./logs/sine.log";
exports.customLogLevels = {
    levels: {
        sine: 0,
        error: 1,
        info: 2,
        debug: 3,
    },
};
/**
 *
 * @returns "YYYY-MM-DD"
 */
const yyyyMmDd = () => {
    const d = new Date();
    const m1 = d.getMonth() + 1;
    const MM = (m1 < 10 ? "0" : "") + m1;
    return `${d.getFullYear()}-${MM}-${d.getDate()}`;
};
const latestLog = () => {
    return `${exports.PATH_LOG_SINE}.${yyyyMmDd()}`;
};
exports.latestLog = latestLog;
const transportSine = new winston_daily_rotate_file_1.default({
    filename: exports.PATH_LOG_SINE + ".%DATE%",
    level: "sine",
});
transportSine.on("rotate", function (oldFilename, newFilename) {
    // do something fun
    console.log("rotation!", oldFilename, newFilename);
});
/**
 * Tweaking Winston to write coordinates to file
 */
exports.logger = (0, winston_1.createLogger)({
    levels: exports.customLogLevels.levels,
    level: "info",
    format: winston_1.format.combine(winston_1.format.json()),
    transports: [
        transportSine,
        new winston_1.transports.File({
            filename: exports.PATH_LOG_ERROR,
            level: "error",
        }),
        new winston_1.transports.File({
            filename: exports.PATH_LOG_COMBINED,
        }),
    ],
});
