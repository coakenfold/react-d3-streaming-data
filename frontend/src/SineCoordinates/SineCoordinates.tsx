import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { SineChart } from "../SineChart/SineChart";
import { SineChartDataService } from "../SineChart/SineChartDataService";
import { Table } from "../Table/Table";

const sc = new SineChartDataService();
sc.getRealtime();
sc.getLogData();

export const SineCoordinates = () => {
  const [tabIndex, setTabIndex] = useState(0);

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
              >
                Chart
              </Button>
              <Button
                variant="outline-secondary"
                active={tabIndex === 1}
                onClick={() => setTabIndex(1)}
              >
                Table
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
        <Row>
          {tabIndex === 0 ? (
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
              <SineChart />
            </div>
          ) : (
            <></>
          )}
          {tabIndex === 1 ? <Table /> : <></>}
        </Row>
      </Container>
    </div>
  );
};