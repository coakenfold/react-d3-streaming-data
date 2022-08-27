"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertLogToArray = void 0;
const convertLogToArray = (rawLog) => {
    return rawLog.split(`\n`).reduce((acc, entry) => {
        if (entry !== "") {
            const { timestamp, x, y } = JSON.parse(entry);
            acc.push({ timestamp, x, y });
        }
        return acc;
    }, []);
};
exports.convertLogToArray = convertLogToArray;
