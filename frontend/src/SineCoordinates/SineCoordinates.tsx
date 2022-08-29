import React, { useState, useEffect } from "react";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "./SineCoordinates.css";
import {
  SineCoordinatesDataService,
  eAttemptType,
  iOnAttemptUpdateArg,
  eAttemptStatus,
} from "./SineCoordinatesDataService";

import { ChartSine } from "../ChartSine/ChartSine";
import { TableSine } from "../TableSine/TableSine";

export const SineCoordinates = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [dataService, setDataService] = useState<any>();
  const [realtimeStatus, setRealtimeStatus] = useState<iOnAttemptUpdateArg>({
    type: eAttemptType.Realtime,
    status: eAttemptStatus.Idle,
    count: 0,
  });
  const [logStatus, setLogStatus] = useState<iOnAttemptUpdateArg>({
    type: eAttemptType.Log,
    status: eAttemptStatus.Idle,
    count: 0,
  });
  useEffect(() => {
    if (dataService === undefined) {
      const sc = new SineCoordinatesDataService({
        onAttemptUpdate: (attemptStatus) => {
          if (attemptStatus.type === eAttemptType.Realtime) {
            setRealtimeStatus(attemptStatus);
          }
          if (attemptStatus.type === eAttemptType.Log) {
            setLogStatus(attemptStatus);
          }
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
              data-testid="buttonRealtime"
            >
              Chart
            </Button>
            <Button
              variant="outline-primary"
              active={tabIndex === 1}
              onClick={() => setTabIndex(1)}
              data-testid="buttonLog"
            >
              Table
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row>
        {tabIndex === 0 && (
          <div data-testid="groupRealtime">
            {realtimeStatus.error && (
              <div className="alert alert-danger mt-4" role="alert">
                {realtimeStatus.count} - The chart data is unavailable at this
                time
              </div>
            )}
            {realtimeStatus.status === eAttemptStatus.InProgress && (
              <div className="alert alert-warning mt-4" role="alert">
                {realtimeStatus.count} - Fetching chart data
              </div>
            )}
            {realtimeStatus.status === eAttemptStatus.Success && <ChartSine />}
          </div>
        )}
        {tabIndex === 1 && (
          <div data-testid="groupLog">
            {logStatus.error && (
              <div className="alert alert-danger mt-4" role="alert">
                {logStatus.count} - The table data is unavailable at this time
              </div>
            )}
            {logStatus.status === eAttemptStatus.InProgress && (
              <div className="alert alert-warning mt-4" role="alert">
                {logStatus.count} - Fetching table data
              </div>
            )}
            {logStatus.status === eAttemptStatus.Success && <TableSine />}
          </div>
        )}
      </Row>
    </div>
  );
};
