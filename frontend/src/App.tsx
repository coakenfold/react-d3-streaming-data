import React, { useState } from "react";
import "./App.css";
import { SineChart } from "./SineChart/SineChart";
import { SineChartDataService } from "./SineChart/SineChartDataService";

import { Table } from "./Table/Table";

const sc = new SineChartDataService();
sc.getRealtime();
sc.getLogData();

export const App = () => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <>
      <div className="App">
        <button onClick={() => setTabIndex(0)}>Chart</button>
        <button onClick={() => setTabIndex(1)}>Table</button>
        {tabIndex === 0 ? <SineChart /> : <></>}
        {tabIndex === 1 ? <Table /> : <></>}
      </div>
    </>
  );
};

export default App;
