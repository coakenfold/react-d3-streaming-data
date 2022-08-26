import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

export const PATH_LOG_COMBINED = "./logs/combined.log";
export const PATH_LOG_ERROR = "./logs/error.log";
export const PATH_LOG_SINE = "./logs/sine.log";

export const customLogLevels = {
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
export const latestLog = () => {
  return `${PATH_LOG_SINE}.${yyyyMmDd()}`;
};
const transportSine: DailyRotateFile = new DailyRotateFile({
  filename: PATH_LOG_SINE + ".%DATE%",
  level: "sine",
});

transportSine.on("rotate", function (oldFilename, newFilename) {
  // do something fun
  console.log("rotation!", oldFilename, newFilename);
});
/**
 * Tweaking Winston to write coordinates to file
 */
export const logger = createLogger({
  levels: customLogLevels.levels,
  level: "info",
  format: format.combine(format.json()),
  transports: [
    transportSine,
    new transports.File({
      filename: PATH_LOG_ERROR,
      level: "error",
    }),
    new transports.File({
      filename: PATH_LOG_COMBINED,
    }),
  ],
});
