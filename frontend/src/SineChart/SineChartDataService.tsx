import { store } from "../store";
import { WebSocketHelper } from "../WebSocketHelper";
import type { SineDatumInterface } from "./SineChartInterfaces";
import { updateRealtime, replaceLog } from "./sineCoordinates";

export const getSineData = () => {
  return window
    .fetch(process.env.REACT_APP_SINE_DATA_URL as string)
    .then((response) => response.json())
    .then((data) => {
      return data as SineDatumInterface[];
    });
};

export const SineChartDataService = class {
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
};
