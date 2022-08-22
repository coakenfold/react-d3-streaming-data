import React from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import { SineChart } from "./SineChart/SineChart";
import { updateRealtime } from "./SineChart/sineCoordinates";

import { WebSocketHelper } from "./WebSocketHelper";

let sineLogger: any;
function App() {
  const dispatch = useDispatch();
  if (sineLogger === undefined) {
    sineLogger = new WebSocketHelper({
      url: process.env.REACT_APP_URL_WEBSOCKET_SERVER as string,
      onMessage: (event: any) => {
        const datum = JSON.parse(event.data);
        dispatch(updateRealtime(datum));
      },
    });
  }
  return (
    <div className="App">
      <SineChart />
    </div>
  );
}

export default App;
