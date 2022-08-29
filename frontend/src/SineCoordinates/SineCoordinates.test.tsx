import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SineCoordinates } from "./SineCoordinates";
import { AppProviders } from "../AppProviders";

describe("SineCoordinates", () => {
  test("Renders", () => {
    render(
      <AppProviders>
        <SineCoordinates />
      </AppProviders>
    );
    // UI elements are in place
    const buttonRealtime = screen.getByTestId("buttonRealtime");
    expect(buttonRealtime).toBeInTheDocument();
    const buttonLog = screen.getByTestId("buttonLog");
    expect(buttonLog).toBeInTheDocument();
    // Chart displayed initially
    const chart = screen.getByTestId("groupRealtime");
    expect(chart).toBeInTheDocument();
  });
  test("Can switch between Table & Chart", () => {
    render(
      <AppProviders>
        <SineCoordinates />
      </AppProviders>
    );

    // Table group displayed
    const buttonLog = screen.getByTestId("buttonLog");
    fireEvent.click(buttonLog);
    const table = screen.getByTestId("groupLog");
    expect(table).toBeInTheDocument();

    // Chart group displayed
    const buttonRealtime = screen.getByTestId("buttonRealtime");
    fireEvent.click(buttonRealtime);
    const chart = screen.getByTestId("groupRealtime");
    expect(chart).toBeInTheDocument();
  });
});
