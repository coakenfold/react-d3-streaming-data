import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./SineCoordinates.css";
import { SineCoordinatesDataService } from "./SineCoordinatesDataService";

import { ChartSine } from "../ChartSine/ChartSine";
import { TableSine } from "../TableSine/TableSine";

export const SineCoordinates = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [dataService, setDataService] = useState<any>();
  const [logError, setLogError] = useState(false);
  const [realtimeError, setRealtimeError] = useState(false);
  useEffect(() => {
    if (dataService === undefined) {
      const sc = new SineCoordinatesDataService({
        onErrorLog: (errLog) => {
          console.log("Error getting logs", errLog);
          setLogError(true);
        },
        onErrorRealtime: (errLog) => {
          console.log("Error connecting to websocket", errLog);
          setRealtimeError(true);
        },
      });
      setDataService(sc);
    }
    if (dataService) {
      dataService.init();
    }
    return () => {
      dataService?.destroy();
    };
  }, [dataService]);
  return (
    <div className="SineCoordinates">
      <Row>
        <Col>
          <h2 className="h3">Sine Coordinates</h2>
        </Col>
        <Col xs="auto">
          <ButtonGroup aria-label="Display">
            <Button
              variant="outline-primary"
              active={tabIndex === 0}
              onClick={() => setTabIndex(0)}
              data-testid="buttonChart"
            >
              Chart
            </Button>
            <Button
              variant="outline-primary"
              active={tabIndex === 1}
              onClick={() => setTabIndex(1)}
              data-testid="buttonTable"
            >
              Table
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        {tabIndex === 0 && (
          <div style={{ maxWidth: "700px", margin: "0 auto" }}>
            {realtimeError === true && (
              <div className="alert alert-info mt-4" role="alert">
                Chart data is temporarily unavailable
              </div>
            )}
            {realtimeError === false && <ChartSine />}
          </div>
        )}
        {tabIndex === 1 && (
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            {logError === true && (
              <div className="alert alert-info mt-4" role="alert">
                Table data is temporarily unavailable
              </div>
            )}
            {logError === false && <TableSine />}
          </div>
        )}
      </Row>
    </div>
  );
};
