import { store } from "../state";

import {
  updateRealtime,
  replaceLog,
  resetRealtime,
} from "./SineCoordinatesState";

const URL_LOG =
  process.env.REACT_APP_URL_LOG_PROD || process.env.REACT_APP_URL_LOG_DEV;

const URL_REALTIME =
  process.env.REACT_APP_URL_REALTIME_PROD ||
  process.env.REACT_APP_URL_REALTIME_DEV;

export const fetchSineData = () => {
  return window
    .fetch(URL_LOG as string)
    .then(
      (response) => {
        if (response.status === 200) {
          return response.json();
        }
        return { ok: false, status: response.status };
      },
      (error) => {
        // Server AWOL
        return { ok: false, error };
      }
    )
    .then((data) => {
      if (data.ok === false) {
        return data;
      }
      return { ok: true, data };
    });
};

export enum eAttemptStatus {
  Idle = "IDLE",
  InProgress = "IN_PROGRESS",
  Success = "SUCCESS",
  Error = "ERROR",
}
export enum eAttemptType {
  Log = "LOG",
  Realtime = "REALTIME",
}
export interface iOnAttemptUpdateArg {
  type: eAttemptType;
  status: eAttemptStatus;
  count: number;
  error?: any;
}
export interface iSineCoordinatesDataService {
  onAttemptUpdate?: (attemptStatus: iOnAttemptUpdateArg) => void;
}
const onAttemptUpdateDefault = (attemptStatus: iOnAttemptUpdateArg) => {};
export const SineCoordinatesDataService = class {
  logAttemptsCount: number;
  logAttemptsMax: number;
  logAttemptTimeout: any;
  onAttemptUpdate: iSineCoordinatesDataService["onAttemptUpdate"];
  realtimeAttemptsCount: number;
  realtimeAttemptsMax: number;
  realtimeAttemptTimeout: number | undefined;
  websocket: any;
  constructor(opts = {} as iSineCoordinatesDataService) {
    this.logAttemptsCount = 0;
    this.logAttemptsMax = 5;
    this.logAttemptTimeout = undefined;
    this.onAttemptUpdate = opts?.onAttemptUpdate || onAttemptUpdateDefault;
    this.realtimeAttemptsCount = 0;
    this.realtimeAttemptsMax = 5;
    this.realtimeAttemptTimeout = undefined;
  }
  getRealtime() {
    if (this.websocket === undefined) {
      this.realtimeAttemptsCount++;
      this.onAttemptUpdate?.({
        type: eAttemptType.Realtime,
        status: eAttemptStatus.InProgress,
        count: this.realtimeAttemptsCount,
      });
      this.websocket = new WebSocket(URL_REALTIME as string);

      this.websocket.onopen = () => {
        console.log("[open] Connection established");
        clearTimeout(this.realtimeAttemptTimeout);
        this.onAttemptUpdate?.({
          type: eAttemptType.Realtime,
          status: eAttemptStatus.Success,
          count: this.realtimeAttemptsCount,
        });
        this.realtimeAttemptsCount = 0;
      };

      this.websocket.onmessage = (event: any) => {
        store.dispatch(updateRealtime(JSON.parse(event.data)));
      };

      this.websocket.onclose = (event: any) => {
        if (event.wasClean) {
          console.log(
            `[onclose] Connection closed cleanly, code=${event.code} reason=${event.reason}`
          );
        } else {
          // e.g. server process killed or network down
          // event.code is usually 1006 in this case
          console.log("[onclose] Connection died");
        }
      };

      this.websocket.onerror = (err: any) => {
        this.websocket.close();
        this.websocket = undefined;

        if (this.realtimeAttemptsCount < this.realtimeAttemptsMax) {
          this.realtimeAttemptTimeout = setTimeout(() => {
            this.getRealtime();
          }, 2000) as unknown as number;
        } else {
          this.onAttemptUpdate?.({
            type: eAttemptType.Realtime,
            status: eAttemptStatus.Error,
            count: this.realtimeAttemptsCount,
            error: err,
          });
        }
      };
    }
  }

  async getLog() {
    this.logAttemptsCount++;
    this.onAttemptUpdate?.({
      type: eAttemptType.Log,
      status: eAttemptStatus.InProgress,
      count: this.logAttemptsCount,
    });
    const logResult = await fetchSineData();
    if (logResult.ok) {
      clearTimeout(this.logAttemptTimeout);
      this.onAttemptUpdate?.({
        type: eAttemptType.Log,
        status: eAttemptStatus.Success,
        count: this.logAttemptsCount,
      });
      this.logAttemptsCount = 0;
      store.dispatch(replaceLog(logResult.data));
    } else {
      if (this.logAttemptsCount < this.logAttemptsMax) {
        this.logAttemptTimeout = setTimeout(() => {
          this.getLog();
        }, 2000) as unknown as number;
      } else {
        this.onAttemptUpdate?.({
          type: eAttemptType.Log,
          status: eAttemptStatus.Error,
          count: this.logAttemptsCount,
          error: logResult,
        });
      }
    }
  }
  async init() {
    // Realtime
    store.dispatch(resetRealtime());
    this.getRealtime();

    // Log
    this.getLog();
  }
  destroy() {
    if (this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.close();
    }
    this.logAttemptsCount = 0;
    this.logAttemptsMax = 5;
    this.logAttemptTimeout = undefined;
    this.onAttemptUpdate = onAttemptUpdateDefault;
    this.realtimeAttemptsCount = 0;
    this.realtimeAttemptsMax = 5;
    this.realtimeAttemptTimeout = undefined;
    this.websocket = undefined;
  }
};
