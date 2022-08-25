import { store } from "../state";
import { WebSocketHelper } from "../WebSocketHelper";
import type { iSineDatum } from "./SineCoordinatesInterfaces";
import {
  updateRealtime,
  replaceLog,
  resetRealtime,
} from "./SineCoordinatesState";

export const getSineData = () => {
  return window
    .fetch(process.env.REACT_APP_SINE_DATA_URL as string)
    .then((response) => response.json())
    .then((data) => {
      return data as iSineDatum[];
    });
};

export const SineCoordinatesDataService = class {
  websocket: any;
  getLogData() {
    const fetchData = async () => {
      const data = await getSineData();
      store.dispatch(replaceLog(data));
    };
    fetchData();
  }
  getRealtime() {
    this.websocket = new WebSocketHelper({
      url: process.env.REACT_APP_URL_WEBSOCKET_SERVER as string,
      onMessage: (event: any) => {
        store.dispatch(updateRealtime(JSON.parse(event.data)));
      },
    });
  }
  init() {
    store.dispatch(resetRealtime());
    this.getLogData();
    this.getRealtime();
  }
  destroy() {
    if (this.websocket.socket.readyState === WebSocket.OPEN) {
      this.websocket.socket.close();
    }
    this.websocket = undefined;
  }
};
