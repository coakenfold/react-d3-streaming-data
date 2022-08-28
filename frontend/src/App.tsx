import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { AppProviders } from "./AppProviders";
import { SineCoordinates } from "./SineCoordinates/SineCoordinates";

export const App = () => {
  return (
    <div className="App">
      <AppProviders>
        <SineCoordinates />
      </AppProviders>
    </div>
  );
};

export default App;
