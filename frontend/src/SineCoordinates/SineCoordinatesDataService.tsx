import { store } from "../state";
import { WebSocketHelper } from "../WebSocketHelper";
import {
  updateRealtime,
  replaceLog,
  resetRealtime,
} from "./SineCoordinatesState";

export const getSineData = () => {
  console.log("getSineData", process.env.REACT_APP_SINE_DATA_URL, process.env);
  return window
    .fetch(process.env.REACT_APP_SINE_DATA_URL as string)
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

export interface iSineCoordinatesDataService {
  onErrorRealtime?: (msg?: any) => void;
  onErrorLog?: (msg?: any) => void;
}
const initialOnErroRealtime = (msg?: any) => {};
const initialOnErrorLog = (msg?: any) => {};
export const SineCoordinatesDataService = class {
  websocket: any;
  onErrorRealtime = initialOnErroRealtime;
  onErrorLog = initialOnErrorLog;
  constructor(opts = {} as iSineCoordinatesDataService) {
    if (opts?.onErrorRealtime) {
      this.onErrorRealtime = opts.onErrorRealtime;
    }
    if (opts?.onErrorLog) {
      this.onErrorLog = opts.onErrorLog;
    }
  }
  getRealtime() {
    this.websocket = new WebSocketHelper({
      url: process.env.REACT_APP_URL_WEBSOCKET_SERVER as string,
      onMessage: (event: any) => {
        store.dispatch(updateRealtime(JSON.parse(event.data)));
      },
      onError: (err) => {
        this.onErrorRealtime(err);
      },
    });
  }
  async init() {
    // Realtime
    store.dispatch(resetRealtime());
    this.getRealtime();

    // Log
    const logResult = await getSineData();
    if (logResult.ok) {
      store.dispatch(replaceLog(logResult.data));
    } else {
      this.onErrorLog(logResult);
    }
  }
  destroy() {
    this.onErrorRealtime = initialOnErroRealtime;
    this.onErrorLog = initialOnErrorLog;
    if (this.websocket.socket.readyState === WebSocket.OPEN) {
      this.websocket.socket.close();
    }
    this.websocket = undefined;
  }
};
