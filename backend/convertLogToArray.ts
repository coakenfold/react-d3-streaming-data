export interface clientSidelogEntry {
  timestamp: number;
  x: number;
  y: number;
}

export const convertLogToArray = (rawLog: string) => {
  return rawLog.split(`\n`).reduce((acc: clientSidelogEntry[], entry) => {
    if (entry !== "") {
      const { timestamp, x, y } = JSON.parse(entry);
      acc.push({ timestamp, x, y });
    }
    return acc;
  }, []);
};
