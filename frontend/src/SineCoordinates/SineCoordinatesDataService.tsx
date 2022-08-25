import { store } from "../state";
import { WebSocketHelper } from "../WebSocketHelper";
import {
  updateRealtime,
  replaceLog,
  resetRealtime,
} from "./SineCoordinatesState";

export const getSineData = () => {
  return window.fetch(process.env.REACT_APP_SINE_DATA_URL as string).then(
    (response) => {
      if (response.status === 200) {
        return response.json();
      }
      const { ok, status } = response;
      return { ok, status };
    },
    (error) => {
      // Server AWOL
      return { ok: false, error };
    }
  );
};

export const SineCoordinatesDataService = class {
  websocket: any;
  getLogData() {
    const fetchData = async () => {
      const { ok, data } = await getSineData();
      if (ok) {
        store.dispatch(replaceLog(data));
      }
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
