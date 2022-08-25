import React from "react";
import { render, screen } from "@testing-library/react";
import { TableSine } from "./TableSine";
import { AppProviders } from "../AppProviders";

import { store } from "../state";
import { replaceLog } from "../SineCoordinates/SineCoordinatesState";
describe("TableSine", () => {
  test("Renders", () => {
    const tableData = [
      {
        timestamp:
          "Thu Aug 25 2022 09:07:58 GMT-0400 (Eastern Daylight Saving Time)",
        x: 1,
        y: 1,
      },
    ];
    store.dispatch(replaceLog(tableData));

    render(
      <AppProviders>
        <TableSine />
      </AppProviders>
    );

    // UI elements are in place
    const buttonLatestData = screen.getByText(/Get latest data/i);
    expect(buttonLatestData).toBeInTheDocument();
    const buttonPreviousData = screen.getAllByText(/Previous/); // visually hidden
    expect(buttonPreviousData[0]).toBeInTheDocument();

    // Renders Redux data
    const renderedData = screen.getByText(/09:07:58/i);
    expect(renderedData).toBeInTheDocument();
  });
});
