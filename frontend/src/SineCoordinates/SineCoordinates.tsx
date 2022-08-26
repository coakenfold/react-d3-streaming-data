import React, { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
    <div className="SineComponent">
      <Container>
        <Row className="mb-3 mt-3">
          <Col>
            <h2 className="h2">Sine Coordinates</h2>
          </Col>
          <Col xs="auto">
            <ButtonGroup aria-label="Display">
              <Button
                variant="outline-secondary"
                active={tabIndex === 0}
                onClick={() => setTabIndex(0)}
                data-testid="buttonChart"
              >
                Chart
              </Button>
              <Button
                variant="outline-secondary"
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
                <div className="alert alert-info" role="alert">
                  Realtime updates are temporarily unavailable
                </div>
              )}
              {realtimeError === false && <ChartSine />}
            </div>
          )}
          {tabIndex === 1 && (
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              {logError === true && (
                <div className="alert alert-info" role="alert">
                  Sine logs are temporarily unavailable
                </div>
              )}
              {logError === false && <TableSine />}
            </div>
          )}
        </Row>
      </Container>
    </div>
  );
};
