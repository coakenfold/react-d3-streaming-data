const { createLogger, format, transports } = require("winston");

const getLogFileName = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const zeroPrefix = (number: number) => {
    return number < 10 ? "0" + number : number;
  };
  return `${zeroPrefix(day)}-${zeroPrefix(month)}-${date.getFullYear()}`;
};
export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: `./logs/error-${getLogFileName()}.log`,
      level: "error",
    }),
    new transports.File({
      filename: `./logs/combined-${getLogFileName()}.log`,
    }),
  ],
});

logger;
