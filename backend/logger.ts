const { createLogger, format, transports } = require("winston");
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

export const logger = createLogger({
  levels: customLogLevels.levels,
  level: "info",
  format: format.combine(format.json()),
  transports: [
    new transports.File({
      filename: PATH_LOG_ERROR,
      level: "error",
    }),
    new transports.File({
      filename: PATH_LOG_SINE,
      level: "sine",
    }),
    ,
    new transports.File({
      filename: PATH_LOG_COMBINED,
    }),
  ],
});
