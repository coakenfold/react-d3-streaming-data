import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SineCoordinates } from "./SineCoordinates";
import { AppProviders } from "../AppProviders";

jest.mock("../ChartSine/ChartSine", () => {
  return { ChartSine: () => <div data-testid="chartSineMock"></div> };
});
jest.mock("../TableSine/TableSine", () => {
  return { TableSine: () => <div data-testid="tableSineMock"></div> };
});

describe("SineCoordinates", () => {
  test("Renders", () => {
    render(
      <AppProviders>
        <SineCoordinates />
      </AppProviders>
    );
    // UI elements are in place
    const buttonChart = screen.getByTestId("buttonChart");
    expect(buttonChart).toBeInTheDocument();
    const buttonTable = screen.getByTestId("buttonTable");
    expect(buttonTable).toBeInTheDocument();
    // Chart displayed initially
    const chart = screen.getByTestId("chartSineMock");
    expect(chart).toBeInTheDocument();
  });
  test("Can switch between Table & Chart", () => {
    render(
      <AppProviders>
        <SineCoordinates />
      </AppProviders>
    );

    // Table displayed
    const buttonTable = screen.getByTestId("buttonTable");
    fireEvent.click(buttonTable);
    const table = screen.getByTestId("tableSineMock");
    expect(table).toBeInTheDocument();

    // Chart displayed
    const buttonChart = screen.getByTestId("buttonChart");
    fireEvent.click(buttonChart);
    const chart = screen.getByTestId("chartSineMock");
    expect(chart).toBeInTheDocument();
  });
});
