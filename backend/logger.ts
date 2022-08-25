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

const transportSine: DailyRotateFile = new DailyRotateFile({
  filename: PATH_LOG_SINE + ".%DATE%",
  level: "sine",
});

transportSine.on("rotate", function (oldFilename, newFilename) {
  // do something fun
  console.log("rotation!", oldFilename, newFilename);
});

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
