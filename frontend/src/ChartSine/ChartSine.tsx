import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../state";
import { ChartSine as D3ChartSine } from "../D3/ChartSine";

export const ChartSine = () => {
  // Setup for D3/Chart
  const nodeRef = useRef<null | HTMLDivElement>(null);
  const [grapher, setGrapher] = useState<D3ChartSine | undefined>();

  useEffect(() => {
    const className = "ChartSine";
    const chart = new D3ChartSine({
      domNode: nodeRef.current as HTMLDivElement,
      svg: { width: 500, height: 500, className },
      margin: {
        top: 30,
        right: 30,
        bottom: 40,
        left: 40,
      },
      sine: { frequency: 25 },
      line: { color: "#343a40", width: 2 },
    });

    setGrapher(chart);

    return () => {
      chart.destroy();
      setGrapher(undefined);
    };
  }, []);

  // Redux
  const realtime = useSelector(
    (state: RootState) => state.sineCoordinates.realtime
  );
  useEffect(() => {
    if (grapher?.hasBuilt === true) {
      grapher.update(realtime);
    } else {
      grapher?.build(realtime);
    }
  }, [grapher, realtime]);
  return <div ref={nodeRef} />;
};
