import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { ChartSine } from "../D3/ChartSine";

export const SineChart = () => {
  // Setup for D3/Chart
  const nodeRef = useRef<null | HTMLDivElement>(null);
  const [ChartContainer, SetChartContainer] = useState<any>();

  useEffect(() => {
    const className = "SineChart";
    const chart = new ChartSine({
      domNode: nodeRef.current as HTMLDivElement,
      svg: { width: 500, height: 500, className },
      margin: {
        top: 30,
        right: 30,
        bottom: 40,
        left: 40,
      },
      dot: { radius: 10 },
      sine: { frequency: 25 },
      line: { color: "black", width: 1 },
    });

    SetChartContainer(chart);

    return () => {
      chart.destroy();
      SetChartContainer(undefined);
    };
  }, []);

  // Redux
  const realtime = useSelector(
    (state: RootState) => state.sineCoordinates.realtime
  );
  useEffect(() => {
    if (ChartContainer?.hasBuilt === true) {
      ChartContainer?.update(realtime);
    } else {
      ChartContainer?.build(realtime);
    }
  }, [ChartContainer, realtime]);
  return <div ref={nodeRef} />;
};
