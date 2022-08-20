import React from "react";
import "./App.css";
import { ChartWrapper } from "./ChartWrapper";
import { websocket } from "./websocket";
websocket();
function App() {
  return (
    <div className="App">
      <ChartWrapper />
    </div>
  );
}

export default App;
