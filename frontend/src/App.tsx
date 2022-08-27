import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { AppProviders } from "./AppProviders";
import { SineCoordinates } from "./SineCoordinates/SineCoordinates";

export const App = () => {
  return (
    <AppProviders>
      <SineCoordinates />
    </AppProviders>
  );
};

export default App;
